import puppeteer from 'puppeteer';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Firebase Configuration (from cater2me_scraper.js)
const firebaseConfig = {
    apiKey: "AIzaSyDE-Q0S8u4-V3w8X9yZ6Q1K2L3M4N5O6P",
    authDomain: "hscaterhub.firebaseapp.com",
    projectId: "hscaterhub",
    storageBucket: "hscaterhub.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abcdef1234567890"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

(async () => {
    console.log("🚀 Initializing Forkable Scraper (Production)...");

    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    // 1. Inject Authentication Cookies
    console.log("🚀 Injecting cookies...");
    const cookieStr = '_ga=GA1.1.83812787.1777371531; _hp5_event_props.3862836872=%7B%7D; __adroll_fpc=a82147249db68659448dc8351252e87b-1777371534444; hubspotutk=eec630b7bcbe0c4c5dff510b07a4ad46; __hstc=50334390.eec630b7bcbe0c4c5dff510b07a4ad46.1777372577246.1777457546396.1777483855261.4; _cs_c=0; _easyorder_session=977e2e72571f45963c29986aed47e3bb; _hp5_meta.3862836872=%7B%22userId%22%3A%221032165537040382%22%2C%22sessionId%22%3A%221033736246528743%22%2C%22sessionProperties%22%3A%7B%22time%22%3A1777535985606%2C%22id%22%3A%221033736246528743%22%2C%22initial_pageview_info%22%3A%7B%22time%22%3A1777535985606%2C%22id%22%3A%228221059348822095%22%2C%22title%22%3A%22Forkable%22%2C%22url%22%3A%7B%22domain%22%3A%22forkable.com%22%2C%22path%22%3A%22%2Ffpp%2F%22%2C%22query%22%3A%22%22%2C%22hash%22%3A%22%22%7D%7D%2C%22search_keyword%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22utm%22%3A%7B%22source%22%3A%22%22%2C%22medium%22%3A%22%22%2C%22term%22%3A%22%22%2C%22content%22%3A%22%22%2C%22campaign%22%3A%22%22%7D%7D%2C%22identity%22%3A%22359302%22%7D';
    const cookies = cookieStr.split(';').map(pair => {
        const [name, value] = pair.trim().split('=');
        return { name, value, domain: 'forkable.com' };
    });
    await page.setCookie(...cookies);

    // 2. Define target dates (Current Week)
    const dates = [
        "2026-04-27", 
        "2026-04-28", 
        "2026-04-29", 
        "2026-04-30"
    ];

    for (const date of dates) {
        const targetUrl = `https://forkable.com/fpp/2297/${date}/17201`;
        console.log(`📡 Accessing Direct URL: ${targetUrl}`);
        await page.goto(targetUrl, { waitUntil: 'networkidle2' });
        
        await new Promise(r => setTimeout(r, 15000)); 
        await page.waitForFunction(() => {
            const dayRegex = /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), [A-Za-z]+ \d+/i;
            const elements = Array.from(document.querySelectorAll('div, span, p'));
            return elements.some(el => {
                const txt = (el.innerText || "").trim();
                const rect = el.getBoundingClientRect();
                return dayRegex.test(txt) && rect.width > 0 && rect.height > 0 && txt.length < 100;
            });
        }, { timeout: 30000 });

        const rowTargets = await page.evaluate(() => {
            const dayRegex = /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), [A-Za-z]+ \d+/i;
            const rows = Array.from(document.querySelectorAll('div, span, p, a, button')).filter(el => {
                const txt = (el.innerText || "").trim();
                const rect = el.getBoundingClientRect();
                return dayRegex.test(txt) && rect.width > 200 && rect.height > 20 && txt.length < 100;
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

        const sessionButton = await page.evaluate(() => {
            const elements = Array.from(document.querySelectorAll('a, button, div, span, .btn'));
            const btn = elements.find(el => {
                const txt = (el.innerText || "").toLowerCase().trim();
                const rect = el.getBoundingClientRect();
                const isVisible = rect.width > 0 && rect.height > 0;
                return isVisible && txt.length < 30 && (txt.includes('view order') || txt.includes('view completed order'));
            });
            if (!btn) return null;
            const rect = btn.getBoundingClientRect();
            return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2, text: btn.innerText.trim() };
        });

        if (!sessionButton) {
            console.log(`   ⚠️ No session button found for ${date}.`);
            continue;
        }

        console.log(`   🖱️ Clicking "${sessionButton.text}"...`);
        await page.mouse.click(sessionButton.x, sessionButton.y);
        await new Promise(r => setTimeout(r, 15000)); 

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
                    
                    currentGroup = { 
                        code: groupCode, 
                        clientName: clientName || "HolyShred HQ",
                        deliveryTime: currentDeliveryTime,
                        dishAggregator: {},
                        sideAggregator: {}
                    };
                    return;
                }

                if (currentGroup && el.tagName === 'TR') {
                    const cells = Array.from(el.querySelectorAll('td'));
                    if (cells.length >= 2) {
                        const dishName = cells[1].innerText.split('\n')[0].trim();
                        const rawNotes = cells[1].innerText.split('\n').slice(1).join(', ').trim();
                        
                        if (dishName && !dishName.toLowerCase().includes('subtotal')) {
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
                }
            });
            
            if (currentGroup) {
                groups.push(currentGroup);
            }

            groups.forEach(g => {
                const finalItems = [];
                Object.values(g.dishAggregator).forEach(item => {
                    finalItems.push({ name: item.name, amount: item.count, notes: item.notes });
                });
                Object.entries(g.sideAggregator).forEach(([sideName, count]) => {
                    finalItems.push({ name: sideName, amount: count, notes: "Total for order" });
                });
                g.dishes = finalItems;
            });

            return { dateStr, groups, url: window.location.href };
        });

        if (sessionData.groups.length > 0) {
            const sessionId = sessionData.url.split('/').pop() || Date.now().toString();
            for (const group of sessionData.groups) {
                const dbId = `FORK-${date}-${group.code}`;
                const payload = {
                    id: dbId,
                    platform: "Forkable",
                    customerName: group.clientName,
                    typeOfOrder: "Meal Manager",
                    deliveryDate: date,
                    deliveryTime: group.deliveryTime,
                    deliveryMethod: "Pickup",
                    status: "Finalized",
                    items: group.dishes,
                    overallNotes: `Source: ${sessionData.url} | Session: ${sessionId}`
                };

                const docRef = doc(db, 'orders', dbId);
                await setDoc(docRef, payload, { merge: true });
                console.log(`      ✅ Vaulted ${dbId}: ${group.dishes.length} line items for ${group.clientName}.`);
            }
        }
    }

    console.log("🎉 Forkable Ingestion Complete!");
    await browser.close();
    process.exit(0);
})();
