import puppeteer from 'puppeteer';
import * as dotenv from 'dotenv';
dotenv.config();

(async () => {
    const EZ_COOKIE = process.env.EZCATER_COOKIE;
    const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
    const page = await browser.newPage();
    const parsedCookies = EZ_COOKIE.split(';').map(c => {
        const parts = c.trim().split('=');
        return { name: parts[0], value: parts.slice(1).join('='), domain: '.ezcater.com' };
    }).filter(c => c.name.length > 0);

    await page.setCookie(...parsedCookies);
    await page.goto("https://ezmanage.ezcater.com/orders", { waitUntil: 'domcontentloaded' });

    const ordersData = await page.evaluate(async () => {
        const query = `query DiscoverLineItem {
          __type(name: "LineItem") {
            fields {
              name
            }
          }
        }`;
        const res = await fetch("https://ezmanage-api.ezcater.com/graphql", {
            method: "POST", credentials: "include",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify([{ operationName: "DiscoverLineItem", query: query }])
        });
        return res.json();
    });
    
    console.log(JSON.stringify(ordersData, null, 2));
    await browser.close();
})();
