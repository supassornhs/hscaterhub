import fs from 'fs';
const lines = fs.readFileSync('scraper_vfinal_v14.txt', 'utf8').split('\n');
let inC = false;
for (const line of lines) {
    if (line.toLowerCase().includes('processing group c')) {
        inC = true;
        console.log("=== START C ===");
    }
    if (inC && line.toLowerCase().includes('processing group')) {
        if (!line.toLowerCase().includes('processing group c')) {
            inC = false;
            console.log("=== END C ===");
        }
    }
    if (inC) console.log(line);
}
