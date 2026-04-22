import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCj__TCfYSF-1y4uR-UOId_aPWWwy4-W5A",
  authDomain: "hscaterhub.firebaseapp.com",
  projectId: "hscaterhub"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

(async () => {
    const id = process.argv[2] || "FRK-0420-1045AM";
    console.log(`🔍 Inspecting order: ${id}`);
    const snap = await getDoc(doc(db, 'orders', id));
    if (snap.exists()) {
        const d = snap.data();
        console.log("Platform:", d.platform);
        console.log("Date:", d.deliveryDate);
        console.log("Items:");
        d.items.forEach(it => {
            console.log(`- ${it.amount}x ${it.name} ${it.notes ? `(${it.notes})` : ""}`);
        });
    } else {
        console.log("Order not found.");
    }
    process.exit(0);
})();
