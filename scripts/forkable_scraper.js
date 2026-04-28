import puppeteer from 'puppeteer';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, getDocs, collection, addDoc } from "firebase/firestore";
import * as dotenv from 'dotenv';
import { sendAlertEmail } from './mailer.js';

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

(async () => {
    console.log("🚀 Launching Forkable Hybrid Scraper...");
    
    const crawlerDoc = await getDoc(doc(db, 'system', 'crawlers'));
    const FORKABLE_COOKIE = crawlerDoc.exists() ? crawlerDoc.data()['Forkable']?.cookie : null;

    if (!FORKABLE_COOKIE) {
        console.error("❌ Forkable Cookie is missing!");
        process.exit(1);
    }

    const browser = await puppeteer.launch({ 
        headless: "new", 
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 1200 });

    // Set cookies both as page cookies and as extra headers for maximum compatibility
    const cookieArray = FORKABLE_COOKIE.split(';').map(c => {
        const parts = c.trim().split('=');
        if (parts.length < 2) return null;
        return { 
            name: parts[0], 
            value: parts.slice(1).join('='), 
            domain: '.forkable.com', 
            path: '/' 
        };
    }).filter(c => c !== null);

    await page.setCookie(...cookieArray);
    await page.setExtraHTTPHeaders({ 'Cookie': FORKABLE_COOKIE });
    console.log("🔑 Authentication headers injected.");

    try {
        const today = new Date();
        const currentDay = today.getDay();
        const monday = new Date(today);
        monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
        
        const weekDates = [];
        for (let i = 0; i < 5; i++) {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            weekDates.push(d.toISOString().split('T')[0]);
        }

        let syncedCount = 0;

        for (const targetDate of weekDates) {
            const targetUrl = `https://forkable.com/fpp/2297/${targetDate}/17201`;
            console.log(`\n📡 Scraping Date: ${targetDate} -> ${targetUrl}`);
            
            await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 30000 });
            await new Promise(r => setTimeout(r, 4000));

            const bodyText = await page.evaluate(() => document.body.innerText);
            
            if (bodyText.includes('404 error') || bodyText.length < 1200) {
                console.log(`   ⏭️ 404/Empty - Skipping.`);
                continue;
            }

            if (bodyText.includes('Sign in') || bodyText.includes('Login')) {
                console.error("   ❌ Authentication failed at URL. Check Cookie.");
                break;
            }

            const detailedData = await page.evaluate(() => {
                const results = [];
                const fullText = document.body.innerText;
                const timeRegex = /\d{1,2}:\d{2}\s+(AM|PM)/;
                
                const dateHeaderMatch = fullText.match(/(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\s+([A-Z][a-z]+)\s+(\d+),\s+(\d{4})/i);
                let formattedDate = "";
                if (dateHeaderMatch) {
                    const months = { 'January':'01', 'February':'02', 'March':'03', 'April':'04', 'May':'05', 'June':'06', 'July':'07', 'August':'08', 'September':'09', 'October':'10', 'November':'11', 'December':'12' };
                    formattedDate = `${dateHeaderMatch[4]}-${months[dateHeaderMatch[2]] || '01'}-${String(dateHeaderMatch[3]).padStart(2, '0')}`;
                }

                const elements = Array.from(document.querySelectorAll('*'));
                const timeHeaders = elements.filter(el => 
                    el.innerText && timeRegex.test(el.innerText.trim()) && 
                    el.innerText.trim().length <= 10 && el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE'
                );

                timeHeaders.forEach(timeEl => {
                    const pickupTime = timeEl.innerText.trim();
                    let container = timeEl.parentElement;
                    while (container && container.innerText.length < 150 && container.parentElement) {
                        container = container.parentElement;
                    }
                    if (!container) return;

                    const groupTitleRegex = /Group\s+([A-Z0-9]+)\s+-\s+([^(\n]+)/i;
                    const groupMatches = Array.from(container.querySelectorAll('*'))
                        .filter(el => groupTitleRegex.test(el.innerText))
                        .map(el => {
                            const match = el.innerText.match(groupTitleRegex);
                            return { el: el, code: match[1], company: match[2].trim() };
                        });

                    groupMatches.forEach((group) => {
                        const items = [];
                        let current = group.el.nextElementSibling;
                        if (!current && group.el.parentElement) current = group.el.parentElement.nextElementSibling;

                        const itemsFound = new Set();
                        for (let j = 0; j < 15; j++) {
                            if (!current) break;
                            if (current.innerText.includes('Group') && !current.innerText.includes(group.code)) break;

                            const lines = current.innerText.split('\n').map(l => l.trim()).filter(l => l);
                            for (let i = 0; i < lines.length; i++) {
                                if (lines[i].includes('$') && lines[i].match(/\$\d+\.\d{2}/)) {
                                    const price = lines[i];
                                    const dish = lines[i-1] || "";
                                    const user = lines[i-2] || "";
                                    const itemKey = `${user}-${dish}-${price}`.toLowerCase();
                                    
                                    if (dish && !dish.includes('Group') && !itemsFound.has(itemKey)) {
                                        let side = "";
                                        // Scan surrounding lines for "Add Side"
                                        for(let k=1; k<=3; k++) {
                                            if (lines[i+k] && lines[i+k].includes('Add Side')) {
                                                side = lines[i+k].replace('»', '').trim();
                                                break;
                                            }
                                        }
                                        items.push({ name: dish, user, price, notes: side });
                                        itemsFound.add(itemKey);
                                    }
                                }
                            }
                            current = current.nextElementSibling;
                        }

                        if (items.length > 0) {
                            results.push({
                                orderId: `FORK-${group.code}-${formattedDate}-${pickupTime.replace(/\s+/g, '')}`,
                                rawId: `${group.code}-${formattedDate}`,
                                customerName: group.company,
                                deliveryDate: formattedDate,
                                pickUpTime: pickupTime,
                                items: items,
                                subtotal: items.reduce((sum, itm) => sum + (parseFloat(itm.price.replace('$', '')) || 0), 0)
                            });
                        }
                    });
                });
                return results;
            });

            for (const order of detailedData) {
                const dbOrderId = order.orderId;
                const finalOrder = {
                    id: order.rawId, platform: "Forkable", customerName: order.customerName,
                    typeOfOrder: "Meal Manager", deliveryDate: order.deliveryDate || targetDate,
                    deliveryTime: order.pickUpTime, deliveryMethod: "Platform",
                    pickUpTime: order.pickUpTime, subtotal: order.subtotal,
                    total: order.subtotal, netPayout: order.subtotal, status: "New",
                    overallNotes: "Automatically extracted via Forkable Hybrid scraper.",
                    items: order.items.map(itm => ({ name: itm.name, amount: 1, notes: itm.notes })),
                    createdAt: new Date().toISOString()
                };

                if (finalOrder.deliveryDate < new Date().toISOString().split('T')[0]) finalOrder.status = "Completed";

                await setDoc(doc(db, 'orders', dbOrderId), finalOrder, { merge: true });
                console.log(`      ✅ Synced ${dbOrderId} (${order.customerName})`);
                syncedCount++;
            }
        }

        await setDoc(doc(db, 'system', 'crawlers'), { 'Forkable': { status: 'Active', lastRun: new Date().toLocaleString() } }, { merge: true });
        console.log(`\n🎉 Success! Synced ${syncedCount} Forkable orders.`);

    } catch (err) {
        console.error("❌ Fatal Error:", err);
    } finally {
        await browser.close();
        process.exit(0);
    }
})();
