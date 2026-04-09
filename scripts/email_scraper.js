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
    console.log("-> Parsing Forkable payload...");
    
    let dateMatch = text.match(/DATE\[?\n\s*\]?\s*(.+?202\d|.+?(?=LOCATION|\n\n))/i) || text.match(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[ a-z]*\s+\d{1,2}(?:\s*,\s*202\d)?/i);
    let locationMatch = text.match(/LOCATION\s*\n\s*(.+)/i) || text.match(/LOCATION:\s*(.+)/i) || ["", "Pickup Location"];
    let timeDriverMatch = text.match(/Pickup Time(?:\(s\))?:\s*(.+?)-(?:(?:\s*Driver\s*)(.+))?/i) || text.match(/Pickup Time(?:\(s\))?:\s*(.+)/i);
    let subtotalMatch = text.match(/Sub\s?Total\s*\$([0-9,.]+)/i);
    let titleDateMatch = text.match(/Forkable Pickup(?: Date)?(?:\s+(.*?))?(?:\s+at)?\s+([0-9:]+[APM]{2})/i);

    let rawDate = dateMatch ? (dateMatch[1] || dateMatch[0]) : (titleDateMatch && titleDateMatch[1] ? titleDateMatch[1] : new Date().toDateString());
    let cleanDate = new Date(rawDate);
    if((isNaN(cleanDate.getTime()) || cleanDate.getTime() === 0) && rawDate) {
        cleanDate = new Date(`${rawDate} ${new Date().getFullYear()}`);
    }

    let year = cleanDate.getFullYear().toString();
    let month = (cleanDate.getMonth() + 1).toString().padStart(2, '0');
    let day = cleanDate.getDate().toString().padStart(2, '0');
    let formattedDate = `${year}-${month}-${day}`;

    let pickupTime = timeDriverMatch ? timeDriverMatch[1].trim() : (titleDateMatch ? titleDateMatch[2] : "10:00AM");
    let subtotal = subtotalMatch ? parseFloat(subtotalMatch[1].replace(/,/g, '')) : 0;
    let location = locationMatch[1].trim();

    let parsedItems = [];
    if (htmlStr) {
        try {
            let itemRegex = /<td[^>]*class="[^"]*item-label[^"]*"[^>]*>([\s\S]*?)<\/td>/gi;
            let match;
            let countObj = {};
            while((match = itemRegex.exec(htmlStr)) !== null) {
                let name = match[1].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
                countObj[name] = (countObj[name] || 0) + 1;
            }
            for (const [key, val] of Object.entries(countObj)) {
                parsedItems.push({ Item_Name: key.replace(/&amp;/g, '&').replace(/&#39;/g, "'"), Item_Amount: val });
            }
        } catch(e) {}
    }
    
    if (parsedItems.length === 0) {
        try {
            let match = text.match(/LOCATION\s*[\r\n]+\s*[^\n]+\s*[\r\n]+([\s\S]*?)(?:Pickup Time|Order Summary)/i);
            if (!match) match = text.match(/LOCATION:\s*[^\n]+\s*[\r\n]+([\s\S]*?)(?:Pickup Time|Order Summary)/i);
            if (match && match[1]) {
                let itemsBlock = match[1].trim();
                let lines = itemsBlock.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
                for (let i = 0; i < lines.length; i += 2) {
                    let name = lines[i];
                    let qty = parseInt(lines[i + 1]);
                    if (!isNaN(qty) && name.toLowerCase() !== 'meals' && name.toLowerCase() !== 'utensils') {
                        parsedItems.push({ Item_Name: name, Item_Amount: qty });
                    }
                }
            }
        } catch(e) {}
    }

    if (parsedItems.length === 0) {
        parsedItems = [{ Item_Name: "Forkable Group Meals", Item_Amount: 1 }];
    }

    let orderId = `FRK-${month}${day}-${pickupTime.replace(':','')}`;
    
    let sfDateStr = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles", year: 'numeric', month: 'numeric', day: 'numeric' });
    let sfTodayMidnight = new Date(sfDateStr);
    let currentStatus = cleanDate < sfTodayMidnight ? "Completed" : "New";
    
    let finalItems = [];

    try {
        const menuDocs = await getDocs(collection(db, 'menus'));
        const menuItemsMap = menuDocs.docs.map(d => d.data());
        menuItemsMap.sort((a,b) => b.title.length - a.title.length);

        for (let item of parsedItems) {
            let rawName = item.Item_Name;
            let amount = item.Item_Amount;
            let splitIdx = rawName.indexOf('»');
            if (splitIdx === -1) splitIdx = rawName.indexOf('>>');

            let mainName = rawName;
            let modifierRaw = "";

            if (splitIdx !== -1) {
                mainName = rawName.substring(0, splitIdx).trim();
                modifierRaw = rawName.substring(splitIdx + 1).replace(/^>/, '').trim();
            }

            let cleanMainName = mainName;
            for (const m of menuItemsMap) {
                let match = mainName.toLowerCase().includes(m.title.toLowerCase());
                if (!match && m.platformOverrides && m.platformOverrides['Forkable'] && m.platformOverrides['Forkable'].alias) {
                    match = mainName.toLowerCase().includes(m.platformOverrides['Forkable'].alias.toLowerCase());
                }
                if (!match && m.aliases) {
                    match = m.aliases.some(a => mainName.toLowerCase().includes(a.toLowerCase()));
                }
                if (match) {
                    cleanMainName = m.title;
                    break;
                }
            }

            if (modifierRaw) {
                let sideMatch = null;
                let potentialSide = modifierRaw.toLowerCase().startsWith('add side:') ? modifierRaw.substring(9).trim() : modifierRaw;
                
                for (const m of menuItemsMap) {
                    let match = potentialSide.toLowerCase().includes(m.title.toLowerCase());
                    if (!match && m.platformOverrides && m.platformOverrides['Forkable'] && m.platformOverrides['Forkable'].alias) {
                        match = potentialSide.toLowerCase().includes(m.platformOverrides['Forkable'].alias.toLowerCase());
                    }
                    if (!match && m.aliases) {
                        match = m.aliases.some(a => potentialSide.toLowerCase().includes(a.toLowerCase()));
                    }
                    if (match) {
                        sideMatch = m.title;
                        break;
                    }
                }

                if (sideMatch) {
                    finalItems.push({ name: cleanMainName, amount: amount, notes: "" });
                    finalItems.push({ name: sideMatch, amount: amount, notes: "(Add-on from " + cleanMainName + ")" });
                } else {
                    finalItems.push({ name: cleanMainName, amount: amount, notes: modifierRaw });
                }
            } else {
                finalItems.push({ name: cleanMainName, amount: amount, notes: "" });
            }
        }

        let consolidated = {};
        for (const fi of finalItems) {
            let key = fi.name + "|||" + fi.notes;
            if (!consolidated[key]) consolidated[key] = { ...fi };
            else consolidated[key].amount += fi.amount;
        }
        finalItems = Object.values(consolidated);
    } catch(e) {
        console.log("Menu match fallback.", e);
        finalItems = parsedItems.map(item => ({ name: item.Item_Name, amount: item.Item_Amount, notes: "" }));
    }

    let newOrder = {
        id: orderId,
        platform: "Forkable",
        customerName: "Forkable User",
        typeOfOrder: "Meal Manager",
        deliveryDate: formattedDate,
        deliveryTime: pickupTime,
        deliveryMethod: "Platform",
        pickUpTime: pickupTime,
        subtotal: subtotal,
        total: subtotal,
        netPayout: subtotal,
        status: currentStatus,
        overallNotes: "Automatically imported via IMAP. Deliver Address: " + location,
        items: finalItems,
        createdAt: new Date().toISOString()
    };
    
    const docRef = doc(db, 'orders', newOrder.id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && (docSnap.data().manualOverride || docSnap.data().isDeleted)) {
        console.log(`[Forkable] Skipped (Manual Override): ${newOrder.id}`);
        return;
    }
    await setDoc(docRef, newOrder, { merge: true });
    console.log(`📠 Synced Forkable Order ${newOrder.id}`);
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
                ['OR', ['SUBJECT', 'Forkable Pickup'], ['OR', ['SUBJECT', 'Doordash'], ['SUBJECT', 'New Catering Order']]]
            ];
            // Also search for "Action Required" subjects which Forkable uses for add-ons
            const searchCriteriaAdhoc = [
                ['SINCE', lookbackDate],
                ['OR', ['SUBJECT', 'Action Required'], ['SUBJECT', 'Confirm Changes']]
            ];
            const fetchOptions = {
                bodies: ['HEADER', 'TEXT', ''],
                markSeen: false 
            };

            console.log("📡 Scanning Inbox for unread Delivery emails...");
            try {
                let msgs1 = await connection.search(searchCriteria, fetchOptions);
                let msgs2 = await connection.search(searchCriteriaAdhoc, fetchOptions);
                
                // Merge and deduplicate by uid
                let msgMap = new Map();
                msgs1.forEach(m => msgMap.set(m.attributes.uid, m));
                msgs2.forEach(m => msgMap.set(m.attributes.uid, m));
                let messages = Array.from(msgMap.values());

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

                        if (subjectHeader.toLowerCase().includes('forkable') || subjectHeader.toLowerCase().includes('action required')) {
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
