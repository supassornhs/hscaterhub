import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import fs from 'fs';

const firebaseConfig = {
  apiKey: "AIzaSyCj__TCfYSF-1y4uR-UOId_aPWWwy4-W5A",
  authDomain: "hscaterhub.firebaseapp.com",
  projectId: "hscaterhub"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Mock data and function call from email_scraper.js logic
async function testConsolidation() {
    console.log("Testing consolidation logic...");
    const formattedDate = "2026-04-23";
    const orderId = `FRK-DAILY-${formattedDate.replace(/-/g,'')}`;
    
    const newOrder = {
        id: orderId,
        platform: "Forkable",
        customerName: "Forkable Daily Order (TEST)",
        deliveryDate: formattedDate,
        items: [{ name: "Mock Chicken", amount: 10, notes: "" }],
        createdAt: new Date().toISOString(),
        isDeleted: false
    };

    const docRef = doc(db, 'orders', orderId);
    await setDoc(docRef, newOrder, { merge: true });
    console.log(`Synced Test Order: ${orderId}`);
    process.exit(0);
}

testConsolidation();
