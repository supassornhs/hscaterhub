import * as XLSX from 'xlsx';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

// Mocking the environment
const menuItems = [
    { title: "Hatyai Crispy Chicken Rice" },
    { title: "Hatyai Crispy Chicken Noodles" },
    { title: "Charcoal-Grilled BBQ Chicken Noodles" },
    { title: "Green Curry Hatyai Crispy Chicken Rice" }
];

async function simulate() {
    console.log("🚀 SIMULATING EXCEL PARSING (April 22nd Screenshot Data)...");
    
    // This mock data represents the Grid I see in your screenshot
    const mockExcelData = [
        ["Meal", "Description", "Platform", "Notes"],
        ["28x", "Hatyai Crispy Chicken Rice", "", ""],
        ["", "Hatyai Crispy Chicken Rice", "Add Side: ...", ""],
        ["", "Hatyai Crispy Chicken Rice", "", ""],
        ["", "Hatyai Crispy Chicken Rice", "", "not spicy"], // One split here
        // ... imagine 24 more rows
        ["11x", "Hatyai Crispy Chicken Noodles", "", ""],
        ["", "Hatyai Crispy Chicken Noodles", "", ""],
        ["Count (Totals from above)", "", "", ""],
        ["28", "Hatyai Crispy Chicken Rice", "", ""],
        ["11", "Hatyai Crispy Chicken Noodles", "", ""],
        ["14", "Spring Roll with Thai Sweet Chilli", "", ""]
    ];

    // --- REPLICATING THE NEW LOGIC FROM email_scraper.js ---
    let mainBlocks = [];
    let activeBlock = null;
    let inSidesSection = false;
    let summarySides = [];
    let items = [];

    mockExcelData.forEach((row, idx) => {
        if (idx === 0) return;
        let colA = String(row[0] || "").trim();
        let colB = String(row[1] || "").trim();
        let colD = String(row[3] || "").trim();

        if (colA.toLowerCase().includes("totals from above")) {
            inSidesSection = true; return;
        }

        if (!inSidesSection) {
            let countMatch = colA.match(/(\d+)/);
            if (countMatch) {
                activeBlock = { meal: colB, groupTotal: parseInt(countMatch[1]), rows: [] };
                mainBlocks.push(activeBlock);
            }
            if (activeBlock) activeBlock.rows.push({ note: colD });
        } else {
            let countMatch = colA.match(/(\d+)/);
            if (countMatch && colB) summarySides.push({ name: colB, amount: parseInt(countMatch[1]) });
        }
    });

    mainBlocks.forEach(block => {
        let noteGroups = {};
        let noteCount = 0;
        block.rows.forEach(r => { if (r.note) { noteGroups[r.note] = (noteGroups[r.note] || 0) + 1; noteCount++; } });
        
        let baseCount = block.groupTotal - noteCount;
        console.log(`✅ Found Block: ${block.groupTotal}x ${block.meal}`);
        if (baseCount > 0) items.push({ name: block.meal, amount: baseCount, notes: "" });
        for (const n in noteGroups) items.push({ name: block.meal, amount: noteGroups[n], notes: n });
    });

    summarySides.forEach(side => {
        console.log(`✅ Found Side Summary: ${side.amount}x ${side.name}`);
        items.push({ name: side.name, amount: side.amount, notes: "" });
    });

    console.log("\n--- FINAL PREVIEW FOR DASHBOARD ---");
    items.forEach(i => console.log(`${i.amount}x ${i.name} ${i.notes ? '['+i.notes+']' : ''}`));
}

simulate();
