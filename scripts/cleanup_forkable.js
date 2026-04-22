import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCj__TCfYSF-1y4uR-UOId_aPWWwy4-W5A",
  authDomain: "hscaterhub.firebaseapp.com",
  projectId: "hscaterhub"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

(async () => {
    console.log("🔍 Scanning for old bundled Forkable orders...");
    const snap = await getDocs(collection(db, 'orders'));
    let count = 0;
    
    for (const d of snap.docs) {
        const order = d.data();
        const id = d.id;
        
        if (order.platform === 'Forkable') {
            console.log(`🗑️ Deleting Forkable order: ${id}`);
            await deleteDoc(doc(db, 'orders', id));
            count++;
        }
    }
    
    console.log(`✅ Cleaned up ${count} old Forkable orders.`);
    process.exit(0);
})();
