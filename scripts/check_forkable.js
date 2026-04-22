import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCj__TCfYSF-1y4uR-UOId_aPWWwy4-W5A",
  authDomain: "hscaterhub.firebaseapp.com",
  projectId: "hscaterhub"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

(async () => {
    console.log("🔍 Checking EVERY Forkable order...");
    const snap = await getDocs(collection(db, 'orders'));
    snap.docs.forEach(d => {
        const order = d.data();
        if (order.platform === 'Forkable') {
            console.log(`- [${d.id}] Date: ${order.deliveryDate} Items: ${order.items?.length}`);
        }
    });
    process.exit(0);
})();
