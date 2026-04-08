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
    const snap = await getDocs(collection(db, 'orders'));
    snap.docs.forEach((doc, i) => {
        const d = doc.data();
        if (d.platform === 'ClubFeast') {
             console.log(`[${d.id}] - Date: ${d.deliveryDate} - Status: ${d.status}`);
             console.dir(d.items, {depth: null});
        }
    });
    process.exit(0);
})();
