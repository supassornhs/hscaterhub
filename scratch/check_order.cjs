const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc } = require('firebase/firestore');

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

async function checkOrder() {
  const orderId = 'DD-0505-4OCGH';
  const snap = await getDoc(doc(db, 'orders', orderId));
  if (snap.exists()) {
    console.log("Order Data:", JSON.stringify(snap.data(), null, 2));
  } else {
    console.log("Order NOT found in Firestore!");
  }
  process.exit(0);
}

checkOrder();
