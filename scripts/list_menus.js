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

async function listMenus() {
  const querySnapshot = await getDocs(collection(db, "menus"));
  console.log("Firebase Menu Titles:");
  for (const record of querySnapshot.docs) {
      console.log(`- "${record.data().title}"`);
  }
  process.exit(0);
}

listMenus().catch(console.error);
