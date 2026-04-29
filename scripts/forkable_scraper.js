import puppeteer from 'puppeteer';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, collection, query, where, getDocs, deleteDoc } from "firebase/firestore";
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
    console.log("🚀 STARTING REFINED HIERARCHY SYNC...");
    const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 1200 });

    try {
        await page.goto("https://forkable.com/fpp/login", { waitUntil: 'networkidle2' });
        await page.type('input[type="email"]', FORKABLE_EMAIL, { delay: 100 });
        await page.keyboard.press('Enter');
        await new Promise(r => setTimeout(r, 3000));
        await page.type('input[type="password"]', FORKABLE_PASS, { delay: 100 });
        await page.keyboard.press('Enter');
        await new Promise(r => setTimeout(r, 8000));

        // --- DYNAMIC DATE HANDLING ---
        let targetDate = process.argv[2]; 
        if (!targetDate) {
            const today = new Date();
            targetDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        }
        
        console.log(`📡 Accessing Daily Summary for: ${targetDate}...`);
        
        // Go to the main day page
        const dayUrl = `https://forkable.com/fpp/2297/${targetDate}`;
        await page.goto(dayUrl, { waitUntil: 'networkidle2', timeout: 60000 });
        console.log(`⏳ Waiting for summary list...`);
        await new Promise(r => setTimeout(r, 5000));

        // 1. Click the row to expand Morning/Afternoon cards
        await page.evaluate((date) => {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const d = new Date(date + 'T12:00:00');
            const matchStr = `${months[d.getMonth()]} ${d.getDate()}`;
            
            const rows = Array.from(document.querySelectorAll('.pickup-day'));
            const targetRow = rows.find(r => r.innerText.includes(matchStr) || r.innerText.toLowerCase().includes('today'));
            
            if (targetRow) {
                const clickable = targetRow.querySelector('.cursor-pointer') || targetRow.querySelector('span.text-blue') || targetRow;
                clickable.click();
            }
        }, targetDate);

        console.log(`⏳ Waiting for AM/PM cards to render...`);
        await new Promise(r => setTimeout(r, 10000));

        // 2. Find all "View Order" links
        const sessionUrls = await page.evaluate(() => {
            const allElements = Array.from(document.querySelectorAll('a, button, div, span'));
            const buttons = allElements.filter(el => {
                const text = el.innerText || "";
                return text.toLowerCase().includes('view order') && (el.tagName === 'A' || el.tagName === 'BUTTON' || el.classList.contains('btn'));
            });
            
            return buttons.map(b => {
                if (b.tagName === 'A') return b.href;
                const parentA = b.closest('a');
                return parentA ? parentA.href : null;
            }).filter(href => href && href.includes('/fpp/'));
        });

        // Unique URLs only
        const uniqueSessionUrls = [...new Set(sessionUrls)];
        console.log(`🔍 Found ${uniqueSessionUrls.length} unique pickup sessions.`);
        
        const allExtractedData = [];

        for (const url of uniqueSessionUrls) {
            console.log(`🚀 Scraping session: ${url}`);
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
            await new Promise(r => setTimeout(r, 8000));

            const results = await page.evaluate(() => {
                const bodyText = document.body.innerText;
                const timeRegex = /(\d{1,2}:\d{2})\s*[A|P]M/gi;
                const times = Array.from(bodyText.matchAll(timeRegex)).map(m => ({
                    index: m.index,
                    time: m[0]
                }));

                const extracted = [];
                const groupRegex = /Group\s+([A-Z0-9]+)\s+.+?\s+([^\n$]+)/gi;
                let m;
                while ((m = groupRegex.exec(bodyText)) !== null) {
                    const code = m[1].replace('FORK-', '').trim();
                    const company = m[2].trim();
                    
                    let pickupTime = "undefined";
                    for (let t = times.length - 1; t >= 0; t--) {
                        if (times[t].index < m.index) {
                            pickupTime = times[t].time;
                            break;
                        }
                    }

                    const segment = bodyText.substring(m.index, m.index + 8000);
                    const segmentLines = segment.split('\n').map(l => l.trim()).filter(l => l);
                    
                    const items = [];
                    let subtotal = 0;
                    let pIdx = -1;
                    let pendingNotes = [];
                    for (let i = 0; i < segmentLines.length; i++) {
                        if (segmentLines[i].match(/^\$\d+\.\d{2}$/)) {
                            const price = parseFloat(segmentLines[i].replace('$', ''));
                            subtotal += price;

                            let block = segmentLines.slice(pIdx + 1, i).map(l => l.trim()).filter(l => l);
                            
                            // Skip summary lines like "10 items", "1 item" or just "10"
                            while (block.length > 0 && (block[0].match(/^\d+$/) || block[0].toLowerCase().includes(' item') || block[0].toLowerCase().includes('group '))) {
                                block.shift();
                            }
                            
                            if (block.length >= 1) {
                                // Identify which lines are sides/notes and which are dish/name info
                                const sideMarker = (l) => l.includes('»') || l.toLowerCase().includes('add side') || l.toLowerCase().includes('please') || l.toLowerCase().includes('no ');
                                
                                let dishLines = [];
                                let currentBlockSides = [];
                                
                                // If the block starts with a side note, it likely belongs to the PREVIOUS item (pushed down by price)
                                while (block.length > 0 && sideMarker(block[0])) {
                                    const side = block.shift().replace('»', '').trim();
                                    if (items.length > 0) {
                                        const last = items[items.length - 1];
                                        last.notes = last.notes ? `${last.notes} | ${side}` : side;
                                    } else {
                                        pendingNotes.push(side);
                                    }
                                }
                                
                                // The remaining lines are the Name, Dish, and any trailing sides
                                for (const line of block) {
                                    if (sideMarker(line)) {
                                        currentBlockSides.push(line.replace('»', '').trim());
                                    } else {
                                        dishLines.push(line);
                                    }
                                }
                                
                                if (dishLines.length >= 1) {
                                    const firstLine = dishLines[0];
                                    const words = firstLine.split(/\s+/).filter(w => w.length > 0);
                                    const isName = words.length >= 2 && words.length <= 4 && !/\d/.test(firstLine);
                                    
                                    let rawDish = "";
                                    let dishNotes = currentBlockSides.join(' | ');
                                    
                                    if (isName && dishLines.length >= 2) {
                                        rawDish = dishLines[1];
                                        const extra = dishLines.slice(2).join(' | ');
                                        if (extra) dishNotes = dishNotes ? `${dishNotes} | ${extra}` : extra;
                                    } else {
                                        rawDish = firstLine;
                                        const extra = dishLines.slice(1).join(' | ');
                                        if (extra) dishNotes = dishNotes ? `${dishNotes} | ${extra}` : extra;
                                    }
                                    
                                    rawDish = rawDish.replace(/^\d+x\s+/, '').trim();
                                    if (rawDish) {
                                        if (pendingNotes.length > 0) {
                                            dishNotes = pendingNotes.join(' | ') + (dishNotes ? ` | ${dishNotes}` : '');
                                            pendingNotes = [];
                                        }
                                        items.push({ name: rawDish, price, notes: dishNotes });
                                    }
                                }
                            }
                            pIdx = i;
                        }
                        if (i > 0 && segmentLines[i].toLowerCase().includes('group ') && segmentLines[i].includes(' - ')) break;
                    }
                    if (items.length > 0) extracted.push({ code, company, items, pickupTime, subtotal });
                }
                return extracted;
            });
            allExtractedData.push(...results);
        }

        const extractedData = allExtractedData;
        const totalItems = extractedData.reduce((acc, o) => acc + o.items.length, 0);
        
        console.log(`✨ Extracted ${extractedData.length} groups, Total Dishes: ${totalItems}`);
        
        for (const o of extractedData) {
            try {
                console.log(`   -> Processing Group ${o.code} (${o.company})...`);
                
                // --- SIDE AGGREGATION ---
                const sideCounts = {};
                for (const item of o.items) {
                    if (item.notes) {
                        const matches = item.notes.match(/Add Side:\s*([^|()]+)/g);
                        if (matches) {
                            for (const m of matches) {
                                const sideName = m.replace(/Add Side:\s*/, '').trim();
                                sideCounts[sideName] = (sideCounts[sideName] || 0) + 1;
                            }
                        }
                    }
                }

                const aggregatedItems = [...o.items.map(it => ({ name: it.name, amount: 1, notes: it.notes }))];
                for (const [sideName, count] of Object.entries(sideCounts)) {
                    aggregatedItems.push({
                        name: sideName,
                        amount: count,
                        notes: "Aggregated Side Total"
                    });
                }

                const id = `${o.code}-${targetDate}`;
                const subtotal = o.subtotal || 0;
                const total = subtotal;
                const netPayout = total * 0.75; // 25% commission deduction

                console.log(`   📤 Uploading ${id} with ${aggregatedItems.length} items (Subtotal: $${subtotal.toFixed(2)})...`);
                await setDoc(doc(db, 'orders', id), {
                    id, 
                    platform: "Forkable", 
                    customerName: o.company, 
                    deliveryDate: targetDate, 
                    pickupTime: o.pickupTime, 
                    pickUpTime: o.pickupTime,
                    subtotal: parseFloat(subtotal.toFixed(2)),
                    total: parseFloat(total.toFixed(2)),
                    netPayout: parseFloat(netPayout.toFixed(2)),
                    isDeleted: false, 
                    status: "New", 
                    typeOfOrder: "Meal Manager",
                    items: aggregatedItems
                }, { merge: true });
            } catch (err) {
                console.error(`❌ Failed to sync group ${o.code}:`, err);
            }
        }

        // --- CLEANUP PHASE ---
        console.log("🧹 Cleaning up legacy and incorrect duplicates...");
        const q = query(collection(db, 'orders'), where('deliveryDate', '==', targetDate));
        const snapshot = await getDocs(q);
        for (const d of snapshot.docs) {
            if (d.id.startsWith('FORK-') || d.id.startsWith('Astranis-') || d.id.startsWith('Descript-')) {
                console.log(`🗑️ Removing incorrect entry: ${d.id}`);
                await deleteDoc(doc(db, 'orders', d.id));
            }
        }
        console.log("✨ Sync complete. Waiting for Firebase to settle...");
        await new Promise(r => setTimeout(r, 3000));
        console.log("🏁 Done.");
    } catch (e) {
        console.error(e);
    } finally {
        await browser.close();
        process.exit(0);
    }
})();
