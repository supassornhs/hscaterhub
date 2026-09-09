/**
 * forkable_export.js — Turn Forkable GraphQL data into a clean tabulated workbook.
 *
 * Usage:
 *   node automations/forkable/forkable_export.js <raw-json-path> [out.xlsx]
 *
 * Typical flow (probe first, then export):
 *   FORKABLE_RAW_OUT=scratch/forkable_latest_raw.json node automations/forkable/forkable_graphql_probe.js
 *   node automations/forkable/forkable_export.js scratch/forkable_latest_raw.json
 *
 * Workbook layout (summary first, drill down as needed):
 *   Sheet 1 "Summary"     — totals for the whole window, plus per-service-window breakdown.
 *   Sheet 2 "Weekly"      — one row per week.
 *   Sheet 3 "Daily"       — one row per pickup day/session.
 *   Sheet 4 "Orders"      — one row per order (client, group, items, subtotal, state).
 *   Sheet 5 "Line Items"  — one row per individual dish (who ordered, price, notes).
 */

import fs from 'fs';
import * as XLSX from 'xlsx';

const rawPath = process.argv[2];
if (!rawPath) {
    console.error('Usage: node automations/forkable/forkable_export.js <raw-json-path> [out.xlsx]');
    process.exit(1);
}
if (!fs.existsSync(rawPath)) {
    console.error(`❌ Raw file not found: ${rawPath}`);
    process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(rawPath, 'utf8'));
const outPath = process.argv[3]
    || rawPath.replace(/_raw\.json$/i, '').replace(/\.json$/i, '') + '.xlsx';

const cents = (v) => (typeof v === 'number' ? v / 100 : null);
const r2 = (v) => (typeof v === 'number' ? Math.round(v * 100) / 100 : null);

function localDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    const ymd = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const dow = d.toLocaleDateString('en-US', { weekday: 'short' });
    return `${ymd} (${dow})`; // ISO-first so sheets sort chronologically
}

function orderType(o) {
    if (o.forFamily) return 'Family';
    if (o.forBuffet) return 'Buffet';
    if (o.forSpecialPm) return 'Special PM';
    return 'Classic';
}

function pieceFlags(p) {
    const flags = [];
    if (p.isAddition) flags.push('ADDITION');
    if (p.isRemoval) flags.push('REMOVAL');
    if (p.isVenueReplacement) flags.push('VENUE REPLACEMENT');
    if (p.requestStatus) flags.push(`req:${p.requestStatus}`);
    return flags.join(', ');
}

// ---- Flatten into pickup/order/item rows ------------------------------------
const pickupRows = []; // per pickup (a dated session)
const orderRows = [];  // per order
const itemRows = [];   // per piece

for (const week of raw.weeks || []) {
    const pickups = week.filteredPayload?.data?.pickupsForVenue
        || week.payload?.data?.pickupsForVenue
        || [];
    for (const pickup of pickups) {
        const date = localDate(pickup.forPickupAt);
        const window = pickup.serviceWindow?.name || '';
        const orders = pickup.orders || [];

        let nOrders = 0, nItems = 0, nUtensils = 0, subtotalCents = 0;

        for (const o of orders) {
            const pieces = o.pieces || [];
            const activePieces = pieces.filter(p => !p.isRemoval);
            const subtotal = activePieces.reduce((s, p) => s + (typeof p.price === 'number' ? p.price : 0), 0);
            const client = o.club?.name || '';
            const cr = o.changeRequest || {};
            const flags = [
                cr.isPending ? 'CR PENDING' : '',
                cr.isLateReplacementPending ? 'LATE REPLACEMENT PENDING' : '',
                o.isSplitted ? `SPLIT ${(o.orderSplitGroupIndex ?? 0) + 1}/${o.orderSplitTotalOrders}` : ''
            ].filter(Boolean).join(' | ');

            orderRows.push({
                'Date': date,
                'Pickup ID': pickup.id,
                'Service Window': window,
                'Order ID': o.id,
                'Client': client,
                'Group': o.groupLabel || '',
                'Type': orderType(o),
                'State': o.state || '',
                'Items': o.totalItemsWithChangeRequests ?? o.totalItems ?? pieces.length,
                'Utensils': o.totalUtensils ?? 0,
                'Subtotal $': r2(subtotal),
                'Flags': flags
            });

            for (const p of pieces) {
                itemRows.push({
                    'Date': date,
                    'Pickup ID': pickup.id,
                    'Order ID': o.id,
                    'Client': client,
                    'Group': o.groupLabel || '',
                    'Ordered By': p.userFullName || '',
                    'Item': p.name || '',
                    'Price $': p.price ?? null,
                    'Containers': p.totalContainers ?? 1,
                    'Instructions': p.instructions || '',
                    'Flags': pieceFlags(p)
                });
            }

            nOrders += 1;
            nItems += o.totalItemsWithChangeRequests ?? o.totalItems ?? pieces.length;
            nUtensils += o.totalUtensils ?? 0;
            subtotalCents += Math.round(subtotal * 100);
        }

        pickupRows.push({
            weekOf: week.weekOf,
            date,
            window,
            pickupTime: pickup.pickupTimeAt || '',
            completed: pickup.completedAt ? 'YES' : '',
            rejected: pickup.dayBeforeRejectedAt
                ? `YES (${[pickup.rejectType, pickup.rejectNote].filter(Boolean).join(' ')})`.trim()
                : '',
            orders: nOrders,
            items: nItems,
            utensils: nUtensils,
            subtotalCents,
            payoutCents: pickup.balanceWithChangeRequests ?? null
        });
    }
}

pickupRows.sort((a, b) => a.date.localeCompare(b.date) || a.window.localeCompare(b.window));
orderRows.sort((a, b) => String(a['Date']).localeCompare(String(b['Date'])));
itemRows.sort((a, b) => String(a['Date']).localeCompare(String(b['Date'])));

// ---- Aggregate helpers -------------------------------------------------------
function aggregate(rows) {
    const t = rows.reduce((s, r) => ({
        pickups: s.pickups + 1,
        orders: s.orders + r.orders,
        items: s.items + r.items,
        utensils: s.utensils + r.utensils,
        subtotalCents: s.subtotalCents + r.subtotalCents,
        payoutCents: s.payoutCents + (r.payoutCents ?? 0)
    }), { pickups: 0, orders: 0, items: 0, utensils: 0, subtotalCents: 0, payoutCents: 0 });
    t.rate = t.subtotalCents > 0 ? t.payoutCents / t.subtotalCents : null;
    return t;
}

const totals = aggregate(pickupRows);

// ---- Sheet 1: Summary --------------------------------------------------------
const byWindow = {};
for (const r of pickupRows) {
    const k = r.window || '(no window)';
    byWindow[k] = byWindow[k] || [];
    byWindow[k].push(r);
}

const summaryAoA = [
    ['Forkable Extract — Summary'],
    ['Window', `${raw.dateWindow?.startDate} → ${raw.dateWindow?.endDate}`],
    ['Venue ID', raw.venueId],
    ['Generated', new Date().toLocaleString('en-US')],
    [],
    ['Pickup Sessions', totals.pickups],
    ['Orders', totals.orders],
    ['Items', totals.items],
    ['Utensils', totals.utensils],
    ['Subtotal $', r2(cents(totals.subtotalCents))],
    ['Payout $', r2(cents(totals.payoutCents))],
    ['Payout Rate', totals.rate != null ? `${(totals.rate * 100).toFixed(2)}%` : ''],
    [],
    ['By Service Window'],
    ['Service Window', 'Sessions', 'Orders', 'Items', 'Subtotal $', 'Payout $']
];
for (const [name, rows] of Object.entries(byWindow).sort()) {
    const t = aggregate(rows);
    summaryAoA.push([name, t.pickups, t.orders, t.items, r2(cents(t.subtotalCents)), r2(cents(t.payoutCents))]);
}

const wsSummary = XLSX.utils.aoa_to_sheet(summaryAoA);
wsSummary['!cols'] = [{ wch: 22 }, { wch: 28 }, { wch: 10 }, { wch: 10 }, { wch: 12 }, { wch: 12 }];

// ---- Sheet 2: Weekly ---------------------------------------------------------
const byWeek = {};
for (const r of pickupRows) {
    byWeek[r.weekOf] = byWeek[r.weekOf] || [];
    byWeek[r.weekOf].push(r);
}
const weeklyRows = Object.entries(byWeek).sort(([a], [b]) => a.localeCompare(b)).map(([weekOf, rows]) => {
    const t = aggregate(rows);
    return {
        'Week Of': weekOf,
        'Days': t.pickups,
        'Orders': t.orders,
        'Items': t.items,
        'Utensils': t.utensils,
        'Subtotal $': r2(cents(t.subtotalCents)),
        'Payout $': r2(cents(t.payoutCents))
    };
});
weeklyRows.push({
    'Week Of': 'TOTAL',
    'Days': totals.pickups,
    'Orders': totals.orders,
    'Items': totals.items,
    'Utensils': totals.utensils,
    'Subtotal $': r2(cents(totals.subtotalCents)),
    'Payout $': r2(cents(totals.payoutCents))
});

// ---- Sheet 3: Daily ----------------------------------------------------------
const dailyRows = pickupRows.map(r => ({
    'Date': r.date,
    'Service Window': r.window,
    'Pickup Time': r.pickupTime,
    'Orders': r.orders,
    'Items': r.items,
    'Utensils': r.utensils,
    'Subtotal $': r2(cents(r.subtotalCents)),
    'Payout $': r2(cents(r.payoutCents)),
    'Completed': r.completed,
    'Rejected': r.rejected
}));
dailyRows.push({
    'Date': 'TOTAL', 'Service Window': '', 'Pickup Time': '',
    'Orders': totals.orders, 'Items': totals.items, 'Utensils': totals.utensils,
    'Subtotal $': r2(cents(totals.subtotalCents)), 'Payout $': r2(cents(totals.payoutCents)),
    'Completed': '', 'Rejected': ''
});

// ---- Build workbook -----------------------------------------------------------
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

function addSheet(name, rows) {
    const ws = XLSX.utils.json_to_sheet(rows.length ? rows : [{ 'Note': 'No data in window' }]);
    ws['!cols'] = Object.keys(rows[0] || { Note: 1 }).map(k => ({
        wch: Math.min(Math.max(k.length + 2, 12), 40)
    }));
    XLSX.utils.book_append_sheet(wb, ws, name);
}

addSheet('Weekly', weeklyRows);
addSheet('Daily', dailyRows);
addSheet('Orders', orderRows);
addSheet('Line Items', itemRows);

XLSX.writeFile(wb, outPath);

// ---- Console view ---------------------------------------------------------------
console.log(`\n📊 Workbook written: ${outPath}`);
console.log(`   ${raw.dateWindow?.startDate} → ${raw.dateWindow?.endDate} · venue ${raw.venueId}`);
console.log(`   ${totals.pickups} sessions · ${totals.orders} orders · ${totals.items} items · subtotal $${r2(cents(totals.subtotalCents))} · payout $${r2(cents(totals.payoutCents))}\n`);
console.log('Weekly:');
for (const w of weeklyRows) {
    console.log(`   ${String(w['Week Of']).padEnd(11)} orders=${String(w['Orders']).padStart(3)}  items=${String(w['Items']).padStart(4)}  subtotal=$${String(w['Subtotal $']).padStart(8)}  payout=$${w['Payout $']}`);
}
