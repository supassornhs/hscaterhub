const Imap = require('imap');
const { simpleParser } = require('mailparser');
require('dotenv').config();

const imap = new Imap({
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_APP_PASSWORD,
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false }
});

function openInbox(cb) { imap.openBox('INBOX', false, cb); }

imap.once('ready', function() {
    openInbox(function(err, box) {
        if (err) throw err;
        imap.search(['ALL', ['FROM', 'doordash']], function(err, results) {
            if (err) throw err;
            if (!results || results.length === 0) { console.log('No doordash emails found'); imap.end(); return; }
            
            // Get the last 2 emails
            let f = imap.fetch(results.slice(-2), { bodies: '' });
            f.on('message', function(msg, seqno) {
                msg.on('body', function(stream, info) {
                    simpleParser(stream, async (err, parsed) => {
                        console.log(`\n\n--- DOORDASH EMAIL ---`);
                        console.log(`SUBJECT: ${parsed.subject}`);
                        console.log(`TEXT:\n${parsed.text}`);
                    });
                });
            });
            f.once('error', function(err) { console.log('Fetch error: ' + err); });
            f.once('end', function() { console.log('Done fetching all messages!'); imap.end(); });
        });
    });
});

imap.once('error', function(err) { console.log(err); });
imap.once('end', function() { console.log('Connection ended'); });

imap.connect();
