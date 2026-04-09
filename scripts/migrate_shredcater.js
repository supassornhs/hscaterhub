import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDocs, collection } from "firebase/firestore";
import fs from 'fs';
import path from 'path';

const firebaseConfig = {
    apiKey: "AIzaSyCj__TCfYSF-1y4uR-UOId_aPWWwy4-W5A",
    projectId: "hscaterhub"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
    console.log("Loading Menu Items...");
    const menuDocs = await getDocs(collection(db, 'menus'));
    const menuItemsMap = menuDocs.docs.map(d => d.data());
    menuItemsMap.sort((a,b) => b.title.length - a.title.length);

    const shredPath = 'C:/Users/User/Desktop/shredcater';
    
    let allOrders = [];
    
    // Read orders_04_06.json
    try {
        let dump1 = JSON.parse(fs.readFileSync(path.join(shredPath, 'orders_04_06.json'), 'utf8'));
        if(Array.isArray(dump1)) {
            allOrders = allOrders.concat(dump1);
        }
    } catch(e) {}
    
    // Read check_out.json
    try {
        let dump2 = JSON.parse(fs.readFileSync(path.join(shredPath, 'check_out.json'), 'utf8'));
        if(!Array.isArray(dump2) && dump2.Order_ID) {
            allOrders.push(dump2);
        }
    } catch(e) {}

    console.log(`Found ${allOrders.length} raw historical orders in local shredcater backups!`);

    for(let o of allOrders) {
        if(!o.platforms) o.platforms = "Manual Entry";
        if(!o.Item) o.Item = [];
        
        let finalItems = [];
        for(let item of o.Item) {
            let rawName = item.Item_Name.replace(/»/g, '').replace(/Add Side:/i, '').trim();
            // clean Cater2Me weird sizes if they existed
            let cleanName = rawName.replace(/\(\d*\s*Serv\.\)/i, '').replace(/\(\d*$/i, '');
            cleanName = cleanName.replace(/\*\*\*[\s\S]*?\*\*\*/g, '').replace(/served FAMILY STYLE/i, '').replace(/Contains:[\s\S]*?(?=Description:|$)/i, '').replace(/Description:[\s\S]*?(?=Item \d+ of \d+|$)/i, '').replace(/Item \d+ of \d+/i, '');
            cleanName = cleanName.replace(/\(NA\)/i, '').replace(/\(Half Tray\)/i, 'Tray').replace(/\s{2,}/g, ' ').trim();

            let matchedName = cleanName;
            
            for (const mObj of menuItemsMap) {
                let match = cleanName.toLowerCase().includes(mObj.title.toLowerCase());
                if (!match && mObj.platformOverrides && mObj.platformOverrides[o.platforms] && mObj.platformOverrides[o.platforms].alias) {
                    let pAlias = mObj.platformOverrides[o.platforms].alias.toLowerCase();
                    if (pAlias.length > 3 && cleanName.toLowerCase().includes(pAlias)) match = true;
                }
                if (!match && mObj.aliases) {
                    match = mObj.aliases.some(a => a.length > 3 && cleanName.toLowerCase().includes(a.toLowerCase()));
                }
                if (match) {
                    matchedName = mObj.title;
                    break;
                }
            }
            
            finalItems.push({
                name: matchedName,
                amount: item.Item_Amount || 1,
                notes: rawName !== matchedName ? rawName : ""
            });
        }
        
        let pDate = o.PickUp_Date || new Date().toISOString().split('T')[0];
        let pTime = o.PickUp_Time || o.Deliver_Time || "12:00 PM";
        pTime = pTime.replace(/\n/g, '').trim();
        
        let orderPayload = {
            id: o.Order_ID || o.id,
            platform: o.platforms,
            customerName: o.Customer_Name || "Imported Customer",
            typeOfOrder: o.Order_Type || "Catering",
            deliveryDate: pDate,
            deliveryTime: pTime,
            deliveryMethod: o.Deliver_Partner || "Third-Party",
            subtotal: o.Order_Subtotal || o.Order_Total || 0,
            total: o.Order_Total || 0,
            netPayout: o.Order_Net || o.Order_Total || 0,
            overallNotes: o.Order_Notes || o.Deliver_Instruction || "Migrated from shredcater JSON backup.",
            status: o.status || "Completed",
            items: finalItems
        };
        
        console.log(`Syncing ${orderPayload.id}...`);
        await setDoc(doc(db, 'orders', orderPayload.id), orderPayload, { merge: true });
    }

    console.log("Migration complete!");
    process.exit(0);
}

run();
