import fs from 'fs';
import puppeteer from 'puppeteer';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import * as dotenv from 'dotenv';
import { sendAlertEmail } from './mailer.js';
dotenv.config();

// Firebase Configuration (from cater2me_scraper.js)
const firebaseConfig = {
    apiKey: "AIzaSyCj__TCfYSF-1y4uR-UOId_aPWWwy4-W5A",
    authDomain: "hscaterhub.firebaseapp.com",
    projectId: "hscaterhub"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

(async () => {
    console.log("🚀 Initializing Forkable Scraper (Production)...");

    const browser = await puppeteer.launch({
        headless: process.env.CI === 'true' ? "new" : false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    // 1. Fetch Authentication Cookies from Firebase
    console.log("🚀 Fetching cookies from dashboard...");
    const crawlerDoc = await getDoc(doc(db, 'system', 'crawlers'));
    const cookieStr = crawlerDoc.exists() ? crawlerDoc.data()['Forkable']?.cookie : null;

    if (!cookieStr) {
        console.error("❌ No Forkable cookie found in Firebase! Please update it in the dashboard.");
        await browser.close();
        process.exit(1);
    }

    const cookies = cookieStr.split(';').map(pair => {
        const [name, ...valueParts] = pair.trim().split('=');
        return { name, value: valueParts.join('='), domain: 'forkable.com' };
    });
    await page.setCookie(...cookies);

    // 2. Define target dates (Last 3 days to Next 3 days)
    const dates = [];
    for (let i = -3; i <= 3; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        // Only scrape Monday to Friday
        if (d.getDay() >= 1 && d.getDay() <= 5) {
            dates.push(d.toISOString().split('T')[0]);
        }
    }// Remove duplicates and sort
    const uniqueDates = [...new Set(dates)].sort();
    console.log(`📅 Target Dates for scraping window: ${uniqueDates.join(', ')}`);

    for (const date of uniqueDates) {
        try {
            const targetUrl = `https://forkable.com/fpp/2297/${date}/17201`;
            console.log(`📡 Accessing Direct URL: ${targetUrl}`);
            await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 60000 });
            
            // Wait a bit for JS to render
            await new Promise(r => setTimeout(r, 10000)); 

            // Check if we are actually on an order page or a login/empty page
            const pageState = await page.evaluate(() => {
                const text = document.body.innerText;
                if (text.includes('Restaurant Login') || text.includes('Sign in') || document.querySelector('input[type="email"]')) return 'EXPIRED';
                if (text.includes('not found')) return 'NOT_FOUND';
                return 'OK';
            });

            if (pageState === 'EXPIRED') {
                console.error("\n❌ FATAL ERROR: The Forkable Cookie is missing or expired.");
                await setDoc(doc(db, 'system', 'crawlers'), { 'Forkable': { status: 'Expired', lastRun: new Date().toLocaleString() } }, { merge: true });
                console.log("✉️ Dispatching Alert Email...");
                await sendAlertEmail(db, 'Forkable');
                console.log("✅ Alert Email logic triggered.");
                await browser.close();
                process.exit(1);
            }

            if (pageState === 'NOT_FOUND') {
                console.log(`   ⚠️ Date ${date} seems inaccessible (Not Found). Skipping.`);
                continue;
            }

            try {
                await page.waitForFunction(() => {
                    const dayRegex = /(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), [A-Za-z]+ \d+/i;
                    const elements = Array.from(document.querySelectorAll('div, span, p, h1, h2, h3, h4'));
                    return elements.some(el => {
                        const txt = (el.innerText || "").trim();
                        const rect = el.getBoundingClientRect();
                        return dayRegex.test(txt) && rect.width > 0 && rect.height > 0 && txt.length < 100;
                    });
                }, { timeout: 15000 });
            } catch (e) {
                console.log(`   ℹ️ No order rows detected for ${date} (Timeout).`);
                if (!fs.existsSync('./scratch')) fs.mkdirSync('./scratch');
                
                const bodyPreview = await page.evaluate(() => document.body.innerText.substring(0, 500));
                console.log(`   📝 Page Content Preview: ${bodyPreview.replace(/\n/g, ' ')}...`);
                
                await page.screenshot({ path: `./scratch/forkable_timeout_${date}.png` });
                console.log(`   📸 Saved debug screenshot to ./scratch/forkable_timeout_${date}.png`);
                continue;
            }

        const alreadyExpanded = await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('a, button, div, span, .btn'));
            return btns.some(el => {
                const txt = (el.innerText || "").toLowerCase();
                return (txt.includes('view order') || txt.includes('view completed order')) && el.getBoundingClientRect().width > 0;
            });
        });

        if (!alreadyExpanded) {
            const rowTargets = await page.evaluate(() => {
                const dayRegex = /(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), [A-Za-z]+ \d+/i;
                const rows = Array.from(document.querySelectorAll('div, span, p, a, button')).filter(el => {
                    const txt = (el.innerText || "").trim();
                    const rect = el.getBoundingClientRect();
                    return dayRegex.test(txt) && rect.width > 50 && rect.height > 10 && txt.length < 100;
                });
                const r = rows.find(row => !rows.some(other => other !== row && row.contains(other)));
                if (!r) return null;
                r.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                const badge = r.querySelector('[class*="badge"], [class*="count"], .morning-count');
                const rect = r.getBoundingClientRect();
                const targets = [{ x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }];
                if (badge) {
                    const bRect = badge.getBoundingClientRect();
                    targets.unshift({ x: bRect.x + bRect.width / 2, y: bRect.y + bRect.height / 2 });
                }
                return { targets, text: r.innerText };
            });

            if (rowTargets && rowTargets.targets.length > 0) {
                console.log(`   🖱️ Expanding row: "${rowTargets.text.substring(0, 30)}..."`);
                for (const t of rowTargets.targets) {
                    await page.mouse.click(t.x, t.y);
                    await new Promise(r => setTimeout(r, 1000));
                }
            }
            await new Promise(r => setTimeout(r, 8000));
        } else {
            console.log(`   ✨ Row for ${date} already expanded.`);
        }

        const sessionLinks = await page.evaluate(() => {
            const elements = Array.from(document.querySelectorAll('a, button, div, span, .btn'));
            const btns = elements.filter(el => {
                const txt = (el.innerText || "").toLowerCase().trim();
                const rect = el.getBoundingClientRect();
                const isVisible = rect.width > 0 && rect.height > 0;
                return isVisible && txt.length < 35 && (txt.includes('view order') || txt.includes('view completed order'));
            });
            return btns.map(btn => {
                const rect = btn.getBoundingClientRect();
                let href = null;
                // Check if button itself is a link or has a link parent
                if (btn.href) href = btn.href;
                else {
                    const parentLink = btn.closest('a');
                    if (parentLink) href = parentLink.href;
                }
                return { 
                    x: rect.x + rect.width / 2, 
                    y: rect.y + rect.height / 2, 
                    text: btn.innerText.trim(),
                    href: href
                };
            });
        });

        if (sessionLinks.length === 0) {
            console.log(`   ⚠️ No session buttons found for ${date}.`);
            continue;
        }

        console.log(`   🔎 Found ${sessionLinks.length} pickup sessions (e.g. Morning/Afternoon) for ${date}. Processing...`);

        for (let sIdx = 0; sIdx < sessionLinks.length; sIdx++) {
            let session = sessionLinks[sIdx];
            
            if (session.href) {
                console.log(`   🔗 Navigating directly to session: "${session.text}" -> ${session.href}`);
                await page.goto(session.href, { waitUntil: 'networkidle2', timeout: 60000 });
            } else {
                console.log(`   🖱️ Clicking session button (no URL found): "${session.text}"`);
                await page.mouse.click(session.x, session.y);
            }
            
            await new Promise(r => setTimeout(r, 12000)); 

            console.log(`   📜 Slow Scrolling for items...`);
            await page.evaluate(async () => {
                await new Promise((resolve) => {
                    let totalHeight = 0;
                    let distance = 300;
                    let timer = setInterval(() => {
                        let scrollHeight = document.body.scrollHeight;
                        window.scrollBy(0, distance);
                        totalHeight += distance;
                        if (totalHeight >= scrollHeight) {
                            clearInterval(timer);
                            resolve();
                        }
                    }, 200);
                });
            });
            await new Promise(r => setTimeout(r, 5000));

            const sessionData = await page.evaluate(() => {
                const getTxt = (sel) => (document.querySelector(sel)?.innerText || "").trim();
                const dateStr = getTxt('.order-summary-header-date') || getTxt('h1') || "";
                
                const groups = [];
                let currentGroup = null;
                let currentDeliveryTime = "Morning Pickup";
                
                const elements = Array.from(document.querySelectorAll('div, span, p, tr, h4, .order-item, .item-row'));
                
                elements.forEach(el => {
                    const txt = (el.innerText || "").trim();
                    if (!txt) return;

                    const timeMatch = txt.match(/^(\d{1,2}:\d{2}\s*(?:AM|PM))$/i);
                    if (timeMatch) {
                        currentDeliveryTime = timeMatch[1];
                        return;
                    }

                    if (txt.startsWith("Group ")) {
                        if (currentGroup) {
                            groups.push(currentGroup);
                        }
                        
                        const codeMatch = txt.match(/Group ([A-Z0-9]+)/i);
                        const groupCode = codeMatch ? codeMatch[1] : "G";
                        const clientName = txt.replace(/^Group [A-Z0-9]+\s*-\s*/i, '').replace(/\s*\d+\s*items$/, '').trim();
                        
                        let utensilCount = 0;
                        const headerContainer = el.closest('div, tr, section');
                        if (headerContainer) {
                            const icons = Array.from(headerContainer.querySelectorAll('div, span, i')).filter(icon => {
                                const rect = icon.getBoundingClientRect();
                                return rect.width > 0 && rect.height > 0;
                            });
                            const utensilEl = icons.find(icon => {
                                const style = window.getComputedStyle(icon);
                                return (style.backgroundColor.includes('rgb(0, 184, 148)') || style.backgroundColor.includes('rgb(32, 191, 107)')) || 
                                       (icon.innerText && icon.innerText.length < 5 && /^\d+$/.test(icon.innerText.trim()));
                            });
                            if (utensilEl) {
                                const countMatch = utensilEl.parentElement.innerText.match(/(\d+)\s*$/);
                                if (countMatch) utensilCount = parseInt(countMatch[1]);
                            }
                        }

                        currentGroup = { 
                            code: groupCode, 
                            clientName: clientName || "HolyShred HQ",
                            deliveryTime: currentDeliveryTime,
                            utensils: utensilCount,
                            subtotal: 0,
                            dishAggregator: {},
                            sideAggregator: {}
                        };
                        return;
                    }

                    if (currentGroup && (el.tagName === 'TR' || el.classList.contains('item-row') || el.classList.contains('order-item'))) {
                        const cells = Array.from(el.querySelectorAll('td, div.cell, span.cell'));
                        const dishNameEl = el.querySelector('.item-name, .dish-name') || cells[1] || cells[0];
                        const dishName = (dishNameEl?.innerText || "").split('\n')[0].trim();
                        const rawNotes = (dishNameEl?.innerText || "").split('\n').slice(1).join(', ').trim();
                        
                        let price = 0;
                        const priceText = el.innerText.match(/\$\s*(\d+\.\d{2})/);
                        if (priceText) price = parseFloat(priceText[1]);

                        if (dishName && !dishName.toLowerCase().includes('subtotal') && !dishName.toLowerCase().includes('total') && !/^\d+$/.test(dishName)) {
                            currentGroup.subtotal += price;
                            
                            let sides = [];
                            let notes = [];
                            const noteParts = rawNotes.split(/[\|,]/);
                            noteParts.forEach(part => {
                                const p = part.trim();
                                if (!p || p.toLowerCase().includes('for:')) return;
                                if (p.toLowerCase().includes('add side:')) {
                                    const sideName = p.replace(/»?\s*Add Side:\s*/gi, '').trim();
                                    sides.push(sideName);
                                    currentGroup.sideAggregator[sideName] = (currentGroup.sideAggregator[sideName] || 0) + 1;
                                } else {
                                    notes.push(p);
                                }
                            });

                            const sideLabel = sides.length > 0 ? `Added Side: ${sides.join(', ')}` : "";
                            const fullNotes = [sideLabel, ...notes].filter(Boolean).join(' | ');
                            const aggregatorKey = `${dishName}___${fullNotes}`;

                            if (!currentGroup.dishAggregator[aggregatorKey]) {
                                currentGroup.dishAggregator[aggregatorKey] = { name: dishName, count: 0, notes: fullNotes };
                            }
                            currentGroup.dishAggregator[aggregatorKey].count += 1;
                        }
                    }
                });
                
                if (currentGroup) groups.push(currentGroup);

                groups.forEach(g => {
                    const finalItems = [];
                    Object.values(g.dishAggregator).forEach(item => {
                        finalItems.push({ name: item.name, amount: item.count, notes: item.notes });
                    });
                    Object.entries(g.sideAggregator).forEach(([sideName, count]) => {
                        finalItems.push({ name: sideName, amount: count, notes: "Total for order" });
                    });
                    if (g.utensils > 0) {
                        finalItems.push({ name: "Utensils", amount: g.utensils, notes: "Automatic addition from Forkable" });
                    }
                    g.dishes = finalItems;
                    g.orderTotal = g.subtotal;
                    g.netPayout = g.subtotal * 0.75;
                });

                return { dateStr, groups, url: window.location.href };
            });

            if (sessionData.groups.length > 0) {
                const sessionId = sessionData.url.split('/').pop() || Date.now().toString();
                for (const group of sessionData.groups) {
                    const timeClean = group.deliveryTime.replace(/[^a-zA-Z0-9]/g, '');
                    const dbId = `${group.code}-${date}-${timeClean}`;
                    
                    const payload = {
                        id: dbId,
                        platform: "Forkable",
                        customerName: group.clientName,
                        typeOfOrder: "Meal Manager",
                        deliveryDate: date,
                        deliveryTime: group.deliveryTime,
                        pickUpTime: group.deliveryTime,
                        deliveryMethod: "Platform",
                        status: "Finalized",
                        items: group.dishes,
                        subtotal: group.subtotal,
                        orderTotal: group.orderTotal,
                        netPayout: group.netPayout,
                        overallNotes: `Source: ${sessionData.url} | Session: ${sessionId}`
                    };

                    const docRef = doc(db, 'orders', dbId);
                    await setDoc(docRef, payload, { merge: true });
                    console.log(`      ✅ Vaulted ${dbId}: ${group.dishes.length} line items for ${group.clientName}.`);
                }
            }

            console.log(`   🔙 Returning to date list...`);
            // If we used a direct link, we must go back or re-navigate to the date URL
            await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 60000 });
            await new Promise(r => setTimeout(r, 8000));

            if (sIdx < sessionLinks.length - 1) {
                console.log(`   🔄 Re-expanding row for next session...`);
                await page.evaluate((d) => {
                    const dayRegex = new RegExp(d, 'i');
                    const rows = Array.from(document.querySelectorAll('div, span, p, a, button, h1, h2, h3, h4'));
                    const r = rows.find(el => {
                        const txt = (el.innerText || "").trim();
                        return dayRegex.test(txt) && el.getBoundingClientRect().width > 50;
                    });
                    if (r) r.click();
                }, date);
                await new Promise(r => setTimeout(r, 6000));
            }
        }
    } catch (error) {
        console.error(`❌ Error scraping date ${date}:`, error.message);
    }
}

    console.log("🎉 Forkable Ingestion Complete!");
    await browser.close();
    process.exit(0);
})();
