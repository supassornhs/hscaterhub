import puppeteer from 'puppeteer';
import fs from 'fs';
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

        const targetDate = '2026-04-27';
        console.log(`📡 Accessing Dashboard for ${targetDate}...`);
        const directUrl = `https://forkable.com/fpp/2297/${targetDate}/17201/958145,956765,960057,957695`;
        await page.goto(directUrl, { waitUntil: 'networkidle2', timeout: 60000 });
        
        // Wait for the content to actually render
        console.log("⏳ Waiting for pickup cards to load...");
        await new Promise(r => setTimeout(r, 8000));

        console.log("🔍 Extracting orders from Detail View...");
        const results = await page.evaluate(() => {
            const bodyText = document.body.innerText;
            
            // 1. Find all times - more relaxed to catch hidden characters
            const timeRegex = /(\d{1,2}:\d{2})\s*[A|P]M/gi;
            const times = Array.from(bodyText.matchAll(timeRegex)).map(m => ({
                index: m.index,
                time: m[0]
            }));

            // 2. Find all groups
            const extracted = [];
            const groupRegex = /Group\s+([A-Z0-9]+)\s+.+?\s+([^\n$]+)/gi;
            let m;
            while ((m = groupRegex.exec(bodyText)) !== null) {
                const code = m[1].replace('FORK-', '').trim();
                const company = m[2].trim();
                
                // Find nearest time BEFORE this group
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
                let pIdx = 0;
                let pendingNotes = [];
                for (let i = 0; i < segmentLines.length; i++) {
                    if (segmentLines[i].match(/^\$\d+\.\d{2}$/)) {
                        let block = segmentLines.slice(pIdx + 1, i).map(l => l.trim()).filter(l => l);
                        
                        // Skip summary lines like "10 items", "1 item" or just "10"
                        while (block.length > 0 && (block[0].match(/^\d+$/) || block[0].toLowerCase().includes(' item') || block[0].includes('Group '))) {
                            block.shift();
                        }
                        
                        if (block.length >= 1) {
                            const firstLine = block[0].trim();
                            const isSideOrNote = firstLine.includes('»') || firstLine.toLowerCase().includes('add side') || firstLine.toLowerCase().includes('please') || firstLine.toLowerCase().includes('no ');
                            
                            // Improved name check: 2-4 words, no numbers, handles all whitespace
                            const words = firstLine.split(/\s+/).filter(w => w.length > 0);
                            const isName = !isSideOrNote && words.length >= 2 && words.length <= 4 && !/\d/.test(firstLine);
                            
                            let rawDish = "";
                            let extraNotes = "";
                            if (isName && block.length >= 2) {
                                rawDish = block[1].replace('»', '').trim();
                                extraNotes = block.slice(2).map(n => n.replace('»', '').trim()).join(' | ');
                            } else {
                                rawDish = firstLine.replace('»', '').trim();
                                extraNotes = block.slice(1).map(n => n.replace('»', '').trim()).join(' | ');
                            }
                            rawDish = rawDish.replace(/^\d+x\s+/, '').trim();
                            if (isSideOrNote) {
                                const sideText = extraNotes ? `${rawDish} (${extraNotes})` : rawDish;
                                if (items.length > 0) {
                                    const last = items[items.length - 1];
                                    last.notes = last.notes ? `${last.notes} | ${sideText}` : sideText;
                                } else {
                                    pendingNotes.push(sideText);
                                }
                            } else if (rawDish) {
                                let combinedNotes = extraNotes;
                                if (pendingNotes.length > 0) {
                                    combinedNotes = pendingNotes.join(' | ') + (combinedNotes ? ` | ${combinedNotes}` : '');
                                    pendingNotes = [];
                                }
                                items.push({ name: rawDish, notes: combinedNotes });
                            }
                        }
                        pIdx = i;
                    }
                    if (i > 0 && segmentLines[i].includes('Group ') && segmentLines[i].includes(' - ')) break;
                }
                if (items.length > 0) extracted.push({ code, company, items, pickupTime });
            }
            return { extracted, timesCount: times.length };
        });

        const extractedData = results.extracted;
        const totalItems = extractedData.reduce((acc, o) => acc + o.items.length, 0);
        
        console.log(`⏱️  Diagnostic: Found ${results.timesCount} timestamps on the page.`);
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
                console.log(`   📤 Uploading ${id} with ${aggregatedItems.length} items...`);
                await setDoc(doc(db, 'orders', id), {
                    id, 
                    platform: "Forkable", 
                    customerName: o.company, 
                    deliveryDate: targetDate, 
                    pickupTime: o.pickupTime, 
                    pickUpTime: o.pickupTime,
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
