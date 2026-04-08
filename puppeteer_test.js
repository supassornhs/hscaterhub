const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });

    try {
        await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
        await new Promise(r => setTimeout(r, 2000));
        await page.screenshot({ path: 'current_dashboard.png' });
        
        // Output all order rows
        const orders = await page.evaluate(() => {
            const rows = document.querySelectorAll('#orders-tbody tr');
            return Array.from(rows).map(row => {
               const cells = row.querySelectorAll('td');
               if (cells.length > 5) {
                   return {
                       id: cells[0].innerText.trim(),
                       platform: cells[1].innerText.trim(),
                       date: cells[3].innerText.trim()
                   };
               }
               return null;
            }).filter(Boolean);
        });
        
        console.log("Orders found on dashboard:");
        console.table(orders);

    } catch (e) {
        console.error(e);
    } finally {
        await browser.close();
    }
})();
