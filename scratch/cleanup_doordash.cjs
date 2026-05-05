const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where, deleteDoc, doc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyCj__TCfYSF-1y4uR-UOId_aPWWwy4-W5A",
  authDomain: "hscaterhub.firebaseapp.com",
  projectId: "hscaterhub",
  storageBucket: "hscaterhub.firebasestorage.app",
  messagingSenderId: "191852835453",
  appId: "1:191852835453:web:6e8498beaecbb85f637714",
  measurementId: "G-HL5SHGHK2C"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function cleanupDuplicates() {
  const q = query(collection(db, 'orders'), where('platform', '==', 'DoorDash'));
  const snap = await getDocs(q);
  
  console.log(`Found ${snap.size} DoorDash orders. Checking for duplicates...`);
  
  let deletedCount = 0;
  for (const d of snap.docs) {
    const id = d.id;
    // Delete any DoorDash order for May 5th that was incorrectly created
    if (id.startsWith('DD-0505-')) {
      console.log(`🗑️ Deleting incorrect May 5th record: ${id}`);
      await deleteDoc(doc(db, 'orders', id));
      deletedCount++;
    }
  }
  
  console.log(`✅ Cleanup complete. Deleted ${deletedCount} incorrect records.`);
  process.exit(0);
}

cleanupDuplicates();
