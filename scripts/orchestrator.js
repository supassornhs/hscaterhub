import { initializeApp } from "firebase/app";
import { getFirestore, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { exec } from "child_process";
import { promisify } from "util";
import * as dotenv from 'dotenv';
dotenv.config();

const execAsync = promisify(exec);

const firebaseConfig = {
    apiKey: "AIzaSyCj__TCfYSF-1y4uR-UOId_aPWWwy4-W5A",
    authDomain: "hscaterhub.firebaseapp.com",
    projectId: "hscaterhub"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("🛠️  Orchestrator daemon started. Listening for Dashboard 'Refresh' signals...");

// Optional: also run on an hourly schedule locally utilizing JS intervals instead of just relying on external crons
setInterval(async () => {
    console.log("⏰ Auto-Hourly trigger initiated.");
    await runAllScrapers();
}, 60 * 60 * 1000); 

onSnapshot(doc(db, 'system', 'crawlers'), async (docSnap) => {
    if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.forceSync === true) {
            console.log("⚡ FORCE SYNC TRIGGERED BY DASHBOARD! Executing all scrapers...");
            
            // Acknowledge the trigger block double execution
            await updateDoc(doc(db, 'system', 'crawlers'), { isSyncing: true, forceSync: false });
            
            await runAllScrapers();
            
            // Notify Dashboard we finished
            await updateDoc(doc(db, 'system', 'crawlers'), { isSyncing: false, lastGlobalSync: new Date().toLocaleTimeString() });
            console.log("✅ All On-Demand Syncs completed.");
        }
    }
});

async function runAllScrapers() {
    const scripts = [
        "scripts/email_scraper.js",
        "scripts/ezcater_scraper.js",
        "scripts/clubfeast_scraper.js",
        "scripts/cater2me_scraper.js",
        "scripts/forkable_scraper.js"
    ];
    
    for (const script of scripts) {
        console.log(`▶ Relaunching worker: ${script}`);
        try {
            const { stdout, stderr } = await execAsync(`node ${script}`);
            console.log(`[${script}] Output:\n${stdout}`);
            if (stderr) console.error(`[${script}] Errors:\n${stderr}`);
        } catch (error) {
            console.log(`❌ Error executing ${script}:`, error.message);
        }
    }
}
