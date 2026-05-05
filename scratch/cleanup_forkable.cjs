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
  const q = query(collection(db, 'orders'), where('platform', '==', 'Forkable'));
  const snap = await getDocs(q);
  
  console.log(`Found ${snap.size} Forkable orders. Checking for duplicates...`);
  
  let deletedCount = 0;
  for (const d of snap.docs) {
    const id = d.id;
    // Old format: BW-2026-04-27 (2 hyphens)
    // New format: BW-2026-04-27-1115AM (3 hyphens)
    const hyphenCount = (id.match(/-/g) || []).length;
    
    if (hyphenCount === 3 || id.startsWith('FORK-')) {
      console.log(`🗑️ Deleting old record: ${id}`);
      await deleteDoc(doc(db, 'orders', id));
      deletedCount++;
    }
  }
  
  console.log(`✅ Cleanup complete. Deleted ${deletedCount} legacy records.`);
  process.exit(0);
}

cleanupDuplicates();
