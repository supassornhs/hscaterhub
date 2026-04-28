import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDEw-180Pz6u79-x79-x79-x79-x79", // Placeholder, using default from env
    authDomain: "holyshred-catering.firebaseapp.com",
    projectId: "holyshred-catering",
    storageBucket: "holyshred-catering.appspot.com",
    messagingSenderId: "367295627255",
    appId: "1:367295627255:web:02120e82c5628da6f62d8d",
    measurementId: "G-82C5628DA6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function cleanOldOrders() {
    console.log("🧹 Cleaning up old FORK- prefix orders...");
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('deliveryDate', '==', '2026-04-27'));
    
    const querySnapshot = await getDocs(q);
    let deletedCount = 0;
    
    for (const d of querySnapshot.docs) {
        const id = d.id;
        // Delete if the ID starts with FORK-
        if (id.startsWith('FORK-')) {
            console.log(`🗑️ Deleting ${id}...`);
            await deleteDoc(doc(db, 'orders', id));
            deletedCount++;
        }
    }
    
    console.log(`✨ Cleanup complete. Deleted ${deletedCount} duplicate orders.`);
    process.exit(0);
}

cleanOldOrders().catch(console.error);
