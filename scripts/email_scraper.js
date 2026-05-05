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

    // 2. Order ID Detection
    let orderIdFromSub = subjectMatch[2] || "";
    if (!orderIdFromSub) {
        // Look for "Order number 0a31f8e1" or "Order ID: 12345"
        const idMatch = text.match(/Order (?:number|id|num)\s*:?\s*([a-zA-Z0-9]+)/i) || 
                        text.match(/(?:ID|Number):\s*([a-zA-Z0-9]+)/i);
        if (idMatch) orderIdFromSub = idMatch[1];
        else orderIdFromSub = Math.random().toString(36).substring(2, 7).toUpperCase();
    }

    let cleanDate = new Date();
    let deliveryTime = "12:00 PM";
    let deliveryDateStr = `${cleanDate.getFullYear()}-${(cleanDate.getMonth() + 1).toString().padStart(2, '0')}-${cleanDate.getDate().toString().padStart(2, '0')}`;

    // 3. Time Detection (Pickup or Delivery)
    const timeMatch = text.match(/(?:Estimated pickup time|Arriving at|Delivery time)\s*:?\s*(\d+:\d+\s*(?:AM|PM))/i);
    if (timeMatch) deliveryTime = timeMatch[1].toUpperCase();

    // 4. Date Detection
    // Matches "Wed, May 6" or "Wednesday, May 6, 2026"
    const dateMatch = text.match(/(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?\s*([a-zA-Z]+\s+\d+)(?:,?\s*(\d{4}))?/i);
    if (dateMatch) {
        const monthDay = dateMatch[1];
        const year = dateMatch[2] || new Date().getFullYear();
        const parsedDate = new Date(`${monthDay}, ${year}`);
        if (!isNaN(parsedDate)) {
            deliveryDateStr = `${parsedDate.getFullYear()}-${(parsedDate.getMonth() + 1).toString().padStart(2, '0')}-${parsedDate.getDate().toString().padStart(2, '0')}`;
        }
    }

    // 5. Item Count & Subtotal
    const itemsMatch = text.match(/(\d+)\s*items/i);
    const itemCount = itemsMatch ? parseInt(itemsMatch[1]) : 1;
    
    const subtotalMatch = text.match(/Subtotal\s*\$?(\d+\.\d{2})/i);
    const subtotal = subtotalMatch ? parseFloat(subtotalMatch[1]) : 0;

    let orderId = `DD-${deliveryDateStr.replace(/-/g, '').substring(4)}-${orderIdFromSub}`;

    let newOrder = {
        id: orderId, 
        platform: "DoorDash", 
        customerName: customerName,
        typeOfOrder: "Catering", 
        deliveryDate: deliveryDateStr, 
        deliveryTime: deliveryTime, 
        deliveryMethod: "Platform", 
        pickUpTime: deliveryTime, 
        subtotal: subtotal, 
        total: subtotal, // Basic fallback
        status: "New", 
        items: [{ name: `DoorDash Order (${itemCount} items)`, amount: 1, notes: "Parsed from Email Summary" }],
        createdAt: new Date().toISOString(), 
        isDeleted: false
    };

    await setDoc(doc(db, 'orders', orderId), newOrder, { merge: true });
    console.log(`      ✅ Vaulted DoorDash Order: ${orderId} for ${customerName}`);
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
