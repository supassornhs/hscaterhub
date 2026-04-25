import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDocs, getDoc } from "firebase/firestore";
import * as XLSX from 'xlsx';
import * as cheerio from 'cheerio';

const firebaseConfig = {
  apiKey: "AIzaSyCj__TCfYSF-1y4uR-UOId_aPWWwy4-W5A",
  authDomain: "hscaterhub.firebaseapp.com",
  projectId: "hscaterhub"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Copy of the actual scraping logic
async function processForkableEmail(text, htmlStr = "", attachments = [], emailDate = null) {
    console.log("-> Simulation: Parsing Forkable payload...");
    let cleanDate = emailDate ? new Date(emailDate) : new Date();
    const year = cleanDate.getFullYear();
    const month = (cleanDate.getMonth() + 1).toString().padStart(2, '0');
    const day = cleanDate.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    
    let sfDateStr = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles", year: 'numeric', month: 'numeric', day: 'numeric' });
    let sfTodayMidnight = new Date(sfDateStr);
    let currentStatus = cleanDate < sfTodayMidnight ? "Completed" : "New";

    let menuItemsMap = [];
    const menuDocs = await getDocs(collection(db, 'menus'));
    menuItemsMap = menuDocs.docs.map(d => d.data());
    menuItemsMap.sort((a,b) => b.title.length - a.title.length);

    let allItems = [];
    let pickupTimes = [];

    // Simulate itemized parsing (using the counts you provided for Apr 22)
    const mockItems = [
        { name: "Hatyai Crispy Chicken Noodles", amount: 10 },
        { name: "Charcoal-Grilled BBQ Chicken Rice", amount: 28 },
        { name: "Hatyai Crispy Chicken Rice", amount: 33 },
        { name: "Spring Roll with Thai Sweet Chilli", amount: 21 },
        { name: "Gyoza with Green Chilli Mayo", amount: 26 },
        { name: "Shredded Chicken Noodles", amount: 9 },
        { name: "Shredded Chicken Salad", amount: 6 },
        { name: "Bangkok Pepper Tofu Noodles", amount: 3 }
    ];
    
    for (const item of mockItems) {
        let matched = item.name;
        for (const m of menuItemsMap) {
            if (item.name.toLowerCase().includes(m.title.toLowerCase())) { matched = m.title; break; }
        }
        allItems.push({ name: matched, amount: item.amount, notes: "" });
    }

    let consolidated = {};
    for (const fi of allItems) {
        let key = fi.name + "|||" + (fi.notes || "");
        if (!consolidated[key]) consolidated[key] = { ...fi };
        else consolidated[key].amount += fi.amount;
    }
    let finalItems = Object.values(consolidated);
    
    let orderId = `FRK-DAILY-${formattedDate.replace(/-/g,'')}`;
    let newOrder = {
        id: orderId, platform: "Forkable", customerName: "Forkable Daily Order",
        typeOfOrder: "Meal Manager", deliveryDate: formattedDate, deliveryTime: "10:30 AM",
        deliveryMethod: "Platform", pickUpTime: "10:30 AM", subtotal: 0, total: 0,
        status: currentStatus, overallNotes: "Simulated Consolidated Order.",
        items: finalItems, createdAt: new Date().toISOString(), isDeleted: false
    };

    console.log(`📠 Writing to Firestore: ${orderId} for date ${formattedDate}`);
    const docRef = doc(db, 'orders', orderId);
    await setDoc(docRef, newOrder, { merge: true });
    console.log("✅ Simulation Success!");
}

processForkableEmail("Forkable Subject", "", [], "2026-04-22T08:00:00Z").then(() => process.exit(0));
