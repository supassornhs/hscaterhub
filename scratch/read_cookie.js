const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc } = require('firebase/firestore');

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

async function getCookie() {
  const snap = await getDoc(doc(db, 'system', 'crawlers'));
  if (snap.exists()) {
    const data = snap.data();
    console.log(JSON.stringify(data.ZeroCater, null, 2));
  } else {
    console.log("No config found");
  }
  process.exit(0);
}

getCookie();
