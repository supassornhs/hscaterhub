const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where } = require('firebase/firestore');

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

async function listIds() {
  const q = query(collection(db, 'orders'), where('platform', '==', 'Forkable'));
  const snap = await getDocs(q);
  snap.forEach(d => console.log(d.id));
  process.exit(0);
}

listIds();
