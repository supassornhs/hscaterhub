
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

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

async function check() {
    console.log("Listing ALL Forkable orders in DB...");
    const snap = await getDocs(collection(db, "orders"));
    let count = 0;
    snap.forEach(doc => {
        const d = doc.data();
        if (d.platform === "Forkable") {
            console.log(`- ${doc.id}: ${d.customerName} [${d.deliveryDate}] STATUS: ${d.status}`);
            count++;
        }
    });
    console.log(`Done. Total Forkable orders: ${count}`);
    process.exit(0);
}
check();
