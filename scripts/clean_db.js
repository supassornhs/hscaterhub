import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";

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

async function cleanEmptyOrders() {
  const querySnapshot = await getDocs(collection(db, "orders"));
  let count = 0;
  for (const record of querySnapshot.docs) {
      const data = record.data();
      if ((data.platform === 'Doordash' || data.platform === 'DoorDash') && (data.subtotal === 0 || data.total === 0) && data.id.startsWith('DD-0408-')) {
          await deleteDoc(doc(db, "orders", record.id));
          count++;
          console.log(`Deleted Ghost Order: ${record.id}`);
      }
  }
  console.log(`Successfully purged ${count} zero-value ghost orders.`);
  process.exit(0);
}

cleanEmptyOrders().catch(console.error);
