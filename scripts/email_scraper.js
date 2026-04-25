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

// Fetch auth dynamically from Firebase
const crawlerDoc = await getDoc(doc(db, 'system', 'crawlers'));
const emailStr = crawlerDoc.exists() ? crawlerDoc.data()['Email Source']?.cookie : null;

let emailUser = process.env.EMAIL_USER;
let emailPass = process.env.EMAIL_APP_PASSWORD;

if (emailUser && emailUser.includes(',') && !emailPass) {
    const parts = emailUser.split(',');
    emailUser = parts[0].trim();
    emailPass = parts[1].trim();
} else if (emailStr && emailStr.includes(',')) {
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
    console.log("-> Parsing Forkable payload via Consolidated Parser...");
    
    // 1. Get the delivery date
    let dateMatch = text.match(/DATE\[?\n\s*\]?\s*(.+?202\d|.+?(?=LOCATION|\n\n))/i) || 
                    text.match(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[ a-z]*\s+\d{1,2}(?:\s*,\s*202\d)?/i) ||
                    text.match(/Forkable Pickup(?: Date)?\s+([A-Za-z]+ \d{1,2}, \d{4})/i) ||
                    text.match(/Forkable Pickup\s+(?:[A-Za-z]+,\s*)?([A-Za-z]+\s+\d{1,2})/i);
    
    let rawDateStr = dateMatch ? (dateMatch[1] || dateMatch[0]) : new Date().toDateString();
    let cleanDate = new Date(rawDateStr);
    
    // Fix year 2001 default
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

    let allItems = [];
    let pickupTimes = [];
    let earliestTimeFallback = "10:30AM";

    // SCENARIO 1: Process Excel
    let xlsxAttachments = attachments.filter(a => a.filename && a.filename.toLowerCase().endsWith('.xlsx'));
    for (const xlsxAttach of xlsxAttachments) {
        console.log(`- Processing Excel: ${xlsxAttach.filename}`);
        try {
            const workbook = XLSX.read(xlsxAttach.content, { type: 'buffer' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            data.forEach((row, idx) => {
                if (!row || idx < 1) return; 
                let mealRaw = String(row[1] || "").trim();
                let optionsRaw = String(row[2] || "").trim();
                let specialNotes = String(row[3] || "").trim();
                let pickupTime = String(row[6] || "").trim();

                if (!mealRaw || mealRaw.toLowerCase() === 'meal' || mealRaw.toLowerCase().includes('total') || mealRaw.toLowerCase().includes('holy shred')) return;
                if (pickupTime) pickupTimes.push(pickupTime);

                let matchedMeal = mealRaw;
                for (const m of menuItemsMap) {
                    if (mealRaw.toLowerCase().includes(m.title.toLowerCase()) || (m.platformOverrides?.Forkable?.alias && mealRaw.toLowerCase().includes(m.platformOverrides.Forkable.alias.toLowerCase()))) {
                        matchedMeal = m.title; break;
                    }
                }
                allItems.push({ name: matchedMeal, amount: 1, notes: specialNotes });

                // Process Sides
                if (optionsRaw.toLowerCase().includes("add side:")) {
                    let sideRaw = optionsRaw.replace(/add side[:\s]*/i, '').trim();
                    let matchedSide = sideRaw;
                    for (const m of menuItemsMap) {
                        if (sideRaw.toLowerCase().includes(m.title.toLowerCase()) || (m.platformOverrides?.Forkable?.alias && sideRaw.toLowerCase().includes(m.platformOverrides.Forkable.alias.toLowerCase()))) {
                            matchedSide = m.title; break;
                        }
                    }
                    allItems.push({ name: matchedSide, amount: 1, notes: "" });
                }
            });
        } catch (e) { console.error(`❌ Excel Error:`, e); }
    }

    // SCENARIO 2: HTML Fallback
    if (allItems.length === 0 && htmlStr) {
        console.log("- No Excel found. Parsing HTML table...");
        const $ = cheerio.load(htmlStr);
        $('table tr').each((i, row) => {
            const cells = $(row).children('td, th');
            if (cells.length >= 3) {
                let mealTxt = $(cells[1]).text().trim();
                if (mealTxt && mealTxt.toLowerCase() !== 'meal' && !mealTxt.toLowerCase().includes('total')) {
                    let notes = (cells.length >= 4) ? $(cells[3]).text().trim() : "";
                    let pickupTime = (cells.length >= 7) ? $(cells[6]).text().trim() : "";
                    if (pickupTime) pickupTimes.push(pickupTime);

                    let matchedMeal = mealTxt;
                    for (const m of menuItemsMap) {
                        if (mealTxt.toLowerCase().includes(m.title.toLowerCase()) || (m.platformOverrides?.Forkable?.alias && mealTxt.toLowerCase().includes(m.platformOverrides.Forkable.alias.toLowerCase()))) {
                            matchedMeal = m.title; break;
                        }
                    }
                    allItems.push({ name: matchedMeal, amount: 1, notes: notes });

                    let optionsTxt = $(cells[2]).text().trim();
                    if (optionsTxt.toLowerCase().includes("add side:")) {
                        let sideRaw = optionsTxt.replace(/add side[:\s]*/i, '').trim();
                        let matchedSide = sideRaw;
                        for (const m of menuItemsMap) {
                            if (sideRaw.toLowerCase().includes(m.title.toLowerCase()) || (m.platformOverrides?.Forkable?.alias && sideRaw.toLowerCase().includes(m.platformOverrides.Forkable.alias.toLowerCase()))) {
                                matchedSide = m.title; break;
                            }
                        }
                        allItems.push({ name: matchedSide, amount: 1, notes: "" });
                    }
                }
            }
        });
    }

    if (allItems.length === 0) return;

    // 3. Consolidate Items
    let consolidated = {};
    for (const fi of allItems) {
        let key = fi.name + "|||" + (fi.notes || "");
        if (!consolidated[key]) consolidated[key] = { ...fi };
        else consolidated[key].amount += fi.amount;
    }
    let finalItems = Object.values(consolidated);
    
    pickupTimes.sort();
    let deliveryTime = pickupTimes.length > 0 ? pickupTimes[0] : earliestTimeFallback;

    // 4. Create Single Daily Order
    let orderId = `FRK-DAILY-${formattedDate.replace(/-/g,'')}`;
    let newOrder = {
        id: orderId,
        platform: "Forkable",
        customerName: "Forkable Daily Order",
        typeOfOrder: "Meal Manager",
        deliveryDate: formattedDate,
        deliveryTime: deliveryTime,
        deliveryMethod: "Platform",
        pickUpTime: deliveryTime,
        subtotal: 0,
        total: 0,
        status: currentStatus,
        overallNotes: "Consolidated Daily Forkable Order.",
        items: finalItems,
        createdAt: new Date().toISOString(),
        isDeleted: false
    };

    const docRef = doc(db, 'orders', orderId);
    await setDoc(docRef, newOrder, { merge: true });
    console.log(`📠 Synced Consolidated Forkable order: ${orderId}`);
}

async function processDoordashEmail(text) {
    console.log("-> Parsing Doordash payload...");
    
    let subjectMatch = text.match(/New Catering Order for (.+) - ([a-zA-Z0-9]+)/i);
    let valueMatch = 
        text.match(/Order Value[\s\S]{0,50}?\$([0-9,.]+)/i) || 
        text.match(/Total Charged[\s\S]{0,100}?\$([0-9,.]+)/i) || 
        text.match(/Subtotal[\s\S]{0,100}?\$([0-9,.]+)/i);

    if (!subjectMatch && !valueMatch) {
        return;
    }

    let orderIdFromSub = subjectMatch ? subjectMatch[2] : Math.floor(Math.random() * 100000).toString();
    let fallbackDateMatch = text.match(/Drop Off Date[\s\S]{0,50}?([A-Za-z]{3},\s*[A-Za-z]{3}\s*\d{1,2},\s*\d{4})/i) || text.match(/Drop Off Date.*\n\s*(.*)/i); 
    let fallbackTimeMatch = text.match(/Drop Off Time[\s\S]{0,50}?([0-9:]+\s*[APM]+)/i) || text.match(/Drop Off Time.*\n\s*(.*)/i);
    let pickupDateMatch = text.match(/Estimated Pickup Time[\s\S]{1,150}?([A-Z][a-z]{2}\s+\d{1,2},\s+\d{4})(?:,\s+([0-9:]+\s+[APM]+))?/i);
    let locationMatch = text.match(/Location\s*(.*?)(?=\s*Preparation|$|View Order)/is);
    
    let customerRaw = subjectMatch ? subjectMatch[1].trim() : "Doordash Customer";
    let cleanDate = new Date();
    let pickupTime = "12:00 PM";

    if (pickupDateMatch) {
        cleanDate = new Date(pickupDateMatch[1].trim());
        if (pickupDateMatch[2]) pickupTime = pickupDateMatch[2].trim();
    } else if (fallbackDateMatch) {
        cleanDate = new Date(fallbackDateMatch[1].trim());
        if (fallbackTimeMatch) pickupTime = fallbackTimeMatch[1].trim();
    }

    if(isNaN(cleanDate.getTime())) cleanDate = new Date();

    let month = (cleanDate.getMonth() + 1).toString().padStart(2, '0');
    let day = cleanDate.getDate().toString().padStart(2, '0');
    let formattedDate = `${cleanDate.getFullYear()}-${month}-${day}`;

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
    } catch(e) {}

    for (const l of lines) {
        let m = l.match(/^\s*(\d+)[xX]\s+([^$]+)\s*\$([0-9.,]+)/) || l.match(/^\s*(\d+)[xX]\s+(.+)/);
        if (m) {
            let amount = parseInt(m[1]);
            let rawName = m[2].replace(/\s*\$[0-9.,]+/, '').trim();
            let cleanName = rawName.replace(/^\*+|\*+$/g, '').replace(/\s*\([^)]+\)$/, '').trim();

            let matchedName = cleanName;
            for (const mObj of menuItemsMap) {
                if (cleanName.toLowerCase().includes(mObj.title.toLowerCase())) {
                    matchedName = mObj.title; break;
                }
            }
            parsedItems.push({ name: matchedName, amount: amount, notes: rawName !== matchedName ? rawName : "" });
        }
    }

    if (parsedItems.length === 0) parsedItems = [{ name: "DoorDash Catering Bundle", amount: 1, notes: "" }];

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
        createdAt: new Date().toISOString(),
        isDeleted: false
    };
    
    const docRef = doc(db, 'orders', orderId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().manualOverride) return;
    await setDoc(docRef, newOrder, { merge: true });
    console.log(`📠 Synced Doordash Order ${orderId}`);
}

async function run() {
    console.log("🚀 Starting Native IMAP Email Listener...");

    if(!emailUser) return;

    imaps.connect(config).then(function (connection) {
        return connection.openBox('INBOX').then(async function () {
            const lookbackDate = new Date();
            lookbackDate.setDate(lookbackDate.getDate() - 14); 
            const searchCriteria = [['SINCE', lookbackDate]];
            const fetchOptions = { bodies: ['HEADER', 'TEXT', ''], markSeen: false };

            let messages = await connection.search(searchCriteria, fetchOptions);
            console.log(`✉️ Search returned ${messages.length} messages.`);

            for (let item of messages) {
                let all = item.parts.find(p => p.which === '');
                let subjectHeader = (item.parts.find(p => p.which === 'HEADER').body.subject || [''])[0] || '';
                let lowerSub = subjectHeader.toLowerCase();

                if (lowerSub.includes('forkable') || lowerSub.includes('confirm changes') || lowerSub.includes('action required') || lowerSub.includes('doordash') || lowerSub.includes('new catering order')) {
                    try {
                        let parsedMail = await simpleParser(all.body);
                        let combinedText = subjectHeader + "\n\n" + (parsedMail.text || "");
                        if (lowerSub.includes('forkable') || lowerSub.includes('confirm changes') || lowerSub.includes('action required')) {
                            await processForkableEmail(combinedText, parsedMail.html, parsedMail.attachments);
                        } else {
                            await processDoordashEmail(combinedText);
                        }
                    } catch(e) { console.error(`❌ Parse Error:`, e); }
                }
            }
            connection.end();
            process.exit(0);
        });
    }).catch(async err => {
        console.error("Auth Error: ", err);
        await setDoc(doc(db, 'system', 'crawlers'), { 'Email Source': { status: 'Expired', lastRun: new Date().toLocaleString() } }, { merge: true });
        process.exit(1);
    });
}

run().then(async () => {
    await setDoc(doc(db, 'system', 'crawlers'), { 'Email Source': { status: 'Active', lastRun: new Date().toLocaleString() } }, { merge: true });
});
