import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDocs, getDoc } from "firebase/firestore";
import imaps from 'imap-simple';
import { simpleParser } from 'mailparser';
import * as dotenv from 'dotenv';
import { sendAlertEmail } from './mailer.js';
import * as XLSX from 'xlsx';
import * as cheerio from 'cheerio';

dotenv.config();

// Fix for Node <20 environments where 'File' is not global
if (typeof global.File === 'undefined') {
    global.File = class File extends Blob {
        constructor(parts, filename, options = {}) {
            super(parts, options);
            this.name = filename;
            this.lastModified = options.lastModified || Date.now();
        }
    };
}

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
        authTimeout: 10000
    }
};

async function processForkableEmail(text, htmlStr = "", attachments = [], emailDate = null) {
    console.log("-> Parsing Forkable payload via Consolidated Parser...");
    
    let cleanDate = emailDate ? new Date(emailDate) : new Date();
    if (isNaN(cleanDate.getTime())) cleanDate = new Date();
    console.log(`   -> Using email date: ${cleanDate.toDateString()} as delivery date`);
    
    const year = cleanDate.getFullYear();
    const month = (cleanDate.getMonth() + 1).toString().padStart(2, '0');
    const day = cleanDate.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    
    let sfDateStr = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles", year: 'numeric', month: 'numeric', day: 'numeric' });
    let sfTodayMidnight = new Date(sfDateStr);
    let currentStatus = cleanDate < sfTodayMidnight ? "Completed" : "New";

    let menuItemsMap = [];
    try {
        const menuDocs = await getDocs(collection(db, 'menus'));
        menuItemsMap = menuDocs.docs.map(d => d.data());
        menuItemsMap.sort((a,b) => b.title.length - a.title.length);
    } catch(e) { console.log("Menu match fallback failed.", e); }

    let allItems = [];
    let pickupTimes = [];
    let earliestTimeFallback = "10:30AM";

    let xlsxAttachments = attachments.filter(a => a.filename && a.filename.toLowerCase().endsWith('.xlsx'));
    for (const xlsxAttach of xlsxAttachments) {
        console.log(`- Processing Excel: ${xlsxAttach.filename}`);
        try {
            const workbook = XLSX.read(xlsxAttach.content, { type: 'buffer' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            let isSummarySection = false;

            data.forEach((row, idx) => {
                if (!row || idx < 1 || isSummarySection) return;

                let countRaw = String(row[0] || "").trim();
                let mealRaw = String(row[1] || "").trim();
                let optionsRaw = String(row[2] || "").trim();
                let specialNotes = String(row[3] || "").trim();
                let pickupTime = String(row[6] || "").trim();

                let lowerMeal = mealRaw.toLowerCase();
                let lowerCount = countRaw.toLowerCase();

                if (lowerMeal === 'sides' || lowerCount.includes('totals from above')) {
                    isSummarySection = true; return;
                }

                if (!mealRaw || lowerMeal === 'meal' || lowerCount === 'count'
                    || lowerMeal.includes('total') || lowerMeal.includes('holy shred')) return;

                if (pickupTime && pickupTime.toLowerCase() !== 'pickup') pickupTimes.push(pickupTime);

                let countMatch = countRaw.match(/(\d+)/);
                if (countMatch) {
                    let mainCount = parseInt(countMatch[1]);
                    let matchedMeal = mealRaw;
                    for (const m of menuItemsMap) {
                        if (lowerMeal.includes(m.title.toLowerCase()) || (m.platformOverrides?.Forkable?.alias && lowerMeal.includes(m.platformOverrides.Forkable.alias.toLowerCase()))) {
                            matchedMeal = m.title; break;
                        }
                    }
                    allItems.push({ name: matchedMeal, amount: mainCount, notes: specialNotes });
                }

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

    let consolidated = {};
    for (const fi of allItems) {
        let key = fi.name + "|||" + (fi.notes || "");
        if (!consolidated[key]) consolidated[key] = { ...fi };
        else consolidated[key].amount += fi.amount;
    }
    let finalItems = Object.values(consolidated);
    
    pickupTimes.sort();
    let deliveryTime = pickupTimes.length > 0 ? pickupTimes[0] : earliestTimeFallback;

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
        subtotal: 0, total: 0,
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
    let valueMatch = text.match(/Order Value[\s\S]{0,50}?\$([0-9,.]+)/i) || text.match(/Total Charged[\s\S]{0,100}?\$([0-9,.]+)/i) || text.match(/Subtotal[\s\S]{0,100}?\$([0-9,.]+)/i);

    if (!subjectMatch && !valueMatch) return;

    let orderIdFromSub = subjectMatch ? subjectMatch[2] : Math.floor(Math.random() * 100000).toString();
    let cleanDate = new Date();
    let pickupTime = "12:00 PM";

    let month = (cleanDate.getMonth() + 1).toString().padStart(2, '0');
    let day = cleanDate.getDate().toString().padStart(2, '0');
    let formattedDate = `${cleanDate.getFullYear()}-${month}-${day}`;
    let subtotal = valueMatch ? parseFloat(valueMatch[1].replace(/,/g, '')) : 0;
    let orderId = `DD-${month}${day}-${orderIdFromSub}`;
    
    let sfDateStr = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles", year: 'numeric', month: 'numeric', day: 'numeric' });
    let sfTodayMidnight = new Date(sfDateStr);
    let currentStatus = cleanDate < sfTodayMidnight ? "Completed" : "New";
    
    let parsedItems = [{ name: "DoorDash Catering Bundle", amount: 1, notes: "" }];

    let newOrder = {
        id: orderId, platform: "DoorDash", customerName: subjectMatch ? subjectMatch[1].trim() : "Doordash",
        typeOfOrder: "Catering", deliveryDate: formattedDate, deliveryTime: pickupTime,
        deliveryMethod: "Platform", pickUpTime: pickupTime, subtotal: subtotal, total: subtotal,
        netPayout: subtotal, status: currentStatus, overallNotes: "Doordash catering order via email.",
        items: parsedItems, createdAt: new Date().toISOString(), isDeleted: false
    };
    
    await setDoc(doc(db, 'orders', orderId), newOrder, { merge: true });
    console.log(`📠 Synced Doordash Order ${orderId}`);
}

async function run() {
    console.log("🚀 Starting Native IMAP Email Listener...");
    if (!emailUser) { console.error("No email user found."); return; }

    try {
        const connection = await imaps.connect(config);
        await connection.openBox('INBOX');

        const lookbackDate = new Date();
        lookbackDate.setDate(lookbackDate.getDate() - 14); 
        const searchCriteria = [['SINCE', lookbackDate]];
        const fetchOptions = { bodies: ['HEADER', 'TEXT', ''], markSeen: false };

        let messages = await connection.search(searchCriteria, fetchOptions);
        console.log(`✉️ Search returned ${messages.length} messages.`);

        for (let item of messages) {
            try {
                let all = item.parts.find(p => p.which === '');
                let headerPart = item.parts.find(p => p.which === 'HEADER').body;
                let subjectHeader = (headerPart.subject || [''])[0] || '';
                let emailReceivedDate = (headerPart.date || [null])[0] || null;
                let lowerSub = subjectHeader.toLowerCase();

                console.log(`[Scraper] Subject: "${subjectHeader}" | Date: ${emailReceivedDate}`);

                if (lowerSub.includes('forkable') || lowerSub.includes('confirm changes') || lowerSub.includes('action required') || lowerSub.includes('doordash') || lowerSub.includes('new catering order')) {
                    let parsedMail = await simpleParser(all.body);
                    let combinedText = subjectHeader + "\n\n" + (parsedMail.text || "");
                    if (lowerSub.includes('forkable') || lowerSub.includes('confirm changes') || lowerSub.includes('action required')) {
                        await processForkableEmail(combinedText, parsedMail.html, parsedMail.attachments, emailReceivedDate);
                    } else {
                        await processDoordashEmail(combinedText);
                    }
                }
            } catch (innerErr) { console.error("❌ Message processing error:", innerErr.message); }
        }

        console.log("✅ All messages processed.");
        connection.end();

    } catch (err) {
        console.error("❌ Fatal IMAP/Auth Error:", err.message);
        await setDoc(doc(db, 'system', 'crawlers'), { 'Email Source': { status: 'Expired', lastRun: new Date().toLocaleString() } }, { merge: true });
        throw err;
    }
}

run().then(async () => {
    await setDoc(doc(db, 'system', 'crawlers'), { 'Email Source': { status: 'Active', lastRun: new Date().toLocaleString() } }, { merge: true });
    process.exit(0);
}).catch(err => {
    console.error("Final Process Failure:", err);
    process.exit(1);
});
