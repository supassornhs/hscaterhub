import puppeteer from 'puppeteer';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, getDocs, collection } from "firebase/firestore";
import * as dotenv from 'dotenv';
import { sendAlertEmail } from './mailer.js';

dotenv.config();

const firebaseConfig = {
    apiKey: "AIzaSyCj__TCfYSF-1y4uR-UOId_aPWWwy4-W5A",
    authDomain: "hscaterhub.firebaseapp.com",
    projectId: "hscaterhub"
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
    await page.setViewport({ width: 1280, height: 1000 });

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
            document.body.innerText.includes('Pickups for') || 
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
            const elements = Array.from(document.querySelectorAll('div, span, p'));
            // Look for patterns like "Monday, Apr 27"
            const dayRegex = /(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),\s[A-Z][a-z]+\s\d+/;
            
            elements.forEach(el => {
                if (dayRegex.test(el.innerText) && el.innerText.length < 50) {
                    // Avoid duplicates and find the container that might be clickable
                    const text = el.innerText.trim();
                    if (!rows.find(r => r.text === text)) {
                        rows.push({ text: text });
                    }
                }
            });
            return rows;
        });

        console.log(`📅 Found ${dayRows.length} days with pickups.`);

        let syncedCount = 0;

        for (const day of dayRows) {
            console.log(`\n🔍 Checking orders for ${day.text}...`);
            
            // Expand the day if needed
            await page.evaluate((dayText) => {
                const elements = Array.from(document.querySelectorAll('*'));
                const dayEl = elements.find(el => el.innerText && el.innerText.trim() === dayText);
                if (dayEl) dayEl.click();
            }, day.text);
            
            await new Promise(r => setTimeout(r, 2000));

            // Look for "View Completed Order" button
            const hasViewBtn = await page.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('button, a'));
                const btn = buttons.find(b => b.innerText && b.innerText.includes('View') && b.innerText.includes('Order'));
                if (btn) {
                    btn.click();
                    return true;
                }
                return false;
            });

            if (!hasViewBtn) {
                console.log(`   ⏭️ No "View Completed Order" button found for ${day.text}. Skipping.`);
                continue;
            }

            await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(() => {});
            await new Promise(r => setTimeout(r, 3000));

            // Now on the detailed order page
            const detailedData = await page.evaluate(() => {
                const results = [];
                const fullText = document.body.innerText;
                
                // Get the date from the header (e.g., "Monday April 27, 2026")
                const dateHeaderMatch = fullText.match(/(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\s+([A-Z][a-z]+)\s+(\d+),\s+(\d{4})/i);
                let formattedDate = "";
                if (dateHeaderMatch) {
                    const months = { 'January':1, 'February':2, 'March':3, 'April':4, 'May':5, 'June':6, 'July':7, 'August':8, 'September':9, 'October':10, 'November':11, 'December':12 };
                    const yr = dateHeaderMatch[4];
                    const mo = String(months[dateHeaderMatch[2]] || 1).padStart(2, '0');
                    const dy = String(dateHeaderMatch[3]).padStart(2, '0');
                    formattedDate = `${yr}-${mo}-${dy}`;
                }

                // Find all pickup blocks
                // Pickup times are often highlighted/positioned at the top of a group
                // We'll search for time patterns like "10:30 AM"
                const elements = Array.from(document.querySelectorAll('*'));
                const timeRegex = /\d{1,2}:\d{2}\s+(AM|PM)/;
                
                // Find indices of times in the text to chunk the data
                // Or better, find elements that look like time headers
                const timeHeaders = elements.filter(el => 
                    el.innerText && 
                    timeRegex.test(el.innerText.trim()) && 
                    el.innerText.trim().length <= 10 &&
                    el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE'
                );

                timeHeaders.forEach(timeEl => {
                    const pickupTime = timeEl.innerText.trim();
                    
                    // The parent container probably holds the groups and items
                    // Let's find the container that contains this time and the next content blocks
                    let container = timeEl.parentElement;
                    while (container && container.innerText.length < 200) {
                        container = container.parentElement;
                    }

                    if (!container) return;

                    // Inside this container, look for "Group XX - Company Name"
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

                    groupMatches.forEach((group, idx) => {
                        // Find items for this group
                        // Items are usually siblings or inside a following sibling container
                        const items = [];
                        let nextEl = group.el.nextElementSibling;
                        if (!nextEl) nextEl = group.el.parentElement.nextElementSibling;

                        // Scan until the next group or end of container
                        // This is tricky, let's use a simpler heuristic: look for item rows
                        // Item rows have: Name, Dish, Price, and maybe "Add Side"
                        
                        // We'll search for the next table or list of items
                        const itemContainer = nextEl;
                        if (itemContainer) {
                            const lines = itemContainer.innerText.split('\n').map(l => l.trim()).filter(l => l);
                            
                            for (let i = 0; i < lines.length; i++) {
                                // Pattern: "Name dishName $price" or "Name [newline] dishName [newline] $price"
                                // Let's try to find lines with prices
                                if (lines[i].includes('$')) {
                                    const priceLine = lines[i];
                                    const dishLine = lines[i-1] || "";
                                    const nameLine = lines[i-2] || "";
                                    
                                    // Check if there's a side instruction following
                                    let sideNote = "";
                                    if (lines[i+1] && lines[i+1].includes('Add Side')) {
                                        sideNote = lines[i+1].replace('»', '').trim();
                                    }

                                    if (nameLine && dishLine && priceLine.match(/\$\d+\.\d{2}/)) {
                                        items.push({
                                            name: dishLine,
                                            user: nameLine,
                                            price: priceLine,
                                            notes: sideNote
                                        });
                                    }
                                }
                            }
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
                
                // Prepare final payload
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
                    total: order.subtotal * 1.1, // Estimating tax/fees
                    netPayout: order.subtotal * 0.9, // Estimating commission
                    status: "New",
                    overallNotes: "Automatically extracted via Forkable Dashboard scraper.",
                    items: order.items.map(itm => ({
                        name: itm.name,
                        amount: 1,
                        notes: itm.notes
                    })),
                    createdAt: new Date().toISOString()
                };

                // Check status based on date
                const today = new Date().toISOString().split('T')[0];
                if (order.deliveryDate < today) {
                    finalOrder.status = "Completed";
                }

                // Sync to Firestore if no manual override
                const docRef = doc(db, 'orders', dbOrderId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists() && (docSnap.data().manualOverride || docSnap.data().isDeleted)) {
                    console.log(`      ⏭️  Skipped (Manual Override): ${dbOrderId}`);
                    continue;
                }

                await setDoc(docRef, finalOrder, { merge: true });
                console.log(`      ✅ Synced Order ${dbOrderId} (${order.customerName})`);
                syncedCount++;
            }

            // Go back to the week view
            await page.evaluate(() => {
                const backBtn = Array.from(document.querySelectorAll('a, button'))
                    .find(el => el.innerText && el.innerText.toLowerCase().includes('back to full week'));
                if (backBtn) backBtn.click();
            });
            await new Promise(r => setTimeout(r, 2000));
        }

        await setDoc(doc(db, 'system', 'crawlers'), { 'Forkable': { status: 'Active', lastRun: new Date().toLocaleString() } }, { merge: true });
        console.log(`\n🎉 Processed ${syncedCount} Forkable orders. System Shutdown.`);

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
