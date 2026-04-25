import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDocs, getDoc } from "firebase/firestore";
import imaps from 'imap-simple';
import { simpleParser } from 'mailparser';
import * as dotenv from 'dotenv';
import { sendAlertEmail } from './mailer.js';
import * as XLSX from 'xlsx';
import * as cheerio from 'cheerio';

dotenv.config();

const firebaseConfig = {
  apiKey: "AIzaSyCj__TCfYSF-1y4uR-UOId_aPWWwy4-W5A",
  authDomain: "hscaterhub.firebaseapp.com",
  projectId: "hscaterhub",
  storageBucket: "hscaterhub.firebasestorage.app",
  messagingSenderId: "191852835453",
  appId: "1:191852835453:web:6e8498beaecbb85f637714"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// First fetch auth dynamically from Firebase dashboard if configured
const crawlerDoc = await getDoc(doc(db, 'system', 'crawlers'));
const emailStr = crawlerDoc.exists() ? crawlerDoc.data()['Email Source']?.cookie : null;

let emailUser = process.env.EMAIL_USER;
let emailPass = process.env.EMAIL_APP_PASSWORD;

if (emailStr && emailStr.includes(',')) {
    const parts = emailStr.split(',');
    emailUser = parts[0].trim();
    emailPass = parts[1].trim();
}

const config = {
    imap: {
        user: emailUser,
        password: emailPass,
        host: 'imap.gmail.com',
        port: 993,
        tls: true,
        tlsOptions: { rejectUnauthorized: false },
        authTimeout: 3000
    }
};

async function processForkableEmail(text, htmlStr = "", attachments = []) {
    console.log("-> Parsing Forkable payload via Enhanced Parser (Excel + HTML)...");
    
    // 1. Get the general date
    let dateMatch = text.match(/DATE\[?\n\s*\]?\s*(.+?202\d|.+?(?=LOCATION|\n\n))/i) || 
                    text.match(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[ a-z]*\s+\d{1,2}(?:\s*,\s*202\d)?/i) ||
                    text.match(/Forkable Pickup(?: Date)?\s+([A-Za-z]+ \d{1,2}, \d{4})/i) ||
                    text.match(/Forkable Pickup\s+(?:[A-Za-z]+,\s*)?([A-Za-z]+\s+\d{1,2})/i); // Matches: Forkable Pickup Thursday, Apr 23
    
    let rawDateStr = dateMatch ? (dateMatch[1] || dateMatch[0]) : new Date().toDateString();
    let cleanDate = new Date(rawDateStr);
    
    // Fix: If year is omitted, JS defaults to year 2001. We need to enforce current year.
    if((isNaN(cleanDate.getTime()) || cleanDate.getTime() === 0 || cleanDate.getFullYear() === 2001) && rawDateStr) {
        cleanDate = new Date(`${rawDateStr.replace(/^[A-Za-z]+,\s*/, '')} ${new Date().getFullYear()}`);
    }
    
    const year = cleanDate.getFullYear();
    const month = (cleanDate.getMonth() + 1).toString().padStart(2, '0');
    const day = cleanDate.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    
    let sfDateStr = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles", year: 'numeric', month: 'numeric', day: 'numeric' });
    let sfTodayMidnight = new Date(sfDateStr);
    let currentStatus = cleanDate < sfTodayMidnight ? "Completed" : "New";

    // 2. Fetch menu items for matching
    let menuItemsMap = [];
    try {
        const menuDocs = await getDocs(collection(db, 'menus'));
        menuItemsMap = menuDocs.docs.map(d => d.data());
        menuItemsMap.sort((a,b) => b.title.length - a.title.length);
    } catch(e) { console.log("Menu match fallback failed.", e); }

    let allGroups = {};
    let earliestTimeFallback = "10:30AM";
    let xlsxAttachments = attachments.filter(a => a.filename && a.filename.toLowerCase().endsWith('.xlsx'))
                                       .sort((a, b) => (a.filename.toLowerCase().includes('orders') ? -1 : 1));

    // SCENARIO 1: Process Excel Attachment
    for (const xlsxAttach of xlsxAttachments) {
        console.log(`- Processing Excel for Grouping: ${xlsxAttach.filename}...`);
        try {
            const workbook = XLSX.read(xlsxAttach.content, { type: 'buffer' });
            console.log(`- Workbook Sheets: ${workbook.SheetNames.join(', ')}`);
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            console.log(`- Spreadsheet has ${data.length} rows.`);
            if (data.length > 0) console.log(`- Row 0 Raw: ${JSON.stringify(data[0])}`);
            if (data.length > 1) console.log(`- Row 1 Raw: ${JSON.stringify(data[1])}`);
            if (data.length > 2) console.log(`- Row 2 Raw: ${JSON.stringify(data[2])}`);

            let lastClub = "";
            let lastTime = earliestTimeFallback;
            data.forEach((row, idx) => {
                if (!row || idx < 1) return; 
                
                let mealRaw = String(row[1] || "").trim();
                let clubCode = String(row[5] || "").trim();
                let pickupTime = String(row[6] || "").trim();

                // Forward fill for merged cells
                if (clubCode) lastClub = clubCode;
                else clubCode = lastClub;

                if (pickupTime) lastTime = pickupTime;
                else pickupTime = lastTime;

                console.log(`  [Row ${idx}] Meal: "${mealRaw}", Club: "${clubCode}"`);

                // Skip header/footer noise, but allow specific names even if they contain 'meal'
                if (!mealRaw || !clubCode) return;
                const lowMeal = mealRaw.toLowerCase();
                if (lowMeal === 'meal' || lowMeal.includes('total') || lowMeal.includes('holy shred') || lowMeal.includes('regular individual')) return;

                let optionsRaw = String(row[2] || "").trim();
                let specialNotes = String(row[3] || "").trim();

                if (!allGroups[clubCode]) {
                    allGroups[clubCode] = {
                        items: [],
                        time: pickupTime,
                        subtotal: 0
                    };
                }

                // 1. Process Main Meal
                let matchedMeal = mealRaw;
                for (const m of menuItemsMap) {
                    if (mealRaw.toLowerCase().includes(m.title.toLowerCase()) || 
                        (m.platformOverrides?.Forkable?.alias && mealRaw.toLowerCase().includes(m.platformOverrides.Forkable.alias.toLowerCase()))) {
                        matchedMeal = m.title;
                        break;
                    }
                }
                allGroups[clubCode].items.push({ name: matchedMeal, amount: 1, notes: specialNotes });

                // 2. Process Side (if "Add Side:" exists in Column C)
                if (optionsRaw.toLowerCase().includes("add side:")) {
                    let sideRaw = optionsRaw.replace(/add side[:\s]*/i, '').trim();
                    let matchedSide = sideRaw;
                    for (const m of menuItemsMap) {
                        if (sideRaw.toLowerCase().includes(m.title.toLowerCase()) || 
                            (m.platformOverrides?.Forkable?.alias && sideRaw.toLowerCase().includes(m.platformOverrides.Forkable.alias.toLowerCase()))) {
                            matchedSide = m.title;
                            break;
                        }
                    }
                    allGroups[clubCode].items.push({ name: matchedSide, amount: 1, notes: "" });
                }
            });
            if (Object.keys(allGroups).length > 0) break;
        } catch (e) { console.error(`❌ Excel Grouping Error:`, e); }
    }

    // SCENARIO 2: HTML Fallback (If no Excel)
    if (Object.keys(allGroups).length === 0 && htmlStr) {
        console.log("- No Excel found. Parsing HTML table with grouping...");
        const $ = cheerio.load(htmlStr);
        
        // 2a. Check for regular tables
        let lastClub = "";
        let lastTime = earliestTimeFallback;
        $('table tr').each((i, row) => {
            const cells = $(row).children('td, th');
            if (cells.length >= 6) { 
                let mealTxt = $(cells[1]).text().trim();
                let clubTxt = $(cells[5]).text().trim();
                let timeTxt = $(cells[6]).text().trim();
                let notes = $(cells[3]).text().trim(); 

                if (clubTxt) lastClub = clubTxt;
                else clubTxt = lastClub;

                if (timeTxt) lastTime = timeTxt;
                else timeTxt = lastTime;

                if (mealTxt && clubTxt) {
                    const lowMeal = mealTxt.toLowerCase();
                    if (lowMeal === 'meal' || lowMeal.includes('total') || lowMeal.includes('regular individual')) return;

                    if (!allGroups[clubTxt]) {
                        allGroups[clubTxt] = { items: [], time: timeTxt || lastTime, subtotal: 0 };
                    }
                    
                    let matchedMeal = mealTxt;
                    for (const m of menuItemsMap) {
                        if (mealTxt.toLowerCase().includes(m.title.toLowerCase()) || 
                            (m.platformOverrides?.Forkable?.alias && mealTxt.toLowerCase().includes(m.platformOverrides.Forkable.alias.toLowerCase()))) {
                            matchedMeal = m.title; break;
                        }
                    }
                    allGroups[clubTxt].items.push({ name: matchedMeal, amount: 1, notes: notes });

                    // Sides in Column C
                    let optionsTxt = $(cells[2]).text().trim();
                    if (optionsTxt.toLowerCase().includes("add side:")) {
                        let sideRaw = optionsTxt.replace(/add side[:\s]*/i, '').trim();
                        let matchedSide = sideRaw;
                        for (const m of menuItemsMap) {
                            if (sideRaw.toLowerCase().includes(m.title.toLowerCase()) || 
                                (m.platformOverrides?.Forkable?.alias && sideRaw.toLowerCase().includes(m.platformOverrides.Forkable.alias.toLowerCase()))) {
                                matchedSide = m.title; break;
                            }
                        }
                        allGroups[clubTxt].items.push({ name: matchedSide, amount: 1, notes: "" });
                    }
                }
            }
        });

        // 2b. Ad-hoc "Action Required" section (no club info usually, so we default to "ALL" or skip)
        const adHocHeader = $('td:contains("Requested Additional Meals"), b:contains("Requested Additional Meals")').last();
        if (adHocHeader.length > 0) {
            console.log("- Processing Ad-hoc additions from Action Required email...");
            $('tr, div, p').each((i, el) => {
                const text = $(el).text();
                const match = text.match(/([A-Z][a-z0-9]*\s+[A-Z][a-z]*)\s+(.+?)\s+\$([0-9.]+)/);
                if (match) {
                    let dishRaw = match[2].trim();
                    let club = "AD-HOC"; 
                    if (!allGroups[club]) allGroups[club] = { items: [], time: earliestTimeFallback, subtotal: 0 };
                    
                    let matchedMeal = dishRaw;
                    for (const m of menuItemsMap) {
                        if (dishRaw.toLowerCase().includes(m.title.toLowerCase())) { matchedMeal = m.title; break; }
                    }
                    allGroups[club].items.push({ name: matchedMeal, amount: 1, notes: "" });
                }
            });
        }
    }

    if (Object.keys(allGroups).length === 0) {
        console.log("No grouped items found for Forkable.");
        return;
    }

    // Sync each group as a separate order
    for (const [club, groupData] of Object.entries(allGroups)) {
        // Consolidate items within the group
        let consolidated = {};
        for (const fi of groupData.items) {
            let key = fi.name + "|||" + (fi.notes || "");
            if (!consolidated[key]) consolidated[key] = { ...fi };
            else consolidated[key].amount += fi.amount;
        }
        let finalItems = Object.values(consolidated);

        let orderId = club; // The order ID is identified by column F
        
        let newOrder = {
            id: orderId, // The true ID as requested
            platform: "Forkable",
            customerName: `Forkable ${club}`,
            typeOfOrder: "Meal Manager",
            deliveryDate: formattedDate,
            deliveryTime: groupData.time,
            deliveryMethod: "Platform",
            pickUpTime: groupData.time,
            subtotal: 0, 
            total: 0,
            netPayout: 0,
            status: currentStatus,
            overallNotes: `Group: ${club}. Source: Excel.`,
            items: finalItems,
            createdAt: new Date().toISOString()
        };

        const docRef = doc(db, 'orders', `FRK-${club}-${formattedDate.replace(/-/g,'')}`); // Keep unique path in db to prevent overwriting other days
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && (docSnap.data().manualOverride || docSnap.data().isDeleted)) {
            console.log(`- Skipped grouped Forkable order ${orderId} (Manual Override).`);
            continue;
        }

        await setDoc(docRef, newOrder, { merge: true });
        console.log(`📠 Synced grouped Forkable order: ${orderId}`);
    }
}

async function processDoordashEmail(text) {
    console.log("-> Parsing Doordash payload...");
    
    let subjectMatch = text.match(/New Catering Order for (.+) - ([a-zA-Z0-9]+)/i);
    let valueMatch = 
        text.match(/Order Value[\s\S]{0,50}?\$([0-9,.]+)/i) || 
        text.match(/Total Charged[\s\S]{0,100}?\$([0-9,.]+)/i) || 
        text.match(/Subtotal[\s\S]{0,100}?\$([0-9,.]+)/i);

    if (!subjectMatch && !valueMatch) {
        console.log("❌ Bypass generic Doordash email (Not a catering order payload).");
        return;
    }

    let orderIdFromSub = subjectMatch ? subjectMatch[2] : Math.floor(Math.random() * 100000).toString();

    let fallbackDateMatch = text.match(/Drop Off Date[\s\S]{0,50}?([A-Za-z]{3},\s*[A-Za-z]{3}\s*\d{1,2},\s*\d{4})/i) || text.match(/Drop Off Date.*\n\s*(.*)/i); 
    let fallbackTimeMatch = text.match(/Drop Off Time[\s\S]{0,50}?([0-9:]+\s*[APM]+)/i) || text.match(/Drop Off Time.*\n\s*(.*)/i);
    
    let pickupDateMatch = text.match(/Estimated Pickup Time[\s\S]{1,150}?([A-Z][a-z]{2}\s+\d{1,2},\s+\d{4})(?:,\s+([0-9:]+\s+[APM]+))?/i);
    let locationMatch = text.match(/Location\s*(.*?)(?=\s*Preparation|$|View Order)/is);
    
    let customerRaw = subjectMatch ? subjectMatch[1].trim() : "Doordash Customer";

    let rawDate = new Date().toDateString();
    let pickupTime = "12:00 PM";

    if (pickupDateMatch) {
        rawDate = pickupDateMatch[1].trim();
        if (pickupDateMatch[2]) pickupTime = pickupDateMatch[2].trim();
    } else if (fallbackDateMatch) {
        rawDate = fallbackDateMatch[1].trim();
        if (fallbackTimeMatch) pickupTime = fallbackTimeMatch[1].trim();
    }

    let cleanDate = new Date(rawDate);
    if(isNaN(cleanDate.getTime())) cleanDate = new Date();

    let year = cleanDate.getFullYear().toString();
    let month = (cleanDate.getMonth() + 1).toString().padStart(2, '0');
    let day = cleanDate.getDate().toString().padStart(2, '0');
    let formattedDate = `${year}-${month}-${day}`;

    let subtotal = valueMatch ? parseFloat(valueMatch[1].replace(/,/g, '')) : 0;
    let location = locationMatch ? locationMatch[1].replace(/\s+/g, ' ').trim() : "Unknown Location";

    let orderId = `DD-${month}${day}-${orderIdFromSub}`;
    
    let sfDateStr = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles", year: 'numeric', month: 'numeric', day: 'numeric' });
    let sfTodayMidnight = new Date(sfDateStr);
    let currentStatus = cleanDate < sfTodayMidnight ? "Completed" : "New";
    
    let parsedItems = [];
    let lines = text.split(/\r?\n/);
    
    let menuItemsMap = [];
    try {
        const menuDocs = await getDocs(collection(db, 'menus'));
        menuItemsMap = menuDocs.docs.map(d => d.data());
        menuItemsMap.sort((a,b) => b.title.length - a.title.length);
    } catch(e) {
        console.log("Menu match fallback for DoorDash.");
    }

    for (const l of lines) {
        let m = l.match(/^\s*(\d+)[xX]\s+([^$]+)\s*\$([0-9.,]+)/);
        if (!m) m = l.match(/^\s*(\d+)[xX]\s+(.+)/);
        
        if (m) {
            let amount = parseInt(m[1]);
            let rawName = m[2].replace(/\s*\$[0-9.,]+/, '').trim();
            
            let cleanName = rawName.replace(/^\*+/, '').replace(/\*+$/, '').trim();
            cleanName = cleanName.replace(/\s*\([^)]+\)$/, '').trim();
            if (cleanName.endsWith('(Add-ons)')) cleanName = cleanName.replace(/\(Add-ons\)/, '').trim();
            cleanName = cleanName.replace(/^\*+/, '').replace(/\*+$/, '').trim();

            let matchedName = cleanName;
            for (const mObj of menuItemsMap) {
                let match = cleanName.toLowerCase().includes(mObj.title.toLowerCase());
                if (!match && mObj.platformOverrides && mObj.platformOverrides['DoorDash'] && mObj.platformOverrides['DoorDash'].alias) {
                    match = cleanName.toLowerCase().includes(mObj.platformOverrides['DoorDash'].alias.toLowerCase());
                }
                if (!match && mObj.aliases) {
                    match = mObj.aliases.some(a => cleanName.toLowerCase().includes(a.toLowerCase()));
                }
                if (match) {
                    matchedName = mObj.title;
                    break;
                }
            }

            parsedItems.push({ 
                name: matchedName, 
                amount: amount, 
                notes: rawName !== matchedName ? rawName : "" 
            });
        }
    }

    if (parsedItems.length === 0) {
        parsedItems = [{ name: "DoorDash Catering Bundle", amount: 1, notes: "" }];
    }

    let newOrder = {
        id: orderId,
        platform: "DoorDash",
        customerName: customerRaw,
        typeOfOrder: "Catering",
        deliveryDate: formattedDate,
        deliveryTime: pickupTime,
        deliveryMethod: "Platform",
        pickUpTime: pickupTime,
        subtotal: subtotal,
        total: subtotal,
        netPayout: subtotal,
        status: currentStatus,
        overallNotes: "Doordash catering order via email. Deliver Address: " + location,
        items: parsedItems,
        createdAt: new Date().toISOString()
    };
    
    const docRef = doc(db, 'orders', newOrder.id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && (docSnap.data().manualOverride || docSnap.data().isDeleted)) {
        console.log(`[DoorDash] Skipped (Manual Override): ${newOrder.id}`);
        return;
    }
    await setDoc(docRef, newOrder, { merge: true });
    console.log(`📠 Synced Doordash Order ${newOrder.id}`);
}

async function run() {
    console.log("🚀 Starting Native IMAP Email Listener Component...");

    if(!emailUser) {
        console.error("Missing EMAIL_USER or EMAIL_APP_PASSWORD! Run halted.");
        await setDoc(doc(db, 'system', 'crawlers'), { 'Email Source': { status: 'Expired', lastRun: new Date().toLocaleString() } }, { merge: true });
        process.exit(1);
    }

    imaps.connect(config).then(function (connection) {
        console.log("✅ IMAP Connected.");
        return connection.openBox('INBOX').then(async function () {
            console.log("✅ INBOX Opened.");
            // Dynamically look strictly at emails received only within the last 48 hours to minimize log spam
            const lookbackDate = new Date();
            lookbackDate.setDate(lookbackDate.getDate() - 2);
            const searchCriteria = [
                ['SINCE', lookbackDate],
                ['OR', ['SUBJECT', 'Forkable Pickup'], ['OR', ['SUBJECT', 'Confirm Changes'], ['OR', ['SUBJECT', 'Action Required'], ['OR', ['SUBJECT', 'Doordash'], ['SUBJECT', 'New Catering Order']]]]]
            ];
            const fetchOptions = {
                bodies: ['HEADER', 'TEXT', ''],
                markSeen: false 
            };

            console.log("📡 Scanning Inbox for delivery emails...");
            try {
                let messages = await connection.search(searchCriteria, fetchOptions);
                console.log(`✉️ Search returned ${messages.length} messages.`);

                for (let item of messages) {
                    let all = item.parts.find(p => p.which === '');
                    let subjectHeader = (item.parts.find(p => p.which === 'HEADER').body.subject || [''])[0] || '';
                    
                    console.log(`[Email Scraper] Processing subject: "${subjectHeader}"`);
                    try {
                        let parsedMail = await simpleParser(all.body);
                        let bodyText = parsedMail.text || "";
                        let combinedText = subjectHeader + "\n\n" + bodyText;
                        if (subjectHeader.toLowerCase().includes('forkable') || subjectHeader.toLowerCase().includes('confirm changes') || subjectHeader.toLowerCase().includes('action required')) {
                            await processForkableEmail(combinedText, parsedMail.html, parsedMail.attachments);
                        } else if (subjectHeader.toLowerCase().includes('doordash') || subjectHeader.toLowerCase().includes('new catering order')) {
                            await processDoordashEmail(combinedText);
                        }
                    } catch(e) {
                         console.error(`❌ Failed to parse email:`, e);
                    }
                }
                
                connection.end();
                process.exit(0);
            } catch(e) {
                console.error("Search Error: ", e);
                connection.end();
                process.exit(1);
            }
        });
    }).catch(async err => {
        console.error("Authentication Error: ", err);
        await setDoc(doc(db, 'system', 'crawlers'), { 'Email Source': { status: 'Expired', lastRun: new Date().toLocaleString() } }, { merge: true });
        await sendAlertEmail(db, 'Email Source');
        process.exit(1);
    });
}

run().then(async () => {
    await setDoc(doc(db, 'system', 'crawlers'), { 'Email Source': { status: 'Active', lastRun: new Date().toLocaleString() } }, { merge: true });
});
