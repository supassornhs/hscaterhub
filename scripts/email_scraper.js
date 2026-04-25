import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDocs, getDoc, addDoc } from "firebase/firestore";
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

async function logScraperAction(action, data) {
    try {
        await addDoc(collection(db, 'scraper_logs'), {
            action,
            data,
            timestamp: new Date().toISOString()
        });
    } catch(e) { console.error("Logging failed", e); }
}

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
        authTimeout: 15000
    }
};

// Polyfill for File/Blob in Node < 20
if (typeof global.File === 'undefined') {
    global.File = class File extends Blob {
        constructor(parts, filename, options = {}) {
            super(parts, options);
            this.name = filename;
            this.lastModified = options.lastModified || Date.now();
        }
    };
}

async function processForkableEmail(text, htmlStr = "", attachments = [], emailDate = null) {
    console.log("-> Parsing Forkable payload...");
    
    let cleanDate = emailDate ? new Date(emailDate) : new Date();
    if (isNaN(cleanDate.getTime())) cleanDate = new Date();
    
    const year = cleanDate.getFullYear();
    const month = (cleanDate.getMonth() + 1).toString().padStart(2, '0');
    const day = cleanDate.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    
    let sfDateStr = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles", year: 'numeric', month: 'numeric', day: 'numeric' });
    let sfTodayMidnight = new Date(sfDateStr);
    let currentStatus = cleanDate < sfTodayMidnight ? "Completed" : "New";

    let menuItemsMap = [];
    const menuDocs = await getDocs(collection(db, 'menus'));
    menuItemsMap = menuDocs.docs.map(d => d.data());
    menuItemsMap.sort((a,b) => b.title.length - a.title.length);

    let allItems = [];
    let pickupTimes = [];

    // 1. Excel Parsing
    let xlsxAttachments = attachments.filter(a => a.filename && a.filename.toLowerCase().endsWith('.xlsx'));
    for (const xlsxAttach of xlsxAttachments) {
        try {
            const workbook = XLSX.read(xlsxAttach.content, { type: 'buffer' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            let mainBlocks = [];
            let activeBlock = null;
            let summarySides = [];
            let inSidesSection = false;

            data.forEach((row, idx) => {
                if (!row || idx < 1) return;
                let colA = String(row[0] || "").trim();
                let colB = String(row[1] || "").trim();
                let colD = String(row[3] || "").trim();
                let colG = String(row[6] || "").trim();

                if (colA.toLowerCase().includes("(totals from above)")) {
                    inSidesSection = true; 
                    return;
                }

                if (!inSidesSection) {
                    // --- MEAL BLOCK LOGIC ---
                    let countMatch = colA.match(/(\d+)/);
                    if (countMatch) {
                        activeBlock = {
                            meal: colB,
                            groupTotal: parseInt(countMatch[1]),
                            rows: [],
                            pickupTime: colG
                        };
                        mainBlocks.push(activeBlock);
                    }
                    if (activeBlock) {
                        activeBlock.rows.push({ note: colD, time: colG });
                    }
                } else {
                    // --- SIDES SUMMARY LOGIC ---
                    let countMatch = colA.match(/(\d+)/);
                    if (countMatch && colB) {
                        summarySides.push({ name: colB, amount: parseInt(countMatch[1]) });
                    }
                }
            });

            mainBlocks.forEach(block => {
                if (block.pickupTime && block.pickupTime.toLowerCase() !== 'pickup') {
                    pickupTimes.push(block.pickupTime);
                }
                let noteGroups = {};
                let totalRowsWithNotes = 0;
                block.rows.forEach(r => {
                    if (r.note && r.note.length > 1) {
                        noteGroups[r.note] = (noteGroups[r.note] || 0) + 1;
                        totalRowsWithNotes++;
                    }
                });
                let baseCount = block.groupTotal - totalRowsWithNotes;
                let matchedMeal = block.meal;
                for (const m of menuItemsMap) {
                    if (block.meal.toLowerCase().includes(m.title.toLowerCase()) || (m.platformOverrides?.Forkable?.alias && block.meal.toLowerCase().includes(m.platformOverrides.Forkable.alias.toLowerCase()))) {
                        matchedMeal = m.title; break;
                    }
                }
                if (baseCount > 0) allItems.push({ name: matchedMeal, amount: baseCount, notes: "" });
                for (const noteText in noteGroups) {
                    allItems.push({ name: matchedMeal, amount: noteGroups[noteText], notes: noteText });
                }
            });

            summarySides.forEach(side => {
                let matchedSide = side.name;
                for (const m of menuItemsMap) {
                    if (side.name.toLowerCase().includes(m.title.toLowerCase()) || (m.platformOverrides?.Forkable?.alias && side.name.toLowerCase().includes(m.platformOverrides.Forkable.alias.toLowerCase()))) {
                        matchedSide = m.title; break;
                    }
                }
                allItems.push({ name: matchedSide, amount: side.amount, notes: "" });
            });
        } catch (e) {
            console.error(`❌ Excel Error:`, e);
        }
    }

    // 2. HTML Table Parsing (Only if Excel failed or wasn't there)
    if (allItems.length === 0 && htmlStr) {
        const $ = cheerio.load(htmlStr);
        $('table tr').each((i, row) => {
            const cells = $(row).children('td, th');
            if (cells.length >= 3) {
                let mealTxt = $(cells[1]).text().trim();
                let lowerTxt = mealTxt.toLowerCase();
                if (mealTxt && lowerTxt !== 'meal' && !lowerTxt.includes('total') && !lowerTxt.includes('sides')) {
                    let matchedMeal = mealTxt;
                    for (const m of menuItemsMap) {
                        if (lowerTxt.includes(m.title.toLowerCase()) || (m.platformOverrides?.Forkable?.alias && lowerTxt.includes(m.platformOverrides.Forkable.alias.toLowerCase()))) {
                            matchedMeal = m.title; break;
                        }
                    }
                    allItems.push({ name: matchedMeal, amount: 1, notes: $(cells[3]).text().trim() });

                    let optionsTxt = $(cells[2]).text().trim();
                    if (optionsTxt.toLowerCase().includes("add side:")) {
                        let sideRaw = optionsTxt.replace(/add side[:\s]*/i, '').trim();
                        let matchedSide = sideRaw;
                        for (const m of menuItemsMap) {
                            if (sideRaw.toLowerCase().includes(m.title.toLowerCase())) { matchedSide = m.title; break; }
                        }
                        allItems.push({ name: matchedSide, amount: 1, notes: "" });
                    }
                }
            }
        });
    }

    if (allItems.length === 0) {
        await logScraperAction("Forkable Skip", { reason: "No items parsed", formattedDate });
        return;
    }

    let consolidated = {};
    for (const fi of allItems) {
        let key = fi.name + "|||" + (fi.notes || "");
        if (!consolidated[key]) consolidated[key] = { ...fi };
        else consolidated[key].amount += fi.amount;
    }
    let finalItems = Object.values(consolidated);
    pickupTimes.sort();
    let deliveryTime = pickupTimes.length > 0 ? pickupTimes[0] : "10:30 AM";

    let orderId = `FRK-DAILY-${formattedDate.replace(/-/g,'')}`;
    let newOrder = {
        id: orderId, platform: "Forkable", customerName: "Forkable Daily Order",
        typeOfOrder: "Meal Manager", deliveryDate: formattedDate, deliveryTime: deliveryTime,
        deliveryMethod: "Platform", pickUpTime: deliveryTime, subtotal: 0, total: 0,
        status: currentStatus, overallNotes: "Consolidated Daily Forkable Order.",
        items: finalItems, createdAt: new Date().toISOString(), isDeleted: false
    };

    const docRef = doc(db, 'orders', orderId);
    await setDoc(docRef, newOrder, { merge: true });
    await logScraperAction("Forkable Sync", { orderId, date: formattedDate, itemCount: finalItems.length });
    console.log(`Synced Consolidated Forkable order: ${orderId}`);
}

async function processDoordashEmail(text) {
    let subjectMatch = text.match(/New Catering Order for (.+) - ([a-zA-Z0-9]+)/i);
    if (!subjectMatch) return;
    let orderIdFromSub = subjectMatch[2];
    let cleanDate = new Date();
    let month = (cleanDate.getMonth() + 1).toString().padStart(2, '0');
    let day = cleanDate.getDate().toString().padStart(2, '0');
    let orderId = `DD-${month}${day}-${orderIdFromSub}`;
    let newOrder = {
        id: orderId, platform: "DoorDash", customerName: subjectMatch[1].trim(),
        typeOfOrder: "Catering", deliveryDate: `${cleanDate.getFullYear()}-${month}-${day}`, 
        deliveryTime: "12:00 PM", deliveryMethod: "Platform", pickUpTime: "12:00 PM", 
        subtotal: 0, total: 0, status: "New", items: [{ name: "DoorDash Bundle", amount: 1, notes: "" }],
        createdAt: new Date().toISOString(), isDeleted: false
    };
    await setDoc(doc(db, 'orders', orderId), newOrder, { merge: true });
}

async function run() {
    console.log("🚀 Starting Scraper...");
    try {
        const connection = await imaps.connect(config);
        await connection.openBox('INBOX');
        const lookbackDate = new Date();
        lookbackDate.setDate(lookbackDate.getDate() - 14); 
        const searchCriteria = [['SINCE', lookbackDate]];
        const fetchOptions = { bodies: ['HEADER', 'TEXT', ''], markSeen: false };

        let messages = await connection.search(searchCriteria, fetchOptions);
        console.log(`✉️ Found ${messages.length} messages.`);
        await logScraperAction("Run Start", { messageCount: messages.length });

        for (let item of messages) {
            try {
                let all = item.parts.find(p => p.which === '');
                let headerPart = item.parts.find(p => p.which === 'HEADER').body;
                let subjectHeader = (headerPart.subject || [''])[0] || '';
                let emailReceivedDate = (headerPart.date || [null])[0] || null;
                let lowerSub = subjectHeader.toLowerCase();

                if (lowerSub.includes('forkable') || lowerSub.includes('confirm changes') || lowerSub.includes('action required') || lowerSub.includes('doordash')) {
                    let parsedMail = await simpleParser(all.body);
                    let combinedText = subjectHeader + "\n\n" + (parsedMail.text || "");
                    if (lowerSub.includes('forkable') || lowerSub.includes('confirm changes')) {
                        await processForkableEmail(combinedText, parsedMail.html, parsedMail.attachments, emailReceivedDate);
                    } else if (lowerSub.includes('doordash')) {
                        await processDoordashEmail(combinedText);
                    }
                }
            } catch (innerErr) { console.error("❌ Msg Error:", innerErr.message); }
        }
        connection.end();
    } catch (err) {
        console.error("❌ Fatal:", err.message);
        await logScraperAction("Fatal Error", { error: err.message });
        throw err;
    }
}

run().then(async () => {
    await setDoc(doc(db, 'system', 'crawlers'), { 'Email Source': { status: 'Active', lastRun: new Date().toLocaleString() } }, { merge: true });
    process.exit(0);
}).catch(err => { process.exit(1); });
