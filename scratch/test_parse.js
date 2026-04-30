const text = `Edward Kung
Green Curry Charcoal-Grilled BBQ Chicken Rice
$15.45
Darius Ghassemian
Charcoal-Grilled BBQ Chicken Rice
$14.45
Blake Cox
Charcoal-Grilled BBQ Chicken Rice
$14.45
Bradley Zhu
Hatyai Crispy Chicken Rice
» Add Side: Bangkok Pepper Tofu
$19.40
Anujith Beerakayala
Shredded Chicken Salad
» Add Side: Bangkok Pepper Tofu
$18.90
Anshul Singhal
Hatyai Crispy Chicken Salad
$14.95`;

const segmentLines = text.split('\n').map(l => l.trim()).filter(l => l);
const items = [];
let pendingNotes = [];
let pIdx = -1; // Changed to -1 to fix the first item bug I noticed

for (let i = 0; i < segmentLines.length; i++) {
    if (segmentLines[i].match(/^\$\d+\.\d{2}$/)) {
        let block = segmentLines.slice(pIdx + 1, i).map(l => l.trim()).filter(l => l);
        if (block.length >= 1) {
            const firstLine = block[0].trim();
            const isSideOrNote = firstLine.includes('»') || firstLine.toLowerCase().includes('add side') || firstLine.toLowerCase().includes('please') || firstLine.toLowerCase().includes('no ');
            const words = firstLine.split(/\s+/).filter(w => w.length > 0);
            const isName = !isSideOrNote && words.length >= 2 && words.length <= 4 && !/\d/.test(firstLine);
            let rawDish = "";
            let extraNotes = "";
            if (isName && block.length >= 2) {
                rawDish = block[1].replace('»', '').trim();
                extraNotes = block.slice(2).map(n => n.replace('»', '').trim()).join(' | ');
            } else {
                rawDish = firstLine.replace('»', '').trim();
                extraNotes = block.slice(1).map(n => n.replace('»', '').trim()).join(' | ');
            }
            if (isSideOrNote) {
                const sideText = extraNotes ? `${rawDish} (${extraNotes})` : rawDish;
                if (items.length > 0) items[items.length - 1].notes = items[items.length - 1].notes ? `${items[items.length - 1].notes} | ${sideText}` : sideText;
            } else if (rawDish) {
                items.push({ name: rawDish, notes: extraNotes });
            }
        }
        pIdx = i;
    }
}
console.log(JSON.stringify(items, null, 2));
