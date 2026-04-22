import imaps from 'imap-simple';
import * as dotenv from 'dotenv';
dotenv.config();

const config = {
    imap: {
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_APP_PASSWORD,
        host: 'imap.gmail.com',
        port: 993,
        tls: true,
        tlsOptions: { rejectUnauthorized: false },
        authTimeout: 3000
    }
};

async function run() {
    console.log("Checking IMAP Inbox for recent Forkable emails...");
    try {
        const connection = await imaps.connect(config);
        await connection.openBox('INBOX');
        const delay = 24 * 3600 * 1000; // 24 hours
        const lastDay = new Date(Date.now() - delay);
        const searchCriteria = [['SINCE', lastDay]];
        const fetchOptions = { bodies: ['HEADER'], markSeen: false };

        const messages = await connection.search(searchCriteria, fetchOptions);
        console.log(`Found ${messages.length} emails in the last 24 hours.`);
        
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
