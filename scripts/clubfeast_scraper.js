import puppeteer from 'puppeteer';
import fs from 'fs';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDocs, getDoc } from "firebase/firestore";
import * as dotenv from 'dotenv';
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
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: null
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
        await browser.close();
        return;
    }
  
    console.log("\n🔍 Logging in successful! Preparing deep-link Order Extraction...");
  
    let orderLinks = new Map();
  
    await new Promise(r => setTimeout(r, 5000));
    
    let currentLinks = await page.evaluate(() => {
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
    currentLinks.forEach(l => orderLinks.set(l, 'New'));
    console.log(`✅ Found ${currentLinks.length} active 'New' order routes.`);
  
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
    console.log(`✅ Found ${finalizedLinks.length} active 'Finalized' order routes.`);
  
    let finalLinks = Array.from(orderLinks.keys());
    console.log(`\n🎯 Scrape Mission initialized! Scraping ${finalLinks.length} independent Order Pages...`);
  
    let menuItemsMap = [];
    try {
        const menuDocs = await getDocs(collection(db, 'menus'));
        menuItemsMap = menuDocs.docs.map(d => d.data());
        menuItemsMap.sort((a,b) => b.title.length - a.title.length);
    } catch(e) {}
  
    for (let i = 0; i < finalLinks.length; i++) {
        let route = finalLinks[i];
        console.log(`[${i+1}/${finalLinks.length}] Navigating into ${route}...`);
        await page.goto(route, { waitUntil: 'networkidle2' });
        
        try {
            await page.waitForFunction(() => document.body.innerText.includes('Order Total') || document.body.innerText.includes('Subtotal'), { timeout: 9000 });
        } catch (e) {}
        await new Promise(r => setTimeout(r, 4000));
        
        const orderDataRaw = await page.evaluate(() => {
            function collectText(root) {
              let text = '';
              if (root.innerText) text += root.innerText;
              root.querySelectorAll('*').forEach(el => {
                if (el.shadowRoot) text += '\n' + collectText(el.shadowRoot);
              });
              return text;
            }
            let textObject = collectText(document.body) || "";
            
            const idMatch = textObject.match(/(#[A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+)/) || textObject.match(/([A-Z0-9]{3}-L\d{6}-[A-Z0-9]{4})/);
            let urlId = null;
            try { urlId = window.location.href.split('/orders/')[1].split('?')[0]; } catch(e){}
            let orderId = idMatch ? idMatch[1].replace('#', '') : (urlId ? urlId.replace('#', '') : null);
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
            const dateMatch = textObject.match(/[A-Z][a-z]+day,\s[A-Z][a-z]+\s\d{1,2}(st|nd|rd|th)?,\s20\d{2}/) || textObject.match(/\d{1,2}\/\d{1,2}\/\d{4}/);
            if (dateMatch) {
                try {
                    const dObj = new Date(dateMatch[0].replace(/(st|nd|rd|th)/, ''));
                    if (!isNaN(dObj.getTime())) {
                         formattedDate = `${dObj.getFullYear()}-${String(dObj.getMonth() + 1).padStart(2, '0')}-${String(dObj.getDate()).padStart(2, '0')}`;
                    }
                } catch(e) {}
            }
            if (!formattedDate) {
                let urlDateMatch = window.location.href.match(/date=(\d{4}-\d{2}-\d{2})/);
                if (urlDateMatch) formattedDate = urlDateMatch[1];
                else formattedDate = new Date().toISOString().split('T')[0];
            }
  
            const items = [];
            const lines = textObject.split('\n').map(l => l.trim()).filter(l => l);
            for (let line of lines) {
                if (line.match(/Subtotal:|Tax Amount|Order Total|Download Labels/i)) break;
                const qtyMatch = line.match(/^(\d+)\s*x\s*(.*)$/);
                if (qtyMatch) {
                    let cleanName = qtyMatch[2].replace(/\s*\(\d+\s*pieces?\)/i, '').trim();
                    cleanName = cleanName.replace(/\bw\//gi, 'With ').replace(/\s*\(GF\)/gi, '').replace(/\s+/g, ' ').trim();
                    items.push({ amount: parseInt(qtyMatch[1], 10), name: cleanName, notes: "" });
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
        });
  
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
                finalItems.push({ name: cleanMainName, amount: item.amount, notes: "" });
            }
  
            let [y, m, d] = orderDataRaw.deliveryDate.split('-');
            let cleanDate = new Date(y, m - 1, d);
            let sfDateStr = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles", year: 'numeric', month: 'numeric', day: 'numeric' });
            let sfTodayMidnight = new Date(sfDateStr);
            let currentStatus = cleanDate < sfTodayMidnight ? "Completed" : "New";

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
        } else {
            console.log("   └─ Failed to isolate order frame. Skipping.");
        }
    }
  
    console.log("\n🎯 ClubFeast Scrape Mission Accomplished!");
    await browser.close();
    process.exit(0);
})();
