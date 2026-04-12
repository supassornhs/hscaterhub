import puppeteer from 'puppeteer';
import * as fs from 'fs';

(async () => {
    try {
        console.log('Launching browser...');
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        
        console.log('Navigating to Foodja login...');
        await page.goto('https://foodja.com/restaurant-portal/', { waitUntil: 'domcontentloaded' });
        await new Promise(r => setTimeout(r, 3000));
        
        // Type username
        try {
            await page.type('#username', 'Supassorn@holyshred.co');
            console.log('Typed username. Looking for next button...');
            await page.evaluate(() => {
                const btns = Array.from(document.querySelectorAll('button'));
                const nextBtn = btns.find(b => b.innerText.toLowerCase().includes('next') || b.innerText.toLowerCase().includes('log'));
                if (nextBtn) nextBtn.click();
            });
            await new Promise(r => setTimeout(r, 4000));
        } catch(e) {
            console.error('Failed on step 1:', e.message);
        }

        // Wait to see if password field appears
        const html = await page.evaluate(() => document.body.innerHTML);
        fs.writeFileSync('foodja_dom_step2.html', html);
        
        console.log('Saved to foodja_dom_step2.html');
        await browser.close();
    } catch(e) {
        console.error(e);
    }
})();
