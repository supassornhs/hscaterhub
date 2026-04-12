import puppeteer from 'puppeteer';
import * as fs from 'fs';

(async () => {
    try {
        console.log('Launching browser...');
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        
        console.log('Navigating to Foodja...');
        await page.goto('https://foodja.com/restaurant-portal/', { waitUntil: 'domcontentloaded' });
        
        await new Promise(r => setTimeout(r, 5000));
        
        await page.type('input[type="email"], input[name="email"]', 'Supassorn@holyshred.co');
        await page.type('input[type="password"], input[name="password"]', 'Supassorn_2493');
        await page.click('button[type="submit"]');
        
        console.log('Waiting for login...');
        await new Promise(r => setTimeout(r, 15000));
        
        const html = await page.evaluate(() => document.body.innerHTML);
        fs.writeFileSync('foodja_dom.html', html);
        
        console.log('Saved to foodja_dom.html');
        await browser.close();
    } catch(e) {
        console.error(e);
    }
})();
