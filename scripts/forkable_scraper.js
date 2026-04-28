import puppeteer from 'puppeteer';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, getDocs, collection, addDoc } from "firebase/firestore";
import * as dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
    apiKey: "AIzaSyCj__TCfYSF-1y4uR-UOId_aPWWwy4-W5A",
    authDomain: "hscaterhub.firebaseapp.com",
    projectId: "hscaterhub"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const FORKABLE_EMAIL = "supassorn@holyshred.co";
const FORKABLE_PASS = "Supassorn_2493";

(async () => {
    console.log("🚀 Launching Forkable Final Sync (Keyboard Flow)...");
    const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 1200 });

    try {
        await page.goto("https://forkable.com/fpp/login", { waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 2000));

        console.log("📧 Entering email...");
        await page.type('input[type="email"]', FORKABLE_EMAIL, { delay: 100 });
        await page.keyboard.press('Enter');
        
        await new Promise(r => setTimeout(r, 4000));

        console.log("🔑 Entering password...");
        await page.type('input[type="password"]', FORKABLE_PASS, { delay: 100 });
        await page.keyboard.press('Enter');
        
        await new Promise(r => setTimeout(r, 8000));
        console.log(`📍 URL: ${page.url()}`);

        const today = new Date().toISOString().split('T')[0];
        const targetUrl = `https://forkable.com/fpp/2297/${today}/17201`;
        await page.goto(targetUrl, { waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 6000));

        const bodyTxt = await page.evaluate(() => document.body.innerText);
        if (bodyTxt.includes('Restaurant Login')) {
            console.error("❌ Login failed.");
        } else {
            console.log("✅ Logged in! Parsing orders...");
            const detailedData = await page.evaluate(() => {
                const results = [];
                const txt = document.body.innerText;
                const groupRegex = /Group\s+([A-Z0-9]+)\s+-\s+([^(\n]+)/i;
                const elements = Array.from(document.querySelectorAll('*'));
                const groups = elements.filter(el => groupRegex.test(el.innerText) && el.innerText.length < 5000);

                groups.forEach(groupEl => {
                    const txt = groupEl.innerText;
                    const match = txt.match(groupRegex);
                    if (!match) return;
                    const code = match[1];
                    const company = match[2].trim();
                    const lines = txt.split('\n').map(l => l.trim()).filter(l => l);
                    const items = [];
                    const itemsFound = new Set();
                    for (let i = 0; i < lines.length; i++) {
                        if (lines[i].includes('$') && lines[i].match(/\$\d+\.\d{2}/)) {
                            const price = lines[i];
                            const dish = lines[i-1] || "";
                            const user = lines[i-2] || "";
                            const key = `${user}-${dish}`.toLowerCase();
                            if (dish && !itemsFound.has(key)) {
                                let side = "";
                                for(let k=1; k<=5; k++) if (lines[i+k] && lines[i+k].includes('Add Side')) side = lines[i+k].replace('»', '').trim();
                                items.push({ name: dish, notes: side, user: user });
                                itemsFound.add(key);
                            }
                        }
                    }
                    if (items.length > 0) results.push({ code, company, items });
                });
                return results;
            });

            for (const order of detailedData) {
                const dbOrderId = `FORK-${order.code}-${today}`;
                await setDoc(doc(db, 'orders', dbOrderId), {
                    id: dbOrderId, platform: "Forkable", customerName: order.company,
                    deliveryDate: today, status: "New", items: order.items.map(itm => ({ name: itm.name, amount: 1, notes: itm.notes })),
                    createdAt: new Date().toISOString()
                }, { merge: true });
                console.log(`      ✅ Synced ${order.company}`);
            }
        }
    } catch (err) {
        console.error(err);
    } finally {
        await browser.close();
        process.exit(0);
    }
})();
