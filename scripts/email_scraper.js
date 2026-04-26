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
        lookbackDate.setDate(lookbackDate.getDate() - 30); 
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
