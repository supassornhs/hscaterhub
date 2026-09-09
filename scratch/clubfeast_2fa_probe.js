/**
 * clubfeast_2fa_probe.js — one-off diagnostic.
 * 1. Pulls "Email Source" IMAP creds from Firestore (same as email_scraper.js).
 * 2. Searches the inbox for recent ClubFeast emails (verification codes, etc).
 * 3. Prints mailbox address, senders, subjects, dates, and any code-like tokens.
 * No credentials or full bodies are printed.
 */
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import imaps from 'imap-simple';
import { simpleParser } from 'mailparser';

const app = initializeApp({
    apiKey: "AIzaSyCj__TCfYSF-1y4uR-UOId_aPWWwy4-W5A",
    authDomain: "hscaterhub.firebaseapp.com",
    projectId: "hscaterhub"
});
const db = getFirestore(app);

const crawlerDoc = await getDoc(doc(db, 'system', 'crawlers'));
const emailStr = crawlerDoc.exists() ? crawlerDoc.data()['Email Source']?.cookie : null;
if (!emailStr || !emailStr.includes(',')) {
    console.error('❌ No Email Source creds in Firestore');
    process.exit(1);
}
const [user, password] = emailStr.split(',').map(s => s.trim());
console.log('📬 Mailbox:', user);

const connection = await imaps.connect({
    imap: { user, password, host: 'imap.gmail.com', port: 993, tls: true, tlsOptions: { rejectUnauthorized: false }, authTimeout: 60000 }
});
await connection.openBox('INBOX');

const since = new Date();
since.setDate(since.getDate() - 60);

const messages = await connection.search(
    [['SINCE', since], ['OR', ['FROM', 'clubfeast'], ['SUBJECT', 'clubfeast']]],
    { bodies: ['HEADER', ''], markSeen: false }
);
console.log(`✉️  Found ${messages.length} ClubFeast-related emails in the last 60 days.\n`);

for (const item of messages.slice(-8)) {
    const header = item.parts.find(p => p.which === 'HEADER').body;
    const subject = (header.subject || [''])[0];
    const from = (header.from || [''])[0];
    const date = (header.date || [''])[0];
    console.log(`- ${date} | from: ${from} | subject: ${subject}`);

    const body = item.parts.find(p => p.which === '');
    if (body) {
        const parsed = await simpleParser(body.body);
        const text = (parsed.text || '').replace(/\s+/g, ' ');
        const code = text.match(/\b(\d{4,8})\b/);
        if (code) console.log(`    code-like token: ${code[1]}  (context: "...${text.slice(Math.max(0, code.index - 40), code.index + 45)}...")`);
    }
}
connection.end();
process.exit(0);
