import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import fs from 'fs';

const firebaseConfig = {
  apiKey: "AIzaSyCj__TCfYSF-1y4uR-UOId_aPWWwy4-W5A",
  authDomain: "hscaterhub.firebaseapp.com",
  projectId: "hscaterhub"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const d = await getDoc(doc(db, 'orders', 'FRK-DAILY-20260422'));
if (d.exists()) {
    const items = d.data().items;
    let out = `Total unique items: ${items.length}\n`;
    items.forEach(i => { out += `  ${i.amount}x ${i.name}${i.notes ? ' | Note: ' + i.notes : ''}\n`; });
    fs.writeFileSync('debug_out.txt', out);
    process.stdout.write(out);
} else {
    fs.writeFileSync('debug_out.txt', 'NOT FOUND');
    console.log('NOT FOUND');
}
process.exit(0);
