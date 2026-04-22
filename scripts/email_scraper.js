import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDocs, getDoc } from "firebase/firestore";
import imaps from 'imap-simple';
import { simpleParser } from 'mailparser';
import * as dotenv from 'dotenv';
import { sendAlertEmail } from './mailer.js';
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

async function processForkableEmail(text, htmlStr = "") {
    console.log("-> Parsing Forkable payload with multi-group support...");
    
    // 1. Get the general date (applies to all groups in this email)
    let dateMatch = text.match(/DATE\[?\n\s*\]?\s*(.+?202\d|.+?(?=LOCATION|\n\n))/i) || 
                    text.match(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[ a-z]*\s+\d{1,2}(?:\s*,\s*202\d)?/i) ||
                    text.match(/Forkable Pickup(?: Date)?\s+([A-Za-z]+ \d{1,2}, \d{4})/i);
    
    let rawDateStr = dateMatch ? (dateMatch[1] || dateMatch[0]) : new Date().toDateString();
    let cleanDate = new Date(rawDateStr);
    if((isNaN(cleanDate.getTime()) || cleanDate.getTime() === 0) && rawDateStr) {
        cleanDate = new Date(`${rawDateStr} ${new Date().getFullYear()}`);
    }
    
    const year = cleanDate.getFullYear();
    const month = (cleanDate.getMonth() + 1).toString().padStart(2, '0');
    const day = cleanDate.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    
    let sfDateStr = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles", year: 'numeric', month: 'numeric', day: 'numeric' });
    let sfTodayMidnight = new Date(sfDateStr);
    let currentStatus = cleanDate < sfTodayMidnight ? "Completed" : "New";

    // 2. Fetch menu items once for matching
    let menuItemsMap = [];
    try {
        const menuDocs = await getDocs(collection(db, 'menus'));
        menuItemsMap = menuDocs.docs.map(d => d.data());
        menuItemsMap.sort((a,b) => b.title.length - a.title.length);
    } catch(e) { console.log("Menu match fallback failed.", e); }

    // 3. Line-by-line parsing for headers and groups
    let lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    let currentHeader = { time: "10:00AM", driver: "TBD" };
    let groups = [];
    let currentGroup = null;
    let buffer = "";
    
    const processBuffer = (itemText) => {
        if (!itemText || !currentGroup) return;
        
        let priceMatch = itemText.match(/\$([0-9,.]+)/);
        if (!priceMatch && !itemText.includes('>>') && !itemText.includes('»')) return; // Ignore blocks with no price or modifier symbols
        
        let price = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : 0;
        currentGroup.subtotal += price;
        
        let content = itemText.trim();
        // Remove ALL price strings globally to ensure they don't leak into notes
        content = content.replace(/\$[0-9,.]+/g, '').trim();
        
        // Final aggressive cleanup of structural noise
        content = content.replace(/\d{1,2}:\d{2}\s*[APM]{2}.*$/gi, '').trim();
        content = content.replace(/DRIVER:.*$/gi, '').trim();
        content = content.replace(/[-]{3,}/g, '').trim();
        content = content.replace(/[\n\t]/g, ' ').trim();
        content = content.replace(/Any hot sauce.*$/gi, '').trim(); // Remove specific junk request observed
        
        // Remove person name
        content = content.replace(/^[A-Z][a-z0-9\s]* [A-Z]\.\s+/, '').trim();
        
        // Skip structural headers, footers, or totals
        const lowercaseContent = content.toLowerCase();
        if (!content || 
            lowercaseContent.includes('items') || 
            lowercaseContent.includes('group') || 
            lowercaseContent.includes('for your records') || 
            lowercaseContent.includes('projected sub total') ||
            lowercaseContent.includes('balance due') ||
            lowercaseContent.includes('statement') ||
            lowercaseContent.includes('driver:') ||
            content.length < 3) return;

        let chunks = content.split(/[┬╗»>>]/).map(c => c.trim()).filter(c => c);
        if (chunks.length === 0) return;

        let mainRaw = chunks[0];
        let mods = chunks.slice(1);

        // Resolve Main Dish - Strict Matching
        let mainDish = mainRaw;
        let matched = false;
        for (const m of menuItemsMap) {
            let title = m.title.toLowerCase();
            let alias = m.platformOverrides?.Forkable?.alias?.toLowerCase();
            
            const isMatch = (text, pattern) => {
                if (!pattern) return false;
                // Strict check: the dish title must be present as a distinct entity
                return text.toLowerCase().includes(pattern);
            };

            if (isMatch(mainRaw, title) || isMatch(mainRaw, alias)) {
                mainDish = m.title;
                matched = true;
                break;
            }
        }
        
        // If not matched to a menu item, and we suspect it's a driver/person name, skip
        if (!matched && (mainRaw.split(' ').length <= 2 || mainRaw.includes('---'))) {
            console.log(`  - Skipping suspected noise: ${mainRaw}`);
            return;
        }

        console.log(`  - Adding: ${mainDish} (${matched ? 'Matched' : 'RAW'}) with ${mods.length} mods`);

        // Add parent dish with mods in note
        let parentNote = mods.join(", ").replace(/^(Add Side|Add|Side)[:\s]*/gi, '').trim();
        currentGroup.rawItems.push({ name: mainDish, amount: 1, notes: parentNote ? "Add Side: " + parentNote : "" });

        // Add each mod as its own item for global summation IF it is a recognized menu item
        for (let mod of mods) {
            let cleanMod = mod.replace(/^(Add Side|Add|Side)[:\s]*/gi, '').trim();
            let resolvedMod = null;
            for (const m of menuItemsMap) {
                let match = cleanMod.toLowerCase().includes(m.title.toLowerCase());
                if (!match && m.platformOverrides?.Forkable?.alias) {
                    match = cleanMod.toLowerCase().includes(m.platformOverrides.Forkable.alias.toLowerCase());
                }
                if (match) {
                    resolvedMod = m.title;
                    break;
                }
            }
            if (resolvedMod) {
                currentGroup.rawItems.push({ name: resolvedMod, amount: 1, notes: "" });
            }
        }
    };

    for (let line of lines) {
        // Trigger 1: Structural markers (Header or Time)
        let hMatch = line.match(/\d{1,2}:\d{2}\s*[APM]{2}/i) || line.match(/DRIVER:/i) || line.match(/---/);
        let gMatch = line.match(/Group\s+([A-Z]{1,3})/i);
        
        // Trigger 3: New Person - support "Alek Q.", "Roberta Woo W.", "J. P." etc.
        let pMatch = line.match(/^\s*[A-Z][a-z0-9]*\s+[A-Z][a-z]*(\s+[A-Z][a-z]*)*\s+[A-Z]\./) || 
                     line.match(/^\s*[A-Z][a-z]+\s+[A-Z]\./);

        if (hMatch || gMatch || pMatch) {
            // Flush current buffer before structural switch
            processBuffer(buffer);
            buffer = "";

            if (hMatch) {
                let tMatch = line.match(/(\d{1,2}:\d{2}\s*[APM]{2})/i);
                if (tMatch) currentHeader.time = tMatch[1];
                let dMatch = line.match(/DRIVER:\s*(.*)/i);
                if (dMatch) currentHeader.driver = dMatch[1].trim();
                continue;
            }
            if (gMatch) {
                let gm = line.match(/Group\s+([A-Z]{1,3})/i);
                if (currentGroup) groups.push(currentGroup);
                currentGroup = {
                    code: gm[1],
                    time: currentHeader.time,
                    driver: currentHeader.driver,
                    rawItems: [],
                    subtotal: 0
                };
                continue;
            }
            if (pMatch) {
                buffer = line;
                continue;
            }
        }
        buffer += (buffer ? " " : "") + line;
    }
    processBuffer(buffer);
    if (currentGroup) groups.push(currentGroup);

    console.log(`- Identified ${groups.length} groups.`);
    for (let groupInfo of groups) {
        console.log(`- Processing group ${groupInfo.code} (${groupInfo.rawItems.length} items)...`);
        if (groupInfo.rawItems.length === 0) continue;

        // Consolidate final items
        let consolidated = {};
        for (const fi of groupInfo.rawItems) {
            let key = fi.name + "|||" + fi.notes;
            if (!consolidated[key]) consolidated[key] = { ...fi };
            else consolidated[key].amount += fi.amount;
        }
        let finalItems = Object.values(consolidated);

        let orderId = `FRK-${groupInfo.code}-${formattedDate.replace(/-/g,'')}-${groupInfo.time.replace(/[:\s]/g,'')}`;
        let newOrder = {
            id: orderId.toUpperCase(),
            platform: "Forkable",
            customerName: `Forkable ${groupInfo.code}`,
            typeOfOrder: "Meal Manager",
            deliveryDate: formattedDate,
            deliveryTime: groupInfo.time,
            deliveryMethod: "Platform",
            pickUpTime: groupInfo.time,
            subtotal: groupInfo.subtotal,
            total: groupInfo.subtotal,
            netPayout: groupInfo.subtotal,
            status: currentStatus,
            overallNotes: `Group: ${groupInfo.code}. Driver: ${groupInfo.driver}.`,
            items: finalItems,
            createdAt: new Date().toISOString()
        };

        const docRef = doc(db, 'orders', newOrder.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && (docSnap.data().manualOverride || docSnap.data().isDeleted)) continue;
        
        await setDoc(docRef, newOrder, { merge: true });
        console.log(`📠 Synced Forkable Group ${groupInfo.code} (ID: ${newOrder.id})`);
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
        return connection.openBox('INBOX').then(async function () {
            // Dynamically look strictly at emails received only within the last 48 hours to minimize log spam
            const lookbackDate = new Date();
            lookbackDate.setDate(lookbackDate.getDate() - 2);
            const searchCriteria = [
                ['SINCE', lookbackDate],
                ['OR', ['SUBJECT', 'Forkable Pickup'], ['OR', ['SUBJECT', 'Confirm Changes'], ['OR', ['SUBJECT', 'Doordash'], ['SUBJECT', 'New Catering Order']]]]
            ];
            const fetchOptions = {
                bodies: ['HEADER', 'TEXT', ''],
                markSeen: false 
            };

            console.log("📡 Scanning Inbox for unread Delivery emails...");
            try {
                let messages = await connection.search(searchCriteria, fetchOptions);

                if (messages.length === 0) {
                    console.log("✉️ Zero new unread delivery orders found in inbox.");
                } else {
                    console.log(`✉️ Found ${messages.length} new incoming unread order(s)! Processing...`);
                }

                for (let item of messages) {
                    let all = item.parts.find(p => p.which === '');
                    let subjectHeader = item.parts.find(p => p.which === 'HEADER').body.subject[0] || '';
                    
                    try {
                        let parsedMail = await simpleParser(all.body);
                        let bodyText = parsedMail.text || "";
                        let combinedText = subjectHeader + "\n\n" + bodyText;

                        console.log(`Processing email: ${subjectHeader}`);
                        if (subjectHeader.toLowerCase().includes('forkable') || subjectHeader.toLowerCase().includes('confirm changes')) {
                            await processForkableEmail(combinedText, parsedMail.html);
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
