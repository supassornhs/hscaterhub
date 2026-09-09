/**
 * forkable_client.js — Shared Forkable auth + GraphQL plumbing.
 *
 * Extracted from forkable_graphql_probe.js so multiple extract scripts can
 * reuse the same login machinery (env credentials -> session cookie) and the
 * same authenticated POST helper. Cookie resolution order:
 *   1. FORKABLE_COOKIE env var (raw cookie header string)
 *   2. FORKABLE_USERNAME / FORKABLE_PASSWORD (logs in headlessly via Puppeteer)
 *   3. Firestore system/crawlers -> Forkable.cookie (only if FORKABLE_COOKIE_SOURCE=firestore)
 */

import * as dotenv from 'dotenv';
dotenv.config();

export const DEFAULT_GRAPHQL_URL = 'https://forkable.com/api/v2/graphql';
const DEFAULT_LOGIN_URL = 'https://forkable.com/fpp/';
const DEFAULT_CHROME_EXECUTABLE = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const DEFAULT_REQUEST_TIMEOUT_MS = 60000;

function requiredEnv(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required env var: ${name}`);
    }
    return value;
}

async function firstVisibleSelector(page, selectors, timeout = 15000) {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
        for (const selector of selectors) {
            const element = await page.$(selector);
            if (!element) continue;
            const visible = await element.evaluate(node => {
                const style = window.getComputedStyle(node);
                const rect = node.getBoundingClientRect();
                return style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 0 && rect.height > 0;
            });
            if (visible) return selector;
        }
        await new Promise(resolve => setTimeout(resolve, 250));
    }
    throw new Error(`Timed out waiting for any selector: ${selectors.join(', ')}`);
}

async function detectLoginState(page) {
    return page.evaluate(() => {
        const text = document.body?.innerText || '';
        const normalized = text.replace(/\s+/g, ' ').toLowerCase();
        const hasEmailInput = Boolean(document.querySelector('input[type="email"], input[name*="email" i]'));
        const hasPasswordInput = Boolean(document.querySelector('input[type="password"]'));
        const needsTwoFactor = ['two-factor', 'two factor', '2-factor', 'verification code', 'authentication code', 'one-time code']
            .some(term => normalized.includes(term));
        const authFailed = ['invalid email', 'invalid password', 'incorrect email', 'incorrect password', 'login failed', 'sign in failed']
            .some(term => normalized.includes(term));
        return { url: window.location.href, hasEmailInput, hasPasswordInput, needsTwoFactor, authFailed, title: document.title, textPreview: text.slice(0, 240) };
    });
}

async function fillInputValue(page, selector, value) {
    await page.$eval(selector, (input, nextValue) => {
        input.focus();
        input.value = '';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.value = nextValue;
        input.dispatchEvent(new InputEvent('input', { bubbles: true, cancelable: true, inputType: 'insertText', data: nextValue }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
    }, value);
}

async function waitForLoginTransition(page, timeout = 10000) {
    const navigation = page.waitForNavigation({ waitUntil: 'networkidle2', timeout }).catch(() => null);
    await Promise.race([navigation, new Promise(resolve => setTimeout(resolve, timeout))]);
    await new Promise(resolve => setTimeout(resolve, 1500));
}

async function submitLoginForm(page, passwordSelector) {
    await page.keyboard.press('Enter');
    await waitForLoginTransition(page, 5000);

    let state = await detectLoginState(page);
    if (!state.hasPasswordInput || state.needsTwoFactor || state.authFailed) return state;

    const clicked = await page.evaluate(() => {
        function visible(node) {
            const style = window.getComputedStyle(node);
            const rect = node.getBoundingClientRect();
            return style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 0 && rect.height > 0;
        }
        const candidates = Array.from(document.querySelectorAll('button, input[type="submit"], [role="button"]')).filter(visible);
        const submit = candidates.find(node => {
            const text = `${node.innerText || ''} ${node.value || ''} ${node.getAttribute('aria-label') || ''}`;
            return /log\s*in|sign\s*in|submit/i.test(text);
        }) || candidates[0];
        if (!submit) return false;
        submit.click();
        return true;
    });

    if (clicked) {
        await waitForLoginTransition(page, 10000);
        state = await detectLoginState(page);
        if (!state.hasPasswordInput || state.needsTwoFactor || state.authFailed) return state;
    }

    await page.$eval(passwordSelector, input => {
        const form = input.closest('form');
        if (!form) return;
        if (form.requestSubmit) form.requestSubmit();
        else form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await waitForLoginTransition(page, 10000);
    return detectLoginState(page);
}

export async function loginForCookie() {
    const username = requiredEnv('FORKABLE_USERNAME');
    const password = requiredEnv('FORKABLE_PASSWORD');
    const { default: puppeteer } = await import('puppeteer');

    const browser = await puppeteer.launch({
        headless: process.env.FORKABLE_LOGIN_HEADLESS === 'false' ? false : 'new',
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || DEFAULT_CHROME_EXECUTABLE,
        args: ['--disable-dev-shm-usage']
    });

    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 900 });
        await page.goto(process.env.FORKABLE_LOGIN_URL || DEFAULT_LOGIN_URL, {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });

        const emailSelector = await firstVisibleSelector(page, [
            'input[type="email"]', 'input[name*="email" i]', 'input[autocomplete="email"]', 'input[placeholder*="email" i]'
        ]);
        await fillInputValue(page, emailSelector, username);

        const passwordSelector = await firstVisibleSelector(page, [
            'input[type="password"]', 'input[name*="password" i]', 'input[autocomplete="current-password"]', 'input[placeholder*="password" i]'
        ]);
        await fillInputValue(page, passwordSelector, password);

        const state = await submitLoginForm(page, passwordSelector);
        if (state.needsTwoFactor) {
            throw new Error('Forkable login is asking for 2FA/verification code; password-only login is not enough.');
        }
        if (state.authFailed || state.hasPasswordInput) {
            throw new Error(`Forkable login did not complete. Page: ${state.textPreview}`);
        }

        const cookies = await page.cookies('https://forkable.com', 'https://forkable.com/fpp/');
        const cookieHeader = cookies
            .filter(cookie => cookie.name && cookie.value && !cookie.sessionStorage)
            .map(cookie => `${cookie.name}=${cookie.value}`)
            .join('; ');

        if (!cookieHeader) {
            throw new Error('Forkable login completed, but no cookies were available to replay.');
        }
        return cookieHeader;
    } finally {
        await browser.close();
    }
}

async function readCookieFromFirestore() {
    const { initializeApp, getApps } = await import('firebase/app');
    const { getFirestore, doc, getDoc } = await import('firebase/firestore');

    const firebaseConfig = {
        apiKey: 'AIzaSyCj__TCfYSF-1y4uR-UOId_aPWWwy4-W5A',
        authDomain: 'hscaterhub.firebaseapp.com',
        projectId: 'hscaterhub'
    };

    const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const snap = await getDoc(doc(db, 'system', 'crawlers'));
    const cookie = snap.exists() ? snap.data()?.Forkable?.cookie : null;

    if (!cookie) {
        throw new Error('No Forkable cookie found in Firestore at system/crawlers.Forkable.cookie');
    }
    return cookie;
}

export async function resolveCookie() {
    if (process.env.FORKABLE_COOKIE) {
        return { value: process.env.FORKABLE_COOKIE, source: 'env' };
    }
    if (process.env.FORKABLE_USERNAME || process.env.FORKABLE_PASSWORD || process.env.FORKABLE_COOKIE_SOURCE === 'login') {
        return { value: await loginForCookie(), source: 'login' };
    }
    if (process.env.FORKABLE_COOKIE_SOURCE === 'firestore') {
        return { value: await readCookieFromFirestore(), source: 'firestore' };
    }
    throw new Error('Set FORKABLE_USERNAME and FORKABLE_PASSWORD, or set FORKABLE_COOKIE.');
}

export function buildHeaders(cookie) {
    const headers = {
        'accept': 'application/json',
        'content-type': 'application/json',
        'cookie': cookie,
        'forkable-referrer': process.env.FORKABLE_REFERRER || 'fpp',
        'origin': process.env.FORKABLE_ORIGIN || 'https://forkable.com',
        'referer': process.env.FORKABLE_REFERER || 'https://forkable.com/fpp/'
    };
    if (process.env.FORKABLE_CSRF_TOKEN) headers['x-csrf-token'] = process.env.FORKABLE_CSRF_TOKEN;
    if (process.env.FORKABLE_EXTRA_HEADERS) Object.assign(headers, JSON.parse(process.env.FORKABLE_EXTRA_HEADERS));
    return headers;
}

/** POST a GraphQL body ({query, variables}) and return the parsed payload root. Throws on transport/HTTP/GraphQL errors. */
export async function postGraphql({ body, cookie, endpoint = process.env.FORKABLE_GRAPHQL_URL || DEFAULT_GRAPHQL_URL }) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), Number(process.env.FORKABLE_GRAPHQL_TIMEOUT_MS || DEFAULT_REQUEST_TIMEOUT_MS));

    let response;
    try {
        response = await fetch(endpoint, {
            method: 'POST',
            headers: buildHeaders(cookie),
            body: JSON.stringify(body),
            signal: controller.signal
        });
    } catch (error) {
        throw new Error(`Forkable GraphQL request could not reach ${endpoint} (${error.name})`);
    } finally {
        clearTimeout(timeout);
    }

    const text = await response.text();
    let payload;
    try {
        payload = JSON.parse(text);
    } catch {
        throw new Error(`Forkable GraphQL returned non-JSON (HTTP ${response.status}): ${text.slice(0, 300)}`);
    }

    const root = Array.isArray(payload) ? payload[0] : payload;
    if (!response.ok || root?.errors) {
        const messages = (root?.errors || []).map(e => e?.message || String(e)).join('\n') || text.slice(0, 300);
        if (/unauthorized|forbidden|not authenticated|sign in|login/i.test(messages)) {
            throw new Error(`AUTH_FAILED: Forkable session rejected. Refresh credentials.\n${messages}`);
        }
        throw new Error(`Forkable GraphQL error (HTTP ${response.status}): ${messages}`);
    }
    return root;
}
