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
    console.log("🚀 Launching Forkable Dashboard Scraper...");
    
    // Fetch cookie securely from Firebase dashboard
    const crawlerDoc = await getDoc(doc(db, 'system', 'crawlers'));
    const FORKABLE_COOKIE = crawlerDoc.exists() ? crawlerDoc.data()['Forkable']?.cookie : null;

    if (!FORKABLE_COOKIE) {
        console.error("❌ Forkable Cookie is missing from the Dashboard Configuration!");
        process.exit(1);
    }

    const browser = await puppeteer.launch({ 
        headless: "new", 
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 1200 });

    // Inject Cookie
    const parsedCookies = FORKABLE_COOKIE.split(';').map(c => {
        const parts = c.trim().split('=');
        if (parts.length < 2) return null;
        return { name: parts[0], value: parts.slice(1).join('='), domain: '.forkable.com' };
    }).filter(c => c !== null);

    await page.setCookie(...parsedCookies);
    console.log("🔑 Session cookies injected.");

    try {
        await page.goto("https://forkable.com/fpp/2297/17201", { waitUntil: 'networkidle2' });
        
        // Wait for dashboard to load
        await page.waitForFunction(() => 
            document.body.innerText.includes('Home') || 
            document.body.innerText.includes('Login'), 
            { timeout: 15000 }
        );

        if (page.url().includes('/login') || (await page.evaluate(() => document.body.innerText.includes('Sign In') || document.body.innerText.includes('Login')))) {
            console.error("❌ Authentication failed. Cookie may be expired.");
            await setDoc(doc(db, 'system', 'crawlers'), { 'Forkable': { status: 'Expired', lastRun: new Date().toLocaleString() } }, { merge: true });
            await sendAlertEmail(db, 'Forkable');
            process.exit(1);
        }

        console.log("📡 Dashboard loaded successfully.");

        // Iterate through the days of the week visible on the main screen
        const dayRows = await page.evaluate(() => {
            const rows = [];
            const elements = Array.from(document.querySelectorAll('div, span, p, h1, h2, h3, h4'));
            // Look for patterns like "Monday, Apr 27"
            const dayRegex = /(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),\s[A-Z][a-z]+\s\d+/;
            
            elements.forEach(el => {
                const text = el.innerText ? el.innerText.trim() : "";
                if (dayRegex.test(text) && text.length < 50) {
                    if (!rows.find(r => r.text === text)) {
                        rows.push({ text: text });
                    }
                }
            });
            return rows;
        });

        console.log(`📅 Found ${dayRows.length} days with pickups:`, dayRows.map(d => d.text).join(' | '));

        let syncedCount = 0;

        for (const day of dayRows) {
            console.log(`\n🔍 Checking orders for ${day.text}...`);
            
            // Expand the day by clicking elements with that text
            await page.evaluate((dayText) => {
                const elements = Array.from(document.querySelectorAll('*'));
                const dayEl = elements.find(el => el.innerText && el.innerText.trim() === dayText);
                if (dayEl) {
                    dayEl.click();
                    // Sometimes we need to click the parent or a chevron
                    if (dayEl.parentElement && dayEl.parentElement.tagName === 'DIV') dayEl.parentElement.click();
                }
            }, day.text);
            
            await new Promise(r => setTimeout(r, 2500));

            // Look for "View Complete Order" button
            const clickResult = await page.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('button, a, div, span'));
                const btn = buttons.find(b => b.innerText && (b.innerText.includes('View Complete Order') || b.innerText.includes('View Order')));
                if (btn) {
                    btn.scrollIntoView();
                    btn.click();
                    return true;
                }
                return false;
            });

            if (!clickResult) {
                console.log(`   ⏭️ Could not find or click "View Complete Order" button for ${day.text}.`);
                continue;
            }

            console.log(`   👉 Clicked "View Complete Order". Waiting for navigation...`);
            await new Promise(r => setTimeout(r, 4000));

            // Check if we navigated
            const currentUrl = page.url();
            console.log(`   📍 Current URL: ${currentUrl}`);

            // Now on the detailed order page
            const detailedData = await page.evaluate(() => {
                const results = [];
                const fullText = document.body.innerText;
                
                // Get the date from the header (e.g., "Monday April 27, 2026")
                const dateHeaderMatch = fullText.match(/(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\s+([A-Z][a-z]+)\s+(\d+),\s+(\d{4})/i);
                let formattedDate = "";
                if (dateHeaderMatch) {
                    const months = { 'January':'01', 'February':'02', 'March':'03', 'April':'04', 'May':'05', 'June':'06', 'July':'07', 'August':'08', 'September':'09', 'October':'10', 'November':'11', 'December':'12' };
                    const yr = dateHeaderMatch[4];
                    const mo = months[dateHeaderMatch[2]] || '01';
                    const dy = String(dateHeaderMatch[3]).padStart(2, '0');
                    formattedDate = `${yr}-${mo}-${dy}`;
                } else {
                    // Fallback to today UTC if not found
                    formattedDate = new Date().toISOString().split('T')[0];
                }

                const timeRegex = /\d{1,2}:\d{2}\s+(AM|PM)/;
                const elements = Array.from(document.querySelectorAll('*'));
                
                const timeHeaders = elements.filter(el => 
                    el.innerText && 
                    timeRegex.test(el.innerText.trim()) && 
                    el.innerText.trim().length <= 10 &&
                    el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE'
                );

                timeHeaders.forEach(timeEl => {
                    const pickupTime = timeEl.innerText.trim();
                    let container = timeEl.parentElement;
                    // Find a container that likely holds the group info (often a row or section)
                    while (container && container.innerText.length < 100 && container.parentElement) {
                        container = container.parentElement;
                    }

                    if (!container) return;

                    const groupTitleRegex = /Group\s+([A-Z0-9]+)\s+-\s+([^(\n]+)/i;
                    const groupMatches = Array.from(container.querySelectorAll('*'))
                        .filter(el => groupTitleRegex.test(el.innerText))
                        .map(el => {
                            const match = el.innerText.match(groupTitleRegex);
                            return {
                                el: el,
                                code: match[1],
                                company: match[2].trim()
                            };
                        });

                    groupMatches.forEach((group) => {
                        const items = [];
                        // Search for items in siblings or children of following siblings
                        let scanEl = group.el;
                        while (scanEl && items.length === 0) {
                            const lines = scanEl.innerText.split('\n').map(l => l.trim()).filter(l => l);
                            for (let i = 0; i < lines.length; i++) {
                                if (lines[i].includes('$') && lines[i].match(/\$\d+\.\d{2}/)) {
                                    const priceLine = lines[i];
                                    const dishLine = lines[i-1] || "";
                                    const nameLine = lines[i-2] || "";
                                    
                                    let sideNote = "";
                                    if (lines[i+1] && lines[i+1].includes('Add Side')) {
                                        sideNote = lines[i+1].replace('»', '').trim();
                                    }

                                    if (dishLine && !dishLine.includes('Group') && !dishLine.includes(pickupTime)) {
                                        items.push({
                                            name: dishLine,
                                            user: nameLine,
                                            price: priceLine,
                                            notes: sideNote
                                        });
                                    }
                                }
                            }
                            scanEl = scanEl.nextElementSibling || (scanEl.parentElement ? scanEl.parentElement.nextElementSibling : null);
                            if (scanEl && scanEl.innerText.includes('Group')) break; // Stop at next group
                        }

                        if (items.length > 0) {
                            results.push({
                                orderId: `FORK-${group.code}-${formattedDate}-${pickupTime.replace(/\s+/g, '')}`,
                                rawId: `${group.code}-${formattedDate}`,
                                platform: "Forkable",
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

            console.log(`   📦 Extracted ${detailedData.length} groups/orders for this day.`);

            for (const order of detailedData) {
                const dbOrderId = order.orderId;
                
                const finalOrder = {
                    id: order.rawId,
                    platform: "Forkable",
                    customerName: order.customerName,
                    typeOfOrder: "Meal Manager",
                    deliveryDate: order.deliveryDate,
                    deliveryTime: order.pickUpTime,
                    deliveryMethod: "Platform",
                    pickUpTime: order.pickUpTime,
                    subtotal: order.subtotal,
                    total: order.subtotal, 
                    netPayout: order.subtotal,
                    status: "New",
                    overallNotes: "Automatically extracted via Forkable Dashboard scraper.",
                    items: order.items.map(itm => ({
                        name: itm.name,
                        amount: 1,
                        notes: itm.notes
                    })),
                    createdAt: new Date().toISOString()
                };

                const today = new Date().toISOString().split('T')[0];
                if (order.deliveryDate < today) {
                    finalOrder.status = "Completed";
                }

                const docRef = doc(db, 'orders', dbOrderId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists() && (docSnap.data().manualOverride || docSnap.data().isDeleted)) {
                    console.log(`      ⏭️  Skipped (Manual Override): ${dbOrderId}`);
                    continue;
                }

                await setDoc(docRef, finalOrder, { merge: true });
                console.log(`      ✅ Synced Order ${dbOrderId} (${order.customerName}) - ${order.items.length} items`);
                syncedCount++;
            }

            // Go back or return to the main dashboard URL
            await page.goto("https://forkable.com/fpp/2297/17201", { waitUntil: 'networkidle2' });
            await new Promise(r => setTimeout(r, 2000));
        }

        await setDoc(doc(db, 'system', 'crawlers'), { 'Forkable': { status: 'Active', lastRun: new Date().toLocaleString() } }, { merge: true });
        console.log(`\n🎉 Processed ${syncedCount} total Forkable orders. System Shutdown.`);

        await logScraperAction("Run Success", { syncedCount, platform: 'Forkable' });

    } catch (err) {
        console.error("❌ Fatal Error during scraping:", err);
        await logScraperAction("Fatal Error", { error: err.message, platform: 'Forkable' });
    } finally {
        await browser.close();
        process.exit(0);
    }
})();

async function logScraperAction(action, data) {
    try {
        await addDoc(collection(db, 'scraper_logs'), {
            action,
            data,
            timestamp: new Date().toISOString()
        });
    } catch(e) { console.error("Logging failed", e); }
}
