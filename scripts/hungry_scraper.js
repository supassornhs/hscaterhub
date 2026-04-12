
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
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
    console.log("🚀 Launching Hungry API Scraper Engine...");
    
    // 1. Fetch cookie securely from Firebase dashboard
    const crawlerDoc = await getDoc(doc(db, 'system', 'crawlers'));
    const HUNGRY_COOKIE = crawlerDoc.exists() ? crawlerDoc.data()['Hungry']?.cookie : process.env.HUNGRY_COOKIE;

    if (!HUNGRY_COOKIE) {
        console.error("❌ Hungry Cookie (Bearer token) is missing from the Dashboard Configuration!");
        process.exit(1);
    }

    try {
        console.log("📡 Accessing Hungry Dashboard Payload...");
        
        // Use a generous window
        let startStr = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year: 'numeric'});
        let endStr = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year: 'numeric'});
        
        const res = await fetch(`https://api.tryhungry.com/chef-dashboard?start=${startStr}&end=${endStr}`, {
            headers: {
                "Authorization": HUNGRY_COOKIE,
                "Accept": "application/json"
            }
        });
        
        if (res.status === 401 || res.status === 403) {
            console.error("❌ Authentication rejected! Hungry token expired.");
            await setDoc(doc(db, 'system', 'crawlers'), { 'Hungry': { status: 'Expired', lastRun: new Date().toLocaleString() } }, { merge: true });
            await sendAlertEmail(db, 'Hungry');
            process.exit(1);
        }

        let rawText = await res.text();
        let orders = [];
        try {
            orders = JSON.parse(rawText);
        } catch(e) {
            console.error("❌ Failed to parse JSON! Raw response was: ", rawText.substring(0, 300));
            process.exit(1);
        }
        
        console.log(`\n📦 Hungry Scraper extracted ${orders.length} orders!`);
        
        let synced = 0;
        for (let order of orders) {
            let pickUpRaw = order.pickupTimes && order.pickupTimes.length > 0 ? order.pickupTimes[0] : order.date;
            
            // Reformat YYYY-MM-DD reliably without shifting native timezone
            let datePartStr = pickUpRaw.split('T')[0];
            let [year, month, day] = datePartStr.split('-');
            
            let orderIdParsed = `HNG-${String(order.orderNumber || "").replace(/[^0-9]/g, '')}`;

            if (order.status === "Cancelled" || order.deleted) {
                const deadOrderRef = doc(db, 'orders', orderIdParsed);
                await deleteDoc(deadOrderRef);
                console.log(`🗑️ Purged Cancelled Order ${orderIdParsed} from Firebase!`);
                continue;
            }

            let timePartStr = pickUpRaw.includes('T') ? pickUpRaw.split('T')[1].split('-')[0].split('+')[0] : "10:00:00"; 
            
            let formattedDate = `${year}-${month}-${day}`;
            
            let rawHours = parseInt(timePartStr.split(':')[0], 10);
            let rawMinutes = timePartStr.split(':')[1] || "00";
            let ampm = rawHours >= 12 ? 'PM' : 'AM';
            let formattedHours = rawHours % 12;
            formattedHours = formattedHours ? formattedHours : 12;
            let pickUpTimeStr = `${formattedHours}:${rawMinutes} ${ampm}`;

            let itemsList = [];
            let validItems = order.items ? order.items.filter(i => i.quantity > 0) : [];
            validItems.forEach(i => {
                let cleanName = i.item || "Unknown Dish";
                cleanName = cleanName.replace(/\bw\//gi, 'With ');
                cleanName = cleanName.replace(/\s*\(GF\)/gi, '');
                cleanName = cleanName.replace(/\s+/g, ' ').trim();
                cleanName = cleanName.replace(/\bwith\b/gi, 'With');

                itemsList.push({
                    name: cleanName,
                    amount: parseInt(i.quantity) || 1,
                    notes: ""
                });
            });

            if (itemsList.length === 0) {
               itemsList.push({ name: "Menu TBD - Unfinalized", amount: 1, notes: "" });
            }

            let mappedType = String(order.mealType || "").toLowerCase().includes('group') ? "Meal Manager" : "Catering";
            
            let orderDateObj = new Date(year, month - 1, day);
            let calculatedStatus = orderDateObj < new Date(new Date().setHours(0,0,0,0)) ? "Completed" : "New";

            let newOrder = {
                id: orderIdParsed.replace("HNG-", ""),
                platform: "Hungry",
                customerName: order.contact?.name || order.clientName || orderIdParsed, 
                typeOfOrder: mappedType,
                deliveryDate: formattedDate,
                deliveryTime: pickUpTimeStr,
                deliveryMethod: "Platform",
                pickUpTime: pickUpTimeStr,
                subtotal: parseFloat(order.dailyGrossVolume || order.grossPayout || 0),
                total: parseFloat(order.dailyGrossVolume || order.grossPayout || 0),
                netPayout: parseFloat(order.totalPayout || 0),
                status: calculatedStatus,
                overallNotes: order.instructions || order.dietaryPreferences || "No instructions provided.",
                items: itemsList,
                createdAt: new Date().toISOString()
            };

            const docRef = doc(db, 'orders', orderIdParsed);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists() && (docSnap.data().manualOverride || docSnap.data().isDeleted)) {
                console.log(`   ⏭️ Skipped (Manual Override): ${orderIdParsed}`);
                continue;
            }
            await setDoc(docRef, newOrder, { merge: true });
            console.log(`   ✅ Synced Hungry Order ${orderIdParsed} (${formattedDate}) -> [${calculatedStatus}]`);
            synced++;
        }

        await setDoc(doc(db, 'system', 'crawlers'), { 'Hungry': { status: 'Active', lastRun: new Date().toLocaleString() } }, { merge: true });

        console.log(`\n🎉 Processed ${synced} Hungry orders. System Shutdown.`);
        process.exit(0);

    } catch(e) {
        console.error("❌ Critical Failure: ", e);
        process.exit(1);
    }
})();
