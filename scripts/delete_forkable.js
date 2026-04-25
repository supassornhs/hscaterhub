import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCj__TCfYSF-1y4uR-UOId_aPWWwy4-W5A",
  authDomain: "hscaterhub.firebaseapp.com",
  projectId: "hscaterhub"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function deleteForkableOrders() {
    const ordersCol = collection(db, 'orders');
    const snapshot = await getDocs(ordersCol);
    let count = 0;
    for (const d of snapshot.docs) {
        if (d.id.startsWith("FRK-DAILY-") || d.id.startsWith("FRK-")) {
            await deleteDoc(doc(db, 'orders', d.id));
            console.log(`Deleted ${d.id}`);
            count++;
        }
    }
    console.log(`Deleted ${count} Forkable orders.`);
    process.exit(0);
}

deleteForkableOrders();
