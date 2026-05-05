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
        authTimeout: 60000
    }
};

async function processDoordashEmail(subject, text, html) {
    try {
        console.log(`      DEBUG: Processing email. Subject: "${subject}", Text length: ${text?.length || 0}`);
        
        // 1. Support both "New Catering Order for..." and "Accept your catering order for..."
        let subjectMatch = subject.match(/New Catering Order for (.+) - ([a-zA-Z0-9]+)/i) || 
                           subject.match(/Accept your catering order for (.+)/i);
        
        if (!subjectMatch) {
            console.log("      DEBUG: Subject format not recognized in subject line.");
            return;
        }

        let customerName = subjectMatch[1].trim();

    // 2. Order ID Detection
    let orderIdFromSub = subjectMatch[2] || "";
    if (!orderIdFromSub) {
        const idMatch = text.match(/Order (?:number|id|num)\s*:?\s*([a-zA-Z0-9]+)/i) || 
                        text.match(/(?:ID|Number):\s*([a-zA-Z0-9]+)/i);
        if (idMatch) orderIdFromSub = idMatch[1];
        else orderIdFromSub = Math.random().toString(36).substring(2, 7).toUpperCase();
    }

    let cleanDate = new Date();
    let deliveryTime = "12:00 PM";
    let deliveryDateStr = `${cleanDate.getFullYear()}-${(cleanDate.getMonth() + 1).toString().padStart(2, '0')}-${cleanDate.getDate().toString().padStart(2, '0')}`;

    // 3. Time & Date Detection
    const timeMatch = text.match(/(?:Estimated pickup time|Arriving at|Delivery time)\s*:?\s*(\d+:\d+\s*(?:AM|PM))/i);
    if (timeMatch) deliveryTime = timeMatch[1].toUpperCase();

    const dateMatch = text.match(/(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?\s*([a-zA-Z]+\s+\d+)(?:,?\s*(\d{4}))?/i);
    if (dateMatch) {
        const monthDay = dateMatch[1];
        const year = dateMatch[2] || new Date().getFullYear();
        const parsedDate = new Date(`${monthDay}, ${year}`);
        if (!isNaN(parsedDate)) {
            deliveryDateStr = `${parsedDate.getFullYear()}-${(parsedDate.getMonth() + 1).toString().padStart(2, '0')}-${parsedDate.getDate().toString().padStart(2, '0')}`;
        }
    }

    // 4. Item Parsing (HTML first, then Text)
    let finalItems = [];

    if (html) {
        const $ = cheerio.load(html);
        console.log("      DEBUG: Parsing HTML with Cheerio...");
        const processedRows = new Set();
        
        $('tr').each((i, el) => {
            let rowText = $(el).text().trim().replace(/\s+/g, ' ');
            if (!rowText || processedRows.has(rowText)) return;
            
            // Match pattern: "1x Charcoal-Grilled BBQ Chicken Rice (Meal) $72.25"
            // We require the line to START with a quantity and contain a price
            const match = rowText.match(/^(\d+)\s*[xX]\s+([\s\S]+?)\s*\$?(\d+\.\d{2})$/);
            if (match) {
                processedRows.add(rowText);
                const qty = parseInt(match[1]);
                let fullText = match[2].trim();
                
                const noteMatch = fullText.match(/^(.+?)\s*\((.+)\)$/);
                const name = noteMatch ? noteMatch[1].trim() : fullText;
                const notes = noteMatch ? noteMatch[2].trim() : "";

                finalItems.push({ name, amount: qty, notes });
            }
        });
    }

    // Text Fallback (Improved for multi-line)
    if (finalItems.length === 0) {
        console.log("      DEBUG: HTML failed, using Text Fallback...");
        const detailsBlock = text.match(/(?:Order details|Order summary)([\s\S]+?)Subtotal/i);
        if (detailsBlock) {
            const lines = detailsBlock[1].split(/\r?\n/).map(l => l.trim()).filter(l => l);
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                // Check if current line is name and next is price
                const priceMatch = lines[i+1]?.match(/^\$?(\d+\.\d{2})$/);
                if (priceMatch) {
                    const nameFull = line;
                    const noteMatch = nameFull.match(/^(.+?)\s*\((.+)\)$/);
                    finalItems.push({
                        name: noteMatch ? noteMatch[1].trim() : nameFull,
                        amount: 1, // Default to 1 if we can't find quantity in text
                        notes: noteMatch ? noteMatch[2].trim() : ""
                    });
                    i++; // Skip the price line
                }
            }
        }
    }

    if (finalItems.length === 0) {
        const itemsMatch = text.match(/(\d+)\s*items/i);
        finalItems.push({ name: `DoorDash Order (${itemsMatch ? itemsMatch[1] : '??'} items)`, amount: 1, notes: "Details in Email" });
    }
    
    const subtotalMatch = text.match(/Subtotal\s*\$?(\d+\.\d{2})/i);
    const subtotal = subtotalMatch ? parseFloat(subtotalMatch[1]) : 0;
    const orderId = `DD-${deliveryDateStr.replace(/-/g, '').substring(4)}-${orderIdFromSub}`;

    let newOrder = {
        id: orderId, platform: "DoorDash", customerName,
        typeOfOrder: "Catering", deliveryDate: deliveryDateStr, deliveryTime,
        deliveryMethod: "Platform", pickUpTime: deliveryTime,
        subtotal, total: subtotal, status: "New", items: finalItems,
        createdAt: new Date().toISOString(), isDeleted: false
    };

    await setDoc(doc(db, 'orders', orderId), newOrder, { merge: true });
    console.log(`      ✅ Vaulted DoorDash Order: ${orderId} for ${customerName} (${finalItems.length} items)`);
    } catch (e) {
        console.error("      ❌ Error in processDoordashEmail:", e.message);
    }
}

async function run() {
    console.log("🚀 Starting Optimized Email Scraper...");
    try {
        const connection = await imaps.connect(config);
        await connection.openBox('INBOX');

        // Optimization 1: Reduce lookback to 7 days
        const lookbackDate = new Date();
        lookbackDate.setDate(lookbackDate.getDate() - 7); 
        
        const searchCriteria = [
            ['SINCE', lookbackDate],
            ['HEADER', 'SUBJECT', 'catering']
        ];
        
        const fetchOptions = { bodies: ['HEADER', 'TEXT', ''], markSeen: false };

        let messages = await connection.search(searchCriteria, fetchOptions);
        console.log(`✉️ Found ${messages.length} relevant DoorDash messages.`);
        await logScraperAction("Run Start", { messageCount: messages.length });

        for (let item of messages) {
            try {
                let all = item.parts.find(p => p.which === '');
                let headerPart = item.parts.find(p => p.which === 'HEADER').body;
                let subjectHeader = (headerPart.subject || [''])[0] || '';
                
                let parsedMail = await simpleParser(all.body);
                await processDoordashEmail(subjectHeader, parsedMail.text || "", parsedMail.html || "");
                
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
