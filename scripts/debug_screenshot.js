import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto('https://forkable.com/fpp/login');
    
    await page.type('input[type="email"]', 'supassorn@holyshred.co', { delay: 100 });
    await page.keyboard.press('Enter');
    await new Promise(r => setTimeout(r, 3000));
    await page.type('input[type="password"]', 'Supassorn_2493', { delay: 100 });
    await page.keyboard.press('Enter');
    
    await new Promise(r => setTimeout(r, 6000));
    
    // Visit today
    await page.goto('https://forkable.com/fpp/2297/2026-04-29/17201');
    await page.evaluate(() => {
        const rows = Array.from(document.querySelectorAll('span, div')).filter(s => s.innerText && s.innerText.includes('Wednesday, Apr 29'));
        if (rows.length > 0) rows[0].click();
    });
    await new Promise(r => setTimeout(r, 10000));

    await page.screenshot({ path: 'debug_detailed.png' });
    console.log('Final URL:', page.url());
    console.log('Body snippet after click:', (await page.evaluate(() => document.body.innerText)).substring(0, 5000));
    
    await browser.close();
})();
