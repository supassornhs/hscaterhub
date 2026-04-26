// FINAL VERIFICATION SIMULATION
const mockExcelData = [
    ["28x", "Hatyai Crispy Chicken Rice", "", ""],
    ["5x", "Hatyai Crispy Chicken Rice", "", "not spicy"], 
    ["10x", "Hatyai Crispy Chicken Noodles", "", ""],
    ["Count (Totals from above)", "", "", ""],
    ["33", "Hatyai Crispy Chicken Rice", "", ""],
    ["10", "Hatyai Crispy Chicken Noodles", "", ""],
    ["21", "Spring Roll with Thai Sweet Chilli", "", ""]
];

async function check() {
    let allItems = [];
    let mainBlocks = [];
    let summarySides = [];
    let inSidesSection = false;

    mockExcelData.forEach((row) => {
        let colA = String(row[0] || "").trim();
        let colB = String(row[1] || "").trim();
        let colD = String(row[3] || "").trim();

        if (colA.toLowerCase().includes("totals from above")) {
            inSidesSection = true; return;
        }

        if (!inSidesSection) {
            let countMatch = colA.match(/(\d+)/);
            if (countMatch) {
                let block = { meal: colB, total: parseInt(countMatch[1]), rows: [] };
                mainBlocks.push(block);
                block.rows.push({ note: colD });
            } else if (mainBlocks.length > 0) {
                mainBlocks[mainBlocks.length - 1].rows.push({ note: colD });
            }
        } else {
            let countMatch = colA.match(/(\d+)/);
            if (countMatch && colB) summarySides.push({ name: colB, amount: parseInt(countMatch[1]) });
        }
    });

    mainBlocks.forEach(block => {
        let noteGroups = {};
        let noteCount = 0;
        block.rows.forEach(r => { if (r.note) { noteGroups[r.note] = (noteGroups[r.note] || 0) + 1; noteCount++; } });
        let base = block.total - noteCount;
        if (base > 0) allItems.push({ name: block.meal, amount: base, notes: "" });
        for (let n in noteGroups) allItems.push({ name: block.meal, amount: noteGroups[n], notes: n });
    });

    summarySides.forEach(side => {
        allItems.push({ name: side.name, amount: side.amount, notes: "" });
    });

    console.log("\n--- FINAL PREVIEW (EXACT COUNTS) ---");
    allItems.forEach(i => console.log(`${i.amount}x ${i.name} ${i.notes ? '[' + i.notes + ']' : ''}`));
}

check();
