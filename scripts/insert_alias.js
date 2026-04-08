import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";

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

async function addAlias() {
  const querySnapshot = await getDocs(collection(db, "menus"));
  for (const record of querySnapshot.docs) {
      if (record.data().title === 'Shredded Chicken Tray') {
          await updateDoc(doc(db, "menus", record.id), {
              aliases: ["Shredded Chicken", "Shredded Chicken (GF)"]
          });
          console.log(`Updated Shredded Chicken Tray with aliases!`);
      }
  }
  process.exit(0);
}

addAlias().catch(console.error);
