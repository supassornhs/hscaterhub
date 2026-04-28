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
    console.log("🚀 Launching Forkable Full-Week Scraper...");
    const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 1200 });

    try {
        console.log("📡 Logging in...");
        await page.goto("https://forkable.com/fpp/login", { waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 2000));

        await page.type('input[type="email"]', FORKABLE_EMAIL, { delay: 60 });
        await page.keyboard.press('Enter');
        await new Promise(r => setTimeout(r, 4000));

        await page.type('input[type="password"]', FORKABLE_PASS, { delay: 60 });
        await page.keyboard.press('Enter');
        await new Promise(r => setTimeout(r, 8000));

        if (page.url().includes('login')) {
            console.error("❌ Login failed.");
            process.exit(1);
        }

        const todayDate = new Date();
        const monday = new Date(todayDate);
        monday.setDate(todayDate.getDate() - (todayDate.getDay() === 0 ? 6 : todayDate.getDay() - 1));
        
        const weekDates = [];
        for (let i = 0; i < 5; i++) {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            weekDates.push(d.toISOString().split('T')[0]);
        }

        console.log(`📅 Syncing week: ${weekDates.join(', ')}`);

        let syncedCount = 0;

        for (const targetDate of weekDates) {
            const targetUrl = `https://forkable.com/fpp/2297/${targetDate}/17201`;
            console.log(`\n⏳ Checking ${targetDate}...`);
            
            await page.goto(targetUrl, { waitUntil: 'networkidle2' });
            await new Promise(r => setTimeout(r, 5000));

            const detailedData = await page.evaluate(() => {
                const results = [];
                const txt = document.body.innerText;
                const groupRegex = /Group\s+([A-Z0-9]+)\s+-\s+([^(\n]+)/i;
                const elements = Array.from(document.querySelectorAll('*'));
                const groups = elements.filter(el => groupRegex.test(el.innerText) && el.innerText.length < 5000);

                groups.forEach(groupEl => {
                    const match = groupEl.innerText.match(groupRegex);
                    if (!match) return;
                    const code = match[1];
                    const company = match[2].trim();
                    const groupText = groupEl.innerText;
                    const lines = groupText.split('\n').map(l => l.trim()).filter(l => l);
                    const items = [];
                    const itemsFound = new Set();
                    for (let i = 0; i < lines.length; i++) {
                        if (lines[i].includes('$')) {
                            const price = lines[i];
                            const dish = lines[i-1] || "";
                            const user = lines[i-2] || "";
                            const key = `${user}-${dish}`.toLowerCase();
                            if (dish && !itemsFound.has(key)) {
                                let side = "";
                                for(let k=1; k<=5; k++) if (lines[i+k] && lines[i+k].includes('Add Side')) side = lines[i+k].replace('»', '').trim();
                                items.push({ name: dish, user, notes: side });
                                itemsFound.add(key);
                            }
                        }
                    }
                    if (items.length > 0) results.push({ code, company, items });
                });
                return results;
            });

            for (const order of detailedData) {
                const dbOrderId = `FORK-$${order.code}-$${targetDate}`; // Fixed ID pattern
                const orderData = {
                    id: dbOrderId.replace(/\$/g, ''),
                    platform: "Forkable",
                    customerName: order.company,
                    typeOfOrder: "Meal Manager",
                    deliveryDate: targetDate,
                    status: "New",
                    items: order.items.map(itm => ({
                        name: itm.name,
                        amount: 1,
                        notes: itm.notes
                    })),
                    createdAt: new Date().toISOString(),
                    isDeleted: false, // Added isDeleted flag
                    manualOverride: false
                };

                const todayStr = new Date().toISOString().split('T')[0];
                if (targetDate < todayStr) orderData.status = "Completed";

                await setDoc(doc(db, 'orders', orderData.id), orderData, { merge: true });
                console.log(`      ✅ Synced ${order.company} (${targetDate})`);
                syncedCount++;
            }
        }
        console.log(`\n🎉 Full Sync Finished! ${syncedCount} Forkable orders updated.`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    } finally {
        await browser.close();
    }
})();
