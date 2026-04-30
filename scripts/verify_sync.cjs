const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where } = require('firebase/firestore');

const firebaseConfig = {
    apiKey: "AIzaSyDE-Q0S8u4-V3w8X9yZ6Q1K2L3M4N5O6P",
    authDomain: "hscaterhub.firebaseapp.com",
    projectId: "hscaterhub",
    storageBucket: "hscaterhub.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abcdef1234567890"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

(async () => {
    console.log("🔍 Querying Firebase Firestore...");
    const q = query(collection(db, "orders"), where("platform", "==", "Forkable"));
    const querySnapshot = await getDocs(q);
    
    console.log(`\n📊 Firebase Sync Report:`);
    console.log(`------------------------`);
    console.log(`Total Forkable Orders: ${querySnapshot.size}`);
    
    let totalItems = 0;
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        totalItems += (data.items || []).length;
        console.log(`✅ ${doc.id}: ${data.deliveryDate} - ${(data.items || []).length} items`);
    });
    
    console.log(`------------------------`);
    console.log(`Total Items Synced: ${totalItems}`);
    process.exit(0);
})();
