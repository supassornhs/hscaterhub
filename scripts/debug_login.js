import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 1200 });

    try {
        await page.goto("https://forkable.com/fpp/login");
        await new Promise(r => setTimeout(r, 2000));

        console.log("Typing email...");
        await page.type('input[type="email"]', 'supassorn@holyshred.co', { delay: 150 });
        await page.screenshot({ path: 'login_step1_email.png' });
        
        const nextBtn = await page.evaluateHandle(() => Array.from(document.querySelectorAll('button, div, span')).find(x => x.innerText && x.innerText.trim() === 'Next'));
        if (nextBtn) await nextBtn.asElement().click();
        
        await new Promise(r => setTimeout(r, 4000));
        await page.screenshot({ path: 'login_step2_password_box.png' });

        console.log("Typing password...");
        const passInputs = await page.$$('input[type="password"]');
        if (passInputs.length > 0) {
            await passInputs[0].type('Supassorn_2493', { delay: 150 });
        } else {
            console.log("No password input found!");
        }
        await page.screenshot({ path: 'login_step3_password_typed.png' });

        console.log("Clicking final submit...");
        await page.keyboard.press('Enter');
        
        await new Promise(r => setTimeout(r, 8000));
        console.log("Final URL:", page.url());
        await page.screenshot({ path: 'login_step4_final.png' });
        
        await browser.close();
    } catch (e) { console.error(e); await browser.close(); }
})();
