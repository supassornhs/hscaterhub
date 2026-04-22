import fs from 'fs';
const lines = fs.readFileSync('scraper_v8.txt', 'utf8').split('\n');
let inXE = false;
for (const line of lines) {
    if (line.toLowerCase().includes('processing group xe')) {
        inXE = true;
        console.log("=== START XE ===");
    }
    if (inXE && line.toLowerCase().includes('processing group')) {
        if (!line.toLowerCase().includes('processing group xe')) {
            inXE = false;
            console.log("=== END XE ===");
        }
    }
    if (inXE) console.log(line);
}
