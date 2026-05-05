import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDocs, getDoc, addDoc } from "firebase/firestore";
import imaps from 'imap-simple';
import { simpleParser } from 'mailparser';
import * as dotenv from 'dotenv';
import { sendAlertEmail } from './mailer.js';
import * as XLSX from 'xlsx';

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

async function processDoordashEmail(text) {
    // 1. Support both "New Catering Order for..." and "Accept your catering order for..."
    let subjectMatch = text.match(/New Catering Order for (.+) - ([a-zA-Z0-9]+)/i) || 
                       text.match(/Accept your catering order for (.+)/i);
    
    if (!subjectMatch) return;

    let customerName = subjectMatch[1].trim();
    let orderIdFromSub = subjectMatch[2] || "";
    
    // 2. Fallback: If no Order ID in subject, try to find it in the body (e.g. "Order ID: 123456789")
    if (!orderIdFromSub) {
        const idMatch = text.match(/Order (?:ID|Number):\s*([a-zA-Z0-9]+)/i) || text.match(/ID:\s*([a-zA-Z0-9]{5,})/i);
        if (idMatch) orderIdFromSub = idMatch[1];
        else orderIdFromSub = Math.random().toString(36).substring(2, 7).toUpperCase(); // Last resort random ID
    }

    let cleanDate = new Date();
    let month = (cleanDate.getMonth() + 1).toString().padStart(2, '0');
    let day = cleanDate.getDate().toString().padStart(2, '0');
    let orderId = `DD-${month}${day}-${orderIdFromSub}`;

    let newOrder = {
        id: orderId, 
        platform: "DoorDash", 
        customerName: customerName,
        typeOfOrder: "Catering", 
        deliveryDate: `${cleanDate.getFullYear()}-${month}-${day}`, 
        deliveryTime: "12:00 PM", 
        deliveryMethod: "Platform", 
        pickUpTime: "12:00 PM", 
        subtotal: 0, 
        total: 0, 
        status: "New", 
        items: [{ name: "DoorDash Bundle", amount: 1, notes: "Parsed from 'Accept Order' Email" }],
        createdAt: new Date().toISOString(), 
        isDeleted: false
    };

    await setDoc(doc(db, 'orders', orderId), newOrder, { merge: true });
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
                let combinedText = subjectHeader + "\n\n" + (parsedMail.text || "");
                await processDoordashEmail(combinedText);
                
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
