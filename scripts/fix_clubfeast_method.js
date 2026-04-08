import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCj__TCfYSF-1y4uR-UOId_aPWWwy4-W5A",
  authDomain: "hscaterhub.firebaseapp.com",
  projectId: "hscaterhub"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

(async () => {
    const snap = await getDocs(collection(db, 'orders'));
    for (const d of snap.docs) {
        if (d.data().platform === 'ClubFeast' && d.data().deliveryMethod !== 'Platform') {
             await setDoc(doc(db, 'orders', d.id), { deliveryMethod: 'Platform' }, { merge: true });
             console.log(`Updated ${d.id}`);
        }
    }
    process.exit(0);
})();
