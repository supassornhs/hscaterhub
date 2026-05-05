import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
    const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    const cookies = '_ga=GA1.1.83812787.1777371531; _hp5_event_props.3862836872=%7B%7D; __adroll_fpc=a82147249db68659448dc8351252e87b-1777371534444; hubspotutk=eec630b7bcbe0c4c5dff510b07a4ad46; __hstc=50334390.eec630b7bcbe0c4c5dff510b07a4ad46.1777372577246.1777457546396.1777483855261.4; _cs_c=0; _easyorder_session=977e2e72571f45963c29986aed47e3bb; _hp5_meta.3862836872=%7B%22userId%22%3A%221032165537040382%22%2C%22sessionId%22%3A%221033736246528743%22%2C%22sessionProperties%22%3A%7B%22time%22%3A1777535985606%2C%22id%22%3A%221033736246528743%22%2C%22initial_pageview_info%22%3A%7B%22time%22%3A1777535985606%2C%22id%22%3A%228221059348822095%22%2C%22title%22%3A%22Forkable%22%2C%22url%22%3A%7B%22domain%22%3A%22forkable.com%22%2C%22path%22%3A%22%2Ffpp%2F%22%2C%22query%22%3A%22%22%2C%22hash%22%3A%22%22%7D%7D%2C%22search_keyword%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22utm%22%3A%7B%22source%22%3A%22%22%2C%22medium%22%3A%22%22%2C%22term%22%3A%22%22%2C%22content%22%3A%22%22%2C%22campaign%22%3A%22%22%7D%7D%2C%22identity%22%3A%22359302%22%7D'.split(';').map(p => { 
        const [name, value] = p.trim().split('='); 
        return {name, value, domain: 'forkable.com'}; 
    });
    await page.setCookie(...cookies);
    
    await page.goto('https://forkable.com/fpp/2297/2026-04-28/17201', {waitUntil: 'networkidle2'});
    await new Promise(r => setTimeout(r, 15000));
    
    const rowTargets = await page.evaluate(() => {
        const dayRegex = /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), [A-Za-z]+ \d+/i;
        const rows = Array.from(document.querySelectorAll('div, span, p, a, button')).filter(el => {
            const txt = (el.innerText || '').trim();
            const rect = el.getBoundingClientRect();
            return dayRegex.test(txt) && rect.width > 200 && rect.height > 20 && txt.length < 100;
        });
        const r = rows.find(row => !rows.some(other => other !== row && row.contains(other)));
        if (!r) return null;
        r.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const targets = [{ x: r.getBoundingClientRect().x + 50, y: r.getBoundingClientRect().y + 10 }];
        return { targets };
    });
    
    if (rowTargets) {
        for (const t of rowTargets.targets) {
            await page.mouse.click(t.x, t.y);
            await new Promise(r => setTimeout(r, 1000));
        }
    }
    await new Promise(r => setTimeout(r, 8000));
    
    const sessionButton = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('a, button, div, span, .btn'));
        const btn = elements.find(el => {
            const txt = (el.innerText || '').toLowerCase().trim();
            const rect = el.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0 && txt.length < 30 && (txt.includes('view order') || txt.includes('view completed order'));
        });
        if (!btn) return null;
        return { x: btn.getBoundingClientRect().x + btn.getBoundingClientRect().width/2, y: btn.getBoundingClientRect().y + btn.getBoundingClientRect().height/2 };
    });
    
    if (sessionButton) {
        await page.mouse.click(sessionButton.x, sessionButton.y);
        await new Promise(r => setTimeout(r, 15000));
    }
    
    const html = await page.content();
    fs.writeFileSync('scratch/dom.html', html);
    console.log('DOM saved');
    await browser.close();
    process.exit(0);
})();
