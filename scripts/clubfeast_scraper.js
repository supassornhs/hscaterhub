import puppeteer from 'puppeteer';
import fs from 'fs';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDocs, getDoc } from "firebase/firestore";
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

const AUTH_FILE = './clubfeast_auth.json';

(async () => {
    console.log("🚀 Launching Chrome to scrape ClubFeast...");
    const browser = await puppeteer.launch({ 
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080'],
      defaultViewport: { width: 1920, height: 1080 }
    }); 
    const page = await browser.newPage();
  
    let authenticated = false;

    // Fetch Auth from Firebase Dashboard UI Configuration
    const crawlerDoc = await getDoc(doc(db, 'system', 'crawlers'));
    const CLUBFEAST_AUTH = crawlerDoc.exists() ? crawlerDoc.data()['ClubFeast']?.cookie : null;

    if (CLUBFEAST_AUTH && CLUBFEAST_AUTH.startsWith("Bearer ")) {
        await page.setExtraHTTPHeaders({
            'Authorization': CLUBFEAST_AUTH
        });
        console.log("🔑 Authenticating natively via Bearer Authorization Header!");
        authenticated = true;
    } else if (fs.existsSync(AUTH_FILE)) {
        const cookies = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf8'));
        await page.setCookie(...cookies);
        console.log("🍪 Loaded saved session cookies!");
        authenticated = true;
    } 
    
    if (!authenticated) {
        console.log("❌ Missing authentication variables! Cannot authenticate.");
        await browser.close();
        process.exit();
    }
  
    console.log("Navigating to ClubFeast...");
    await page.goto('https://restaurant.clubfeast.com/?tab=open', { waitUntil: 'networkidle2' });
    
    await new Promise(r => setTimeout(r, 6000));
  
    const getAllText = async () => {
      return await page.evaluate(() => {
        function collectText(root) {
          let text = '';
          if (root.innerText) text += root.innerText;
          root.querySelectorAll('*').forEach(el => {
            if (el.shadowRoot) text += ' ' + collectText(el.shadowRoot);
          });
          return text;
        }
        return collectText(document.body);
      });
    };
  
    let bodyText = await getAllText();
  
    if (bodyText.includes('Sign in') || bodyText.includes('Verification Code')) {
        console.log("\n❌ FATAL ERROR: The Cookie is missing or expired.");
        await setDoc(doc(db, 'system', 'crawlers'), { 'ClubFeast': { status: 'Expired', lastRun: new Date().toLocaleString() } }, { merge: true });
        await sendAlertEmail(db, 'ClubFeast');
        await browser.close();
        process.exit(1);
    }
  
    console.log("\n🔍 Logging in successful! Detecting locations...");
    
    // Debug Screenshot
    if (!fs.existsSync('./scratch')) fs.mkdirSync('./scratch');
    await page.screenshot({ path: './scratch/clubfeast_before_click.png' });

    // 1. Force the dropdown to open and detect locations
    const findLocations = async () => {
        return await page.evaluate(() => {
            const patterns = ['Geary St', 'Tennessee St'];
            const allElements = Array.from(document.querySelectorAll('div, p, span, li, a, header *'));
            const matches = allElements.filter(el => patterns.some(p => el.innerText?.includes(p)));
            
            return [...new Set(matches.map(el => {
                const lines = el.innerText.split('\n').map(l => l.trim()).filter(l => l);
                return lines.find(line => patterns.some(p => line.includes(p))) || lines[0];
            }))].filter(t => t && t.length > 5);
        });
    };

    let locations = await findLocations();
    
    // Set a more standard viewport to ensure consistent layout
    await page.setViewport({ width: 1280, height: 800 });

    if (locations.length <= 1) {
        console.log("📍 Only 1 location seen. Attempting to open menu via keyboard (Focus + Enter)...");
        
        await page.evaluate(() => {
            const header = document.querySelector('div.z-\\[100\\].btn.btn-lg.border.shadow[role="button"]') || 
                           document.querySelector('[role="button"]');
            if (header) {
                header.focus();
            }
        });
        await page.keyboard.press('Enter');
        
        await new Promise(r => setTimeout(r, 6000));
        await page.screenshot({ path: './scratch/clubfeast_after_click.png' });
        locations = await findLocations();
    }

    if (locations.length === 0) {
        console.log("⚠️ No locations detected. Defaulting to 'Current Kitchen'.");
        locations = ["Current Kitchen"];
    } else {
        console.log(`📍 Detected ${locations.length} kitchen locations: ${locations.join(', ')}`);
    }

    let orderLinks = new Map();

    for (let locIdx = 0; locIdx < locations.length; locIdx++) {
        const locName = locations[locIdx];
        
        if (locations.length > 1 && locName !== "Current Kitchen") {
            console.log(`\n🏢 Switching to kitchen: ${locName}...`);
            
            // Ensure menu is open
            await page.evaluate((name) => {
                const isOpen = Array.from(document.querySelectorAll('button.flex.flex-col')).some(el => el.innerText?.includes('St'));
                if (!isOpen) {
                    const header = document.querySelector('div.z-\\[100\\].btn.btn-lg.border.shadow[role="button"]');
                    if (header) header.focus();
                }
            }, locName);
            await page.keyboard.press('Enter');
            
            await new Promise(r => setTimeout(r, 3000));

            const switched = await page.evaluate((name) => {
                const items = Array.from(document.querySelectorAll('button.flex.flex-col.gap-0.border-transparent.font-normal'));
                const target = items.find(el => el.innerText && el.innerText.includes(name));
                
                if (target) {
                    target.focus();
                    return true;
                }
                return false;
            }, locName);

            if (switched) {
                await page.keyboard.press('Enter');
                console.log(`   └─ Switch command sent via Keyboard. Waiting for dashboard to refresh...`);
                await new Promise(r => setTimeout(r, 15000));
            }
        }


        // --- SCRAPE OPEN ORDERS ---
        console.log(`   └─ Scraping 'Open' orders...`);
        await page.evaluate(() => {
            let clicked = false;
            function searchTabs(root) {
                root.querySelectorAll('span, div, button, a, li, p').forEach(el => {
                    if (!clicked && el.innerText && el.innerText.trim() === 'Open') {
                        el.click();
                        clicked = true;
                    }
                });
                root.querySelectorAll('*').forEach(el => {
                    if (el.shadowRoot) searchTabs(el.shadowRoot);
                });
            }
            searchTabs(document);
        });
        await new Promise(r => setTimeout(r, 5000));

        let openLinks = await page.evaluate(() => {
           let links = [];
           function collectLinks(root) {
             root.querySelectorAll('a').forEach(a => {
               if (a.href && (a.href.includes('/orders/') || a.href.includes('/packages/'))) {
                  links.push(a.href);
               }
             });
             root.querySelectorAll('*').forEach(el => {
               if (el.shadowRoot) collectLinks(el.shadowRoot);
             });
           }
           collectLinks(document);
           return links;
        });
        openLinks.forEach(l => orderLinks.set(l, 'New'));
        console.log(`   └─ Found ${openLinks.length} 'Open' order routes.`);

        // --- SCRAPE FINALIZED ORDERS ---
        console.log(`   └─ Scraping 'Finalized' orders...`);
        await page.evaluate(() => {
           let clicked = false;
           function searchTabs(root) {
              root.querySelectorAll('span, div, button, a, li, p').forEach(el => {
                 if (!clicked && el.innerText && el.innerText.trim() === 'Finalized') {
                    el.click();
                    clicked = true;
                 }
              });
              root.querySelectorAll('*').forEach(el => {
                 if (el.shadowRoot) searchTabs(el.shadowRoot);
              });
           }
           searchTabs(document);
        });
        
        await new Promise(r => setTimeout(r, 6000));
        
        let finalizedLinks = await page.evaluate(() => {
           let links = [];
           function collectLinks(root) {
             root.querySelectorAll('a').forEach(a => {
               if (a.href && (a.href.includes('/orders/') || a.href.includes('/packages/'))) {
                  links.push(a.href);
               }
             });
             root.querySelectorAll('*').forEach(el => {
               if (el.shadowRoot) collectLinks(el.shadowRoot);
             });
           }
           collectLinks(document);
           return links;
        });
        finalizedLinks.forEach(l => orderLinks.set(l, 'Completed'));
        console.log(`   └─ Found ${finalizedLinks.length} 'Finalized' order routes.`);
    }

    let initialLinks = Array.from(orderLinks.keys());
    let idMap = {};
    let finalLinks = [];

    for (let link of initialLinks) {
        let idPart = link.includes('/orders/') ? link.split('/orders/')[1] : null;
        if (!idPart && link.includes('/packages/')) idPart = link.split('/packages/')[1];
        
        if (idPart) {
           let id = idPart.split('?')[0].replace('#', '');
           if (!idMap[id]) idMap[id] = [];
           idMap[id].push(link);
        } else {
           finalLinks.push(link);
        }
    }

    for (let id in idMap) {
        let links = idMap[id];
        if (links.length > 1) {
             let validLinks = links.filter(l => !l.includes("canceled=true") && !l.includes("cancelled=true"));
             if (validLinks.length > 0) {
                 finalLinks.push(validLinks[0]); 
             } else {
                 finalLinks.push(links[0]); 
             }
        } else {
             finalLinks.push(links[0]);
        }
    }

    console.log(`\n🎯 Scrape Mission initialized! Scraping ${finalLinks.length} independent Order Pages (down from ${initialLinks.length} due to deduplication)...`);
  
    let menuItemsMap = [];
    try {
        const menuDocs = await getDocs(collection(db, 'menus'));
        menuItemsMap = menuDocs.docs.map(d => d.data());
        menuItemsMap.sort((a,b) => b.title.length - a.title.length);
    } catch(e) {}
  
    let syncedOrders = 0;
    for (let i = 0; i < finalLinks.length; i++) {
        let route = finalLinks[i];
        console.log(`[${i+1}/${finalLinks.length}] Navigating into ${route}...`);
        await page.goto(route, { waitUntil: 'networkidle2' });
        
        try {
            await page.waitForFunction(() => document.body.innerText.includes('Order Total') || document.body.innerText.includes('Subtotal'), { timeout: 9000 });
        } catch (e) {}
        await new Promise(r => setTimeout(r, 4000));
        
        const routeId = route.split('/orders/')[1].split('?')[0];
        const orderDataRaw = await page.evaluate((forcedId) => {
            function collectText(root) {
              let text = '';
              if (root.innerText) text += root.innerText;
              root.querySelectorAll('*').forEach(el => {
                if (el.shadowRoot) text += '\n' + collectText(el.shadowRoot);
              });
              return text;
            }
            let textObject = (collectText(document.body) || "").replace(/Customer Request:/g, '\nCustomer Request:');
            
            // Prioritize the ID passed from the Node.js context (from the URL)
            let orderId = forcedId.replace('#', '');
            if (!orderId) return null;
  
            function collectElements(root) {
              let els = Array.from(root.querySelectorAll('div, span, p'));
              root.querySelectorAll('*').forEach(el => {
                if (el.shadowRoot) els = els.concat(collectElements(el.shadowRoot));
              });
              return els;
            }
            let elements = collectElements(document);
            let customerName = "ClubFeast User";
            for (let el of elements) {
                if (el.innerText && el.innerText.includes('Order:') && el.innerText.includes(orderId)) {
                    let maybeName = el.parentElement?.innerText.split('\n')[0] || "";
                    if (maybeName && !maybeName.includes('#') && !maybeName.includes('Club')) customerName = maybeName;
                    break;
                }
            }
  
            const timeMatch = textObject.match(/(?:Pick up|Estimated).*?at (\d{1,2}:\d{2}\s*(?:AM|PM)?)/i);
            const pickUpTime = timeMatch ? timeMatch[1] : "12:00 PM";
  
            let orderSubtotal = 0, tax = 0, orderTotal = 0;
            let docPrices = Array.from(textObject.matchAll(/\$(\d+\.\d{2})/g)).map(m => Number(m[1]));
            if (docPrices.length >= 3 && textObject.match(/Order Total|Total:/i)) {
                orderTotal = docPrices[docPrices.length - 1] || 0;
                orderSubtotal = docPrices[docPrices.length - 3] || 0;
            } else if (docPrices.length > 0 && textObject.match(/Order Total|Total:/i)) {
                orderTotal = docPrices[docPrices.length - 1] || 0;
            }
  
            let formattedDate = null;
            // Try to match full weekday format e.g., "Thursday, July 5th, 2026"
            const fullDateMatch = textObject.match(/[A-Z][a-z]+day,\s[A-Z][a-z]+\s\d{1,2}(st|nd|rd|th)?,\s20\d{2}/);
            // Match simple month day, year format e.g., "May 5, 2026"
            const simpleDateMatch = textObject.match(/[A-Z][a-z]+\s\d{1,2},\s20\d{2}/);
            // Match numeric format MM/DD/YYYY
            const numericDateMatch = textObject.match(/\d{1,2}\/\d{1,2}\/\d{4}/);
            const dateMatch = fullDateMatch || simpleDateMatch || numericDateMatch;
            if (dateMatch) {
                try {
                    // Remove ordinal suffixes if present
                    const cleanStr = dateMatch[0].replace(/(st|nd|rd|th)/, '');
                    const dObj = new Date(cleanStr);
                    if (!isNaN(dObj.getTime())) {
                        formattedDate = `${dObj.getFullYear()}-${String(dObj.getMonth() + 1).padStart(2, '0')}-${String(dObj.getDate()).padStart(2, '0')}`;
                    }
                } catch (e) {}
            }
            if (!formattedDate) {
                // Fallback to URL param or orderId-derived date
                let urlDateMatch = window.location.href.match(/date=(\d{4}-\d{2}-\d{2})/);
                if (urlDateMatch) {
                    formattedDate = urlDateMatch[1];
                } else if (orderId && orderId.includes('-L')) {
                    const datePart = orderId.split('-L')[1].substring(0, 6);
                    if (datePart.length === 6 && !isNaN(datePart)) {
                        formattedDate = `20${datePart.substring(0,2)}-${datePart.substring(2,4)}-${datePart.substring(4,6)}`;
                    } else {
                        formattedDate = new Date().toISOString().split('T')[0];
                    }
                } else {
                    formattedDate = new Date().toISOString().split('T')[0];
                }
            }
  
            const items = [];
            const lines = textObject.split('\n').map(l => l.trim()).filter(l => l);
            for (let i = 0; i < lines.length; i++) {
                let line = lines[i];
                if (line.match(/Subtotal:|Tax Amount|Order Total|Download Labels/i)) break;
                
                const qtyMatch = line.match(/^(\d+)\s*x\s*(.*)$/);
                if (qtyMatch) {
                    let cleanName = qtyMatch[2].replace(/\s*\(\d+\s*pieces?\)/i, '').trim();
                    cleanName = cleanName.replace(/\bw\//gi, 'With ').replace(/\s*\(GF\)/gi, '').replace(/\s+/g, ' ').trim();
                    items.push({ amount: parseInt(qtyMatch[1], 10), name: cleanName, notes: "" });
                } else if (line.includes('Customer Request:') && items.length > 0) {
                    let note = line.replace('Customer Request:', '').trim();
                    items[items.length - 1].notes = note;
                }
            }
  
            return {
               id: orderId,
               customerName: customerName,
               deliveryDate: formattedDate,
               deliveryTime: pickUpTime,
               subtotal: orderSubtotal || orderTotal,
               total: orderTotal,
               items: items
            };
        }, routeId);
  
        if (orderDataRaw) {
            let finalItems = [];
            for (let item of orderDataRaw.items) {
                let cleanMainName = item.name;
                for (const m of menuItemsMap) {
                    let match = item.name.toLowerCase().includes(m.title.toLowerCase());
                    if (!match && m.platformOverrides && m.platformOverrides['ClubFeast'] && m.platformOverrides['ClubFeast'].alias) {
                        match = item.name.toLowerCase().includes(m.platformOverrides['ClubFeast'].alias.toLowerCase());
                    }
                    if (!match && m.aliases) {
                        match = m.aliases.some(a => item.name.toLowerCase().includes(a.toLowerCase()));
                    }
                    if (match) {
                        cleanMainName = m.title;
                        break;
                    }
                }
                finalItems.push({ name: cleanMainName, amount: item.amount, notes: item.notes });
            }
  
            let [y, m, d] = orderDataRaw.deliveryDate.split('-');
            let cleanDate = new Date(y, m - 1, d);
            let sfDateStr = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles", year: 'numeric', month: 'numeric', day: 'numeric' });
            let sfTodayMidnight = new Date(sfDateStr);
            let currentStatus = cleanDate < sfTodayMidnight ? "Completed" : "New";

            if (route.includes("canceled=true") || route.includes("cancelled=true")) {
                currentStatus = "Cancelled";
            }

            let newOrder = {
                id: orderDataRaw.id,
                platform: "ClubFeast",
                customerName: orderDataRaw.customerName,
                typeOfOrder: "Catering",
                deliveryDate: orderDataRaw.deliveryDate,
                deliveryTime: orderDataRaw.deliveryTime,
                deliveryMethod: "Platform",
                pickUpTime: orderDataRaw.deliveryTime,
                subtotal: orderDataRaw.subtotal,
                total: orderDataRaw.total,
                netPayout: orderDataRaw.subtotal,
                status: currentStatus,
                overallNotes: "Automatically scraped via Puppeteer.",
                items: finalItems,
                createdAt: new Date().toISOString()
            };
  
            const docRef = doc(db, 'orders', newOrder.id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists() && (docSnap.data().manualOverride || docSnap.data().isDeleted)) {
                console.log(`[ClubFeast] Skipped (Manual Override): ${newOrder.id}`);
                continue;
            }
            await setDoc(docRef, newOrder, { merge: true });
            console.log(`   └─ Successfully saved ${newOrder.id} with status ${newOrder.status}`);
            syncedOrders++;
        } else {
            console.log("   └─ Failed to isolate order frame. Skipping.");
        }
    }
    
    await setDoc(doc(db, 'system', 'crawlers'), { 'ClubFeast': { status: 'Active', lastRun: new Date().toLocaleString() } }, { merge: true });

    console.log(`\n🎉 Successfully Synced ${syncedOrders} ClubFeast orders to the Hub!`);
    await browser.close();
    process.exit(0);
})();
