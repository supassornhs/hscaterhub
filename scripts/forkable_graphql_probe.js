import fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

const DEFAULT_GRAPHQL_URL = 'https://forkable.com/api/v2/graphql';
const DEFAULT_LOGIN_URL = 'https://forkable.com/fpp/';
const DEFAULT_CHROME_EXECUTABLE = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const DEFAULT_REQUEST_TIMEOUT_MS = 60000;
const MAX_VALIDATION_ISSUES = 25;

const PICKUPS_QUERY = `
query PickupsForVenue($venueId: Int!, $weekOf: String!) {
  pickupsForVenue(venueId: $venueId, weekOf: $weekOf) {
    id
    forPickupAt
    pickupTimeAt
    completedAt
    balanceWithoutChangeRequests
    balanceWithChangeRequests
    dayBeforeConfirmedAt
    dayBeforeRejectedAt
    courierName
    rejectType
    rejectNote
    isVenueOrderEmailSent
    isFamily
    isBuffet
    isSpecialPm
    isPreordered
    familyDayBeforeConfirmedAt
    familyDayBeforeRejectedAt
    familyRejectType
    familyRejectNote
    buffetDayBeforeConfirmedAt
    buffetDayBeforeRejectedAt
    buffetRejectType
    buffetRejectNote
    serviceWindow {
      name
    }
    venue {
      paymentFrequency
      legacyInfo
    }
    totalByOrderType {
      totalSubTotalWithChangeRequest
      totalSubTotalPreChangeRequest
    }
    orders {
      id
      forClassic
      forFamily
      forBuffet
      forSpecialPm
      totalItems
      totalItemsWithChangeRequests
      groupLabel
      utensils
      totalUtensils
      mealGroups {
        label
        value
      }
      totalUtensilsWithChangeRequests
      totalUtensilsWithoutChangeRequests
      totalItemsWithoutChangeRequests
      state
      totalContainers
      totalConfirmedPieces
      isSplitted
      orderSplitTotalOrders
      orderSplitGroupIndex
      club {
        name
        utensils
      }
      changeRequest {
        isPending
        sentAt
        lateReplacementSentAt
        isLateReplacementPending
      }
      pieces {
        id
        name
        price
        userFullName
        instructions
        isAddition
        isRemoval
        isVenueReplacement
        requestStatus
        totalContainers
        flowType
        attributes {
          label
          value
        }
        menuItem {
          feedings
          minQuantity
        }
      }
      tableware {
        utensils {
          enabled
          quantity
          quantityOverride
          subTotal
          subTotalPerItem
        }
        plates {
          enabled
          quantity
          quantityOverride
          subTotal
          subTotalPerItem
        }
        napkins {
          enabled
          quantity
          quantityOverride
          subTotal
          subTotalPerItem
        }
        servingUtensils {
          enabled
          quantity
          quantityOverride
          subTotal
          subTotalPerItem
        }
        tentCards {
          enabled
          quantity
          quantityOverride
          subTotal
          subTotalPerItem
        }
      }
      delivery {
        id
        isBuffetSplit
        buffetConfirmedAt
        buffetRejectedAt
        groupOrderUuid
        state
        primaryOrder {
          id
        }
      }
      unconfirmedAdditionalPieces {
        id
      }
      unconfirmedRemovedPieces {
        id
      }
    }
    changeRequests {
      isPending
      isConfirmed
      isRejected
      sentAt
      lateReplacementSentAt
      orderId
      isLateReplacementPending
      isLateReplacementConfirmed
      isLateReplacementRejected
      changes {
        piece {
          id
          name
          price
          userFullName
          instructions
          isAddition
          isRemoval
          flowType
          attributes {
            label
            value
          }
        }
      }
    }
  }
}
`;

function currentWeekMonday() {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  return monday.toISOString().slice(0, 10);
}

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

function parseIsoDate(value, name) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) {
    throw new ProbeError('CONFIG_INVALID', `${name} must be YYYY-MM-DD`, { value });
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || isoDate(date) !== value) {
    throw new ProbeError('CONFIG_INVALID', `${name} is not a real calendar date`, { value });
  }

  return date;
}

function addDays(date, days) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function startOfWeekMonday(date) {
  const day = date.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  return addDays(date, diff);
}

function parseMonth(value) {
  if (!/^\d{4}-\d{2}$/.test(value || '')) {
    throw new ProbeError('CONFIG_INVALID', 'FORKABLE_MONTH must be YYYY-MM', { value });
  }

  const [year, month] = value.split('-').map(Number);
  if (month < 1 || month > 12) {
    throw new ProbeError('CONFIG_INVALID', 'FORKABLE_MONTH must use a month from 01 to 12', { value });
  }

  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 0));
  return { start, end };
}

function listWeekStartsForRange(start, end) {
  const weeks = [];
  for (let cursor = startOfWeekMonday(start); cursor <= end; cursor = addDays(cursor, 7)) {
    weeks.push(isoDate(cursor));
  }
  return weeks;
}

function buildDateWindow() {
  if (process.env.FORKABLE_MONTH) {
    const { start, end } = parseMonth(process.env.FORKABLE_MONTH);
    return {
      label: `month:${process.env.FORKABLE_MONTH}`,
      startDate: isoDate(start),
      endDate: isoDate(end),
      weeks: listWeekStartsForRange(start, end)
    };
  }

  const hasRangeConfig = Boolean(
    process.env.FORKABLE_START_DATE ||
    process.env.FORKABLE_END_DATE ||
    process.env.FORKABLE_LOOKBACK_DAYS ||
    process.env.FORKABLE_LOOKBACK_WEEKS
  );

  if (!hasRangeConfig) {
    const weekOf = process.env.FORKABLE_WEEK_OF || currentWeekMonday();
    const start = parseIsoDate(weekOf, 'FORKABLE_WEEK_OF');
    return {
      label: `week:${weekOf}`,
      startDate: isoDate(start),
      endDate: isoDate(addDays(start, 6)),
      weeks: [weekOf]
    };
  }

  const end = process.env.FORKABLE_END_DATE
    ? parseIsoDate(process.env.FORKABLE_END_DATE, 'FORKABLE_END_DATE')
    : new Date(`${isoDate(new Date())}T00:00:00.000Z`);
  let start;

  if (process.env.FORKABLE_START_DATE) {
    start = parseIsoDate(process.env.FORKABLE_START_DATE, 'FORKABLE_START_DATE');
  } else if (process.env.FORKABLE_LOOKBACK_WEEKS) {
    const weeks = Number(process.env.FORKABLE_LOOKBACK_WEEKS);
    if (!Number.isInteger(weeks) || weeks < 1 || weeks > 26) {
      throw new ProbeError('CONFIG_INVALID', 'FORKABLE_LOOKBACK_WEEKS must be an integer from 1 to 26');
    }
    start = addDays(end, -(weeks * 7 - 1));
  } else {
    const days = Number(process.env.FORKABLE_LOOKBACK_DAYS || 31);
    if (!Number.isInteger(days) || days < 1 || days > 366) {
      throw new ProbeError('CONFIG_INVALID', 'FORKABLE_LOOKBACK_DAYS must be an integer from 1 to 366');
    }
    start = addDays(end, -(days - 1));
  }

  if (start > end) {
    throw new ProbeError('CONFIG_INVALID', 'FORKABLE_START_DATE cannot be after FORKABLE_END_DATE', {
      startDate: isoDate(start),
      endDate: isoDate(end)
    });
  }

  return {
    label: process.env.FORKABLE_START_DATE || process.env.FORKABLE_END_DATE
      ? 'custom-range'
      : process.env.FORKABLE_LOOKBACK_WEEKS
        ? `lookback-weeks:${process.env.FORKABLE_LOOKBACK_WEEKS}`
        : `lookback-days:${process.env.FORKABLE_LOOKBACK_DAYS || 31}`,
    startDate: isoDate(start),
    endDate: isoDate(end),
    weeks: listWeekStartsForRange(start, end)
  };
}

class ProbeError extends Error {
  constructor(code, message, details = {}, cause = null) {
    super(message);
    this.name = 'ProbeError';
    this.code = code;
    this.details = details;
    this.cause = cause;
  }
}

function classifyHttpFailure(status, payload) {
  if (status === 401 || status === 403) {
    return 'AUTH_FAILED';
  }
  if (status === 404 || status === 405 || status === 410) {
    return 'ENDPOINT_CHANGED';
  }
  if (status === 400 || status === 422) {
    return 'REQUEST_SHAPE_CHANGED';
  }
  if (status === 429) {
    return 'RATE_LIMITED';
  }
  if (status >= 500) {
    return 'UPSTREAM_FAILED';
  }
  if (payload?.httpErrorCode === 401 || payload?.httpErrorCode === 403) {
    return 'AUTH_FAILED';
  }
  return 'GRAPHQL_REQUEST_FAILED';
}

function classifyGraphqlErrors(errors) {
  const messages = (errors || []).map(error => error?.message || String(error));
  const combined = messages.join('\n');

  if (/unauthorized|forbidden|not authenticated|sign in|login/i.test(combined)) {
    return 'AUTH_FAILED';
  }
  if (/cannot query field|unknown argument|doesn't accept argument|expected type|field .* is not defined|variable .* was provided invalid value/i.test(combined)) {
    return 'QUERY_SCHEMA_CHANGED';
  }

  return 'GRAPHQL_ERROR';
}

function failPayload(error) {
  return {
    ok: false,
    code: error.code || 'UNEXPECTED_ERROR',
    message: error.message,
    details: error.details || {}
  };
}

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new ProbeError('CONFIG_INVALID', `Missing required env var: ${name}`);
  }
  return value;
}

function optionalJsonEnv(name, fallback) {
  if (!process.env[name]) {
    return fallback;
  }

  return JSON.parse(process.env[name]);
}

async function firstVisibleSelector(page, selectors, timeout = 15000) {
  const deadline = Date.now() + timeout;

  while (Date.now() < deadline) {
    for (const selector of selectors) {
      const element = await page.$(selector);
      if (!element) {
        continue;
      }

      const visible = await element.evaluate(node => {
        const style = window.getComputedStyle(node);
        const rect = node.getBoundingClientRect();
        return style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 0 && rect.height > 0;
      });

      if (visible) {
        return selector;
      }
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
    const needsTwoFactor = [
      'two-factor',
      'two factor',
      '2-factor',
      'verification code',
      'authentication code',
      'one-time code'
    ].some(term => normalized.includes(term));
    const authFailed = [
      'invalid email',
      'invalid password',
      'incorrect email',
      'incorrect password',
      'login failed',
      'sign in failed'
    ].some(term => normalized.includes(term));

    return {
      url: window.location.href,
      hasEmailInput,
      hasPasswordInput,
      needsTwoFactor,
      authFailed,
      title: document.title,
      textPreview: text.slice(0, 240)
    };
  });
}

async function fillInputValue(page, selector, value) {
  await page.$eval(selector, (input, nextValue) => {
    input.focus();
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.value = nextValue;
    input.dispatchEvent(new InputEvent('input', {
      bubbles: true,
      cancelable: true,
      inputType: 'insertText',
      data: nextValue
    }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }, value);
}

async function waitForLoginTransition(page, timeout = 10000) {
  const navigation = page.waitForNavigation({ waitUntil: 'networkidle2', timeout }).catch(() => null);
  await Promise.race([
    navigation,
    new Promise(resolve => setTimeout(resolve, timeout))
  ]);
  await new Promise(resolve => setTimeout(resolve, 1500));
}

async function submitLoginForm(page, passwordSelector) {
  await page.keyboard.press('Enter');
  await waitForLoginTransition(page, 5000);

  let state = await detectLoginState(page);
  if (!state.hasPasswordInput || state.needsTwoFactor || state.authFailed) {
    return state;
  }

  const clicked = await page.evaluate(() => {
    function visible(node) {
      const style = window.getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 0 && rect.height > 0;
    }

    const candidates = Array.from(document.querySelectorAll('button, input[type="submit"], [role="button"]'))
      .filter(visible);
    const submit = candidates.find(node => {
      const text = `${node.innerText || ''} ${node.value || ''} ${node.getAttribute('aria-label') || ''}`;
      return /log\s*in|sign\s*in|submit/i.test(text);
    }) || candidates[0];

    if (!submit) {
      return false;
    }

    submit.click();
    return true;
  });

  if (clicked) {
    await waitForLoginTransition(page, 10000);
    state = await detectLoginState(page);
    if (!state.hasPasswordInput || state.needsTwoFactor || state.authFailed) {
      return state;
    }
  }

  await page.$eval(passwordSelector, input => {
    const form = input.closest('form');
    if (!form) {
      return;
    }

    if (form.requestSubmit) {
      form.requestSubmit();
    } else {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    }
  });
  await waitForLoginTransition(page, 10000);
  return detectLoginState(page);
}

async function loginForCookie() {
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
      'input[type="email"]',
      'input[name*="email" i]',
      'input[autocomplete="email"]',
      'input[placeholder*="email" i]'
    ]);
    await fillInputValue(page, emailSelector, username);

    const passwordSelector = await firstVisibleSelector(page, [
      'input[type="password"]',
      'input[name*="password" i]',
      'input[autocomplete="current-password"]',
      'input[placeholder*="password" i]'
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

async function resolveCookie() {
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

function buildBody(query, variables) {
  const body = {
    operationName: process.env.FORKABLE_GRAPHQL_OPERATION_NAME || 'PickupsForVenue',
    query,
    variables
  };

  if (process.env.FORKABLE_GRAPHQL_ARRAY_BODY === 'true') {
    return JSON.stringify([body]);
  }

  return JSON.stringify(body);
}

function buildInlinePickupsBody(venueId, weekOf) {
  const inlineQuery = PICKUPS_QUERY
    .replace('query PickupsForVenue($venueId: Int!, $weekOf: String!) {', 'query {')
    .replace(
      'pickupsForVenue(venueId: $venueId, weekOf: $weekOf)',
      `pickupsForVenue (venueId: ${venueId}, weekOf: ${JSON.stringify(weekOf)})`
    );

  return JSON.stringify({
    query: inlineQuery,
    variables: {}
  });
}

function buildGraphqlRequest(venueId, weekOf) {
  if (process.env.FORKABLE_GRAPHQL_BODY_FILE) {
    const body = fs.readFileSync(process.env.FORKABLE_GRAPHQL_BODY_FILE, 'utf8');
    JSON.parse(body);
    return {
      body,
      requestLabel: process.env.FORKABLE_GRAPHQL_BODY_FILE
    };
  }

  if (process.env.FORKABLE_GRAPHQL_BODY_MODE !== 'variables') {
    return {
      body: buildInlinePickupsBody(venueId, weekOf),
      requestLabel: 'built-in pickupsForVenue inline query'
    };
  }

  const query = process.env.FORKABLE_GRAPHQL_QUERY_FILE
    ? fs.readFileSync(process.env.FORKABLE_GRAPHQL_QUERY_FILE, 'utf8')
    : PICKUPS_QUERY;
  const variables = optionalJsonEnv('FORKABLE_GRAPHQL_VARIABLES', { venueId, weekOf });

  return {
    body: buildBody(query, variables),
    requestLabel: process.env.FORKABLE_GRAPHQL_QUERY_FILE || 'built-in pickupsForVenue query'
  };
}

function buildHeaders(cookie) {
  const headers = {
    'accept': 'application/json',
    'content-type': 'application/json',
    'cookie': cookie,
    'forkable-referrer': process.env.FORKABLE_REFERRER || 'fpp',
    'origin': process.env.FORKABLE_ORIGIN || 'https://forkable.com',
    'referer': process.env.FORKABLE_REFERER || 'https://forkable.com/fpp/'
  };

  if (process.env.FORKABLE_CSRF_TOKEN) {
    headers['x-csrf-token'] = process.env.FORKABLE_CSRF_TOKEN;
  }

  if (process.env.FORKABLE_EXTRA_HEADERS) {
    const extra = JSON.parse(process.env.FORKABLE_EXTRA_HEADERS);
    Object.assign(headers, extra);
  }

  return headers;
}

function subtotalCents(pickup, field) {
  const rows = Array.isArray(pickup?.totalByOrderType)
    ? pickup.totalByOrderType
    : pickup?.totalByOrderType
      ? [pickup.totalByOrderType]
      : [];

  return rows.reduce((sum, row) => sum + (Number(row?.[field]) || 0), 0);
}

function serviceWindowName(pickup) {
  return pickup?.serviceWindow?.name || 'unknown';
}

function createRollup() {
  return {
    pickups: 0,
    orders: 0,
    pieces: 0,
    items: 0,
    subtotalCents: 0,
    subtotalPreChangeRequestCents: 0,
    subtotalWithChangeRequestCents: 0,
    subtotalSource: 'totalSubTotalWithChangeRequest',
    pickupIds: []
  };
}

function addPickupToRollup(rollup, pickup) {
  const orders = pickup.orders || [];

  rollup.pickups += 1;
  rollup.orders += orders.length;
  rollup.pieces += orders.reduce((sum, order) => sum + (order.pieces?.length || 0), 0);
  rollup.items += orders.reduce((sum, order) => sum + (Number(order.totalItems) || 0), 0);
  rollup.subtotalCents += subtotalCents(pickup, 'totalSubTotalWithChangeRequest');
  rollup.subtotalPreChangeRequestCents += subtotalCents(pickup, 'totalSubTotalPreChangeRequest');
  rollup.subtotalWithChangeRequestCents += subtotalCents(pickup, 'totalSubTotalWithChangeRequest');
  rollup.pickupIds.push(pickup.id);
}

function mergeRollup(target, source) {
  target.pickups += source.pickups;
  target.orders += source.orders;
  target.pieces += source.pieces;
  target.items += source.items;
  target.subtotalCents += source.subtotalCents;
  target.subtotalPreChangeRequestCents += source.subtotalPreChangeRequestCents;
  target.subtotalWithChangeRequestCents += source.subtotalWithChangeRequestCents;
  target.pickupIds.push(...source.pickupIds);
}

function summarizeByDayAndWindow(payload) {
  const root = Array.isArray(payload) ? payload[0] : payload;
  const pickups = root?.data?.pickupsForVenue || [];
  const days = {};

  pickups.forEach(pickup => {
    const date = pickupIsoDate(pickup);
    if (!date) {
      return;
    }

    const windowName = serviceWindowName(pickup);
    days[date] ||= { totals: createRollup(), windows: {} };
    days[date].windows[windowName] ||= createRollup();

    addPickupToRollup(days[date].totals, pickup);
    addPickupToRollup(days[date].windows[windowName], pickup);
  });

  return days;
}

function summarize(payload) {
  const root = Array.isArray(payload) ? payload[0] : payload;
  const pickups = root?.data?.pickupsForVenue || [];
  const orders = pickups.flatMap(pickup => pickup.orders || []);
  const pieceCount = orders.reduce((sum, order) => sum + (order.pieces?.length || 0), 0);
  const subtotalPreChangeRequestCents = pickups.reduce(
    (sum, pickup) => sum + subtotalCents(pickup, 'totalSubTotalPreChangeRequest'),
    0
  );
  const subtotalWithChangeRequestCents = pickups.reduce(
    (sum, pickup) => sum + subtotalCents(pickup, 'totalSubTotalWithChangeRequest'),
    0
  );

  return {
    pickups: pickups.length,
    orders: orders.length,
    pieces: pieceCount,
    items: orders.reduce((sum, order) => sum + (Number(order.totalItems) || 0), 0),
    subtotalCents: subtotalWithChangeRequestCents,
    subtotalSource: 'totalSubTotalWithChangeRequest',
    subtotalPreChangeRequestCents,
    subtotalWithChangeRequestCents,
    pickupIds: pickups.slice(0, 10).map(pickup => pickup.id),
    firstPickupAt: pickups[0]?.forPickupAt || null,
    days: summarizeByDayAndWindow(payload)
  };
}

function compactSummary(summary) {
  const { days, ...rest } = summary;
  return rest;
}

function mergeDays(target, source) {
  Object.entries(source).forEach(([date, day]) => {
    target[date] ||= { totals: createRollup(), windows: {} };
    mergeRollup(target[date].totals, day.totals);

    Object.entries(day.windows).forEach(([windowName, rollup]) => {
      target[date].windows[windowName] ||= createRollup();
      mergeRollup(target[date].windows[windowName], rollup);
    });
  });
}

function weekBounds(weekOf) {
  const start = parseIsoDate(weekOf, 'weekOf');
  return {
    startDate: isoDate(start),
    endDate: isoDate(addDays(start, 6))
  };
}

function intersectBounds(left, right) {
  return {
    startDate: left.startDate > right.startDate ? left.startDate : right.startDate,
    endDate: left.endDate < right.endDate ? left.endDate : right.endDate
  };
}

function manualForkableWeekUrl({ ownerId, venueId, weekOf }) {
  return `https://forkable.com/fpp/${ownerId}/${weekOf}/${venueId}`;
}

function buildWeekBreakdown({ results, dateWindow, ownerId, venueId }) {
  const requestedBounds = {
    startDate: dateWindow.startDate,
    endDate: dateWindow.endDate
  };

  return results.map(result => {
    const forkableWeek = weekBounds(result.weekOf);
    const includedDateWindow = intersectBounds(forkableWeek, requestedBounds);

    return {
      weekOf: result.weekOf,
      forkableWeek,
      includedDateWindow,
      manualUrl: manualForkableWeekUrl({ ownerId, venueId, weekOf: result.weekOf }),
      requestId: result.requestId,
      appVersion: result.appVersion,
      pickupsExcludedByDateFilter: result.pickupsExcludedByDateFilter,
      fetchedTotals: compactSummary(result.fetchedSummary),
      includedTotals: compactSummary(result.summary),
      days: result.summary.days
    };
  });
}

function pickupIsoDate(pickup) {
  return typeof pickup?.forPickupAt === 'string' ? pickup.forPickupAt.slice(0, 10) : null;
}

function filterPayloadByDateWindow(payload, dateWindow) {
  const root = rootPayload(payload);
  const pickups = root?.data?.pickupsForVenue;

  if (!Array.isArray(pickups)) {
    return payload;
  }

  const filteredPickups = pickups.filter(pickup => {
    const date = pickupIsoDate(pickup);
    return date && date >= dateWindow.startDate && date <= dateWindow.endDate;
  });

  const filteredRoot = {
    ...root,
    data: {
      ...root.data,
      pickupsForVenue: filteredPickups
    }
  };

  return Array.isArray(payload) ? [filteredRoot] : filteredRoot;
}

function rootPayload(payload) {
  return Array.isArray(payload) ? payload[0] : payload;
}

function typeOf(value) {
  if (value === null) {
    return 'null';
  }
  if (Array.isArray(value)) {
    return 'array';
  }
  return typeof value;
}

function checkType(issues, value, path, allowed) {
  const actual = typeOf(value);
  if (!allowed.includes(actual)) {
    issues.push({ path, expected: allowed.join('|'), actual });
  }
}

function validatePickupsPayload(payload, weekOf) {
  const root = rootPayload(payload);
  const issues = [];

  checkType(issues, root, 'root', ['object']);
  checkType(issues, root?.data, 'data', ['object']);
  checkType(issues, root?.data?.pickupsForVenue, 'data.pickupsForVenue', ['array']);

  const pickups = root?.data?.pickupsForVenue;
  if (!Array.isArray(pickups)) {
    throw new ProbeError('RESPONSE_SHAPE_CHANGED', 'Forkable response no longer contains data.pickupsForVenue[]', {
      weekOf,
      issues
    });
  }

  pickups.forEach((pickup, pickupIndex) => {
    const pickupPath = `data.pickupsForVenue[${pickupIndex}]`;
    checkType(issues, pickup, pickupPath, ['object']);
    checkType(issues, pickup?.id, `${pickupPath}.id`, ['number']);
    checkType(issues, pickup?.forPickupAt, `${pickupPath}.forPickupAt`, ['string']);
    checkType(issues, pickup?.pickupTimeAt, `${pickupPath}.pickupTimeAt`, ['string', 'null']);
    checkType(issues, pickup?.balanceWithoutChangeRequests, `${pickupPath}.balanceWithoutChangeRequests`, ['number', 'null']);
    checkType(issues, pickup?.balanceWithChangeRequests, `${pickupPath}.balanceWithChangeRequests`, ['number', 'null']);
    checkType(issues, pickup?.serviceWindow, `${pickupPath}.serviceWindow`, ['object', 'null']);
    checkType(issues, pickup?.venue, `${pickupPath}.venue`, ['object', 'null']);
    checkType(issues, pickup?.totalByOrderType, `${pickupPath}.totalByOrderType`, ['object', 'array', 'null']);
    checkType(issues, pickup?.orders, `${pickupPath}.orders`, ['array']);
    checkType(issues, pickup?.changeRequests, `${pickupPath}.changeRequests`, ['array']);

    if (Array.isArray(pickup?.orders)) {
      pickup.orders.forEach((order, orderIndex) => {
        const orderPath = `${pickupPath}.orders[${orderIndex}]`;
        checkType(issues, order, orderPath, ['object']);
        checkType(issues, order?.id, `${orderPath}.id`, ['number']);
        checkType(issues, order?.totalItems, `${orderPath}.totalItems`, ['number', 'null']);
        checkType(issues, order?.pieces, `${orderPath}.pieces`, ['array']);
        checkType(issues, order?.delivery, `${orderPath}.delivery`, ['object', 'null']);
        checkType(issues, order?.tableware, `${orderPath}.tableware`, ['object', 'null']);

        if (Array.isArray(order?.pieces)) {
          order.pieces.forEach((piece, pieceIndex) => {
            const piecePath = `${orderPath}.pieces[${pieceIndex}]`;
            checkType(issues, piece, piecePath, ['object']);
            checkType(issues, piece?.id, `${piecePath}.id`, ['number', 'string']);
            checkType(issues, piece?.name, `${piecePath}.name`, ['string', 'null']);
            checkType(issues, piece?.price, `${piecePath}.price`, ['number', 'null']);
            checkType(issues, piece?.attributes, `${piecePath}.attributes`, ['array', 'null']);
          });
        }
      });
    }
  });

  if (issues.length > 0) {
    throw new ProbeError('RESPONSE_SHAPE_CHANGED', 'Forkable response JSON shape changed', {
      weekOf,
      issues: issues.slice(0, MAX_VALIDATION_ISSUES),
      issueCount: issues.length
    });
  }
}

async function fetchWeek({ endpoint, cookie, venueId, weekOf, dateWindow }) {
  const graphqlRequest = buildGraphqlRequest(venueId, weekOf);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), Number(process.env.FORKABLE_GRAPHQL_TIMEOUT_MS || DEFAULT_REQUEST_TIMEOUT_MS));
  let response;

  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: buildHeaders(cookie.value),
      body: graphqlRequest.body,
      signal: controller.signal
    });
  } catch (error) {
    throw new ProbeError(
      error.name === 'AbortError' ? 'ENDPOINT_TIMEOUT' : 'ENDPOINT_UNREACHABLE',
      `Forkable GraphQL request could not reach ${endpoint}`,
      { endpoint, weekOf, errorName: error.name },
      error
    );
  } finally {
    clearTimeout(timeout);
  }

  const text = await response.text();
  let payload;
  try {
    payload = JSON.parse(text);
  } catch {
    throw new ProbeError('ENDPOINT_CHANGED', 'Forkable GraphQL returned non-JSON response', {
      endpoint,
      weekOf,
      httpStatus: response.status,
      contentType: response.headers.get('content-type'),
      bodyPreview: text.slice(0, 500)
    });
  }

  const root = rootPayload(payload);
  if (!response.ok || root?.errors) {
    const code = root?.errors ? classifyGraphqlErrors(root.errors) : classifyHttpFailure(response.status, payload);
    throw new ProbeError(code, 'Forkable GraphQL request failed', {
      endpoint,
      weekOf,
      httpStatus: response.status,
      errors: root?.errors || payload
    });
  }

  validatePickupsPayload(payload, weekOf);

  const filteredPayload = filterPayloadByDateWindow(payload, dateWindow);
  const fetchedSummary = summarize(payload);
  const summary = summarize(filteredPayload);

  return {
    weekOf,
    request: graphqlRequest.requestLabel,
    httpStatus: response.status,
    requestId: response.headers.get('x-request-id'),
    appVersion: response.headers.get('x-app-version'),
    payload,
    filteredPayload,
    fetchedSummary,
    summary,
    pickupsExcludedByDateFilter: fetchedSummary.pickups - summary.pickups
  };
}

async function main() {
  const endpoint = process.env.FORKABLE_GRAPHQL_URL || DEFAULT_GRAPHQL_URL;
  const cookie = await resolveCookie();
  const ownerId = Number(process.env.FORKABLE_OWNER_ID || 2297);
  const venueId = Number(process.env.FORKABLE_VENUE_ID || 17201);
  const dateWindow = buildDateWindow();
  const weeks = dateWindow.weeks;
  const startedAt = new Date().toISOString();
  const results = [];

  if (!Number.isInteger(venueId)) {
    throw new ProbeError('CONFIG_INVALID', `FORKABLE_VENUE_ID must be an integer, got: ${process.env.FORKABLE_VENUE_ID}`);
  }
  if (!Number.isInteger(ownerId)) {
    throw new ProbeError('CONFIG_INVALID', `FORKABLE_OWNER_ID must be an integer, got: ${process.env.FORKABLE_OWNER_ID}`);
  }

  for (const weekOf of weeks) {
    try {
      results.push(await fetchWeek({ endpoint, cookie, venueId, weekOf, dateWindow }));
    } catch (error) {
      if (error instanceof ProbeError) {
        error.details = {
          ...error.details,
          failedWeekOf: weekOf,
          weeksRequested: weeks
        };
      }
      throw error;
    }
  }

  const totals = results.reduce((sum, result) => ({
    pickups: sum.pickups + result.summary.pickups,
    orders: sum.orders + result.summary.orders,
    pieces: sum.pieces + result.summary.pieces,
    items: sum.items + result.summary.items,
    subtotalCents: sum.subtotalCents + result.summary.subtotalCents,
    subtotalSource: 'totalSubTotalWithChangeRequest',
    subtotalPreChangeRequestCents: sum.subtotalPreChangeRequestCents + result.summary.subtotalPreChangeRequestCents,
    subtotalWithChangeRequestCents: sum.subtotalWithChangeRequestCents + result.summary.subtotalWithChangeRequestCents
  }), {
    pickups: 0,
    orders: 0,
    pieces: 0,
    items: 0,
    subtotalCents: 0,
    subtotalSource: 'totalSubTotalWithChangeRequest',
    subtotalPreChangeRequestCents: 0,
    subtotalWithChangeRequestCents: 0
  });
  const days = {};
  results.forEach(result => mergeDays(days, result.summary.days));
  const weekBreakdown = buildWeekBreakdown({ results, dateWindow, ownerId, venueId });

  const rawOutput = process.env.FORKABLE_RAW_OUT
    ? {
        endpoint,
        venueId,
        dateWindow,
        weeks: results.map(result => ({
          weekOf: result.weekOf,
          payload: result.payload,
          filteredPayload: result.filteredPayload
        }))
      }
    : null;

  if (process.env.FORKABLE_RAW_OUT) {
    fs.writeFileSync(process.env.FORKABLE_RAW_OUT, JSON.stringify(rawOutput, null, 2));
  }

  console.log(JSON.stringify({
    ok: true,
    endpoint,
    cookieSource: cookie.source,
    ownerId,
    venueId,
    dateWindow,
    startedAt,
    completedAt: new Date().toISOString(),
    weeksRequested: weeks,
    totals,
    days,
    report: {
      dateWindow,
      totals,
      days,
      weekBreakdown
    },
    weeks: results.map(result => ({
      weekOf: result.weekOf,
      request: result.request,
      httpStatus: result.httpStatus,
      requestId: result.requestId,
      appVersion: result.appVersion,
      pickupsExcludedByDateFilter: result.pickupsExcludedByDateFilter,
      ...compactSummary(result.summary)
    })),
    rawSavedTo: process.env.FORKABLE_RAW_OUT || null
  }, null, 2));
}

main().catch(error => {
  const payload = error instanceof ProbeError
    ? failPayload(error)
    : failPayload(new ProbeError('UNEXPECTED_ERROR', error.message || String(error)));
  console.error(JSON.stringify(payload, null, 2));
  process.exit(1);
});
