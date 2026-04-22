import imaps from 'imap-simple';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCj__TCfYSF-1y4uR-UOId_aPWWwy4-W5A",
  authDomain: "hscaterhub.firebaseapp.com",
  projectId: "hscaterhub"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
    console.log("Fetching credentials from Firestore...");
    const crawlerDoc = await getDoc(doc(db, 'system', 'crawlers'));
    const emailStr = crawlerDoc.data()['Email Source']?.cookie;
    
    if (!emailStr || !emailStr.includes(',')) {
        console.error("No valid credentials found in Firestore.");
        process.exit(1);
    }
    
    const parts = emailStr.split(',');
    const user = parts[0].trim();
    const pass = parts[1].trim();
    
    const config = {
        imap: {
            user: user,
            password: pass,
            host: 'imap.gmail.com',
            port: 993,
            tls: true,
            tlsOptions: { rejectUnauthorized: false },
            authTimeout: 5000
        }
    };

    console.log(`Checking IMAP Inbox for ${user}...`);
    try {
        const connection = await imaps.connect(config);
        await connection.openBox('INBOX');
        const delay = 48 * 3600 * 1000; // 48 hours
        const sinceDate = new Date(Date.now() - delay);
        
        const searchCriteria = [
            ['SINCE', sinceDate],
            ['OR', ['SUBJECT', 'Forkable Pickup'], ['SUBJECT', 'Confirm Changes']]
        ];
        const fetchOptions = { bodies: ['HEADER'], markSeen: false };

        const messages = await connection.search(searchCriteria, fetchOptions);
        console.log(`Found ${messages.length} relevant Forkable emails in the last 48 hours.`);
        
        messages.forEach(item => {
            const subject = item.parts.find(p => p.which === 'HEADER').body.subject[0];
            const date = item.parts.find(p => p.which === 'HEADER').body.date[0];
            console.log(`- [${date}] SUBJECT: ${subject}`);
        });

        connection.end();
    } catch (e) {
        console.error("Error checking inbox:", e);
    }
}

run();
