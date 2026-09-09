/**
 * forkable_schedule.js — Extract the upcoming week's projected meal counts.
 *
 * Uses the same findOrCreateOwnedVenueSchedules call the Forkable "Next Week"
 * page makes, so the numbers here are exactly what the site shows.
 *
 * Usage:
 *   node automations/forkable/forkable_schedule.js                  # next week (Mon–Sun)
 *   node automations/forkable/forkable_schedule.js --this-week      # current week
 *   node automations/forkable/forkable_schedule.js --week 2026-08-24  # specific week (Monday)
 *
 *   npm run extract-forkable-projections
 *
 * Output: console table + scratch/forkable_projections_<weekOf>.xlsx
 */

import fs from 'fs';
import * as XLSX from 'xlsx';
import { resolveCookie, postGraphql } from './forkable_client.js';

const SCHEDULES_MUTATION = `mutation ($input: FindOrCreateOwnedVenueSchedulesInput!) {
  findOrCreateOwnedVenueSchedules (input: $input) {
    schedules {
      id
      rejectNote
      venue { id }
      lastSentVersion {
        status
        sentAt
        confirmedAt
        rejectedAt
        rejectNote
        days { wday min max }
        pmDays { wday min max }
        specialPmDays { wday min max }
        classicPmDays { wday min max }
      }
    }
  }
}`;

const WDAYS = { 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday', 7: 'Sunday' };
const SESSIONS = [
    ['days', 'Lunch'],
    ['pmDays', 'PM'],
    ['specialPmDays', 'Special PM'],
    ['classicPmDays', 'Classic PM']
];

function isoDate(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function nextMonday(from) {
    const d = new Date(from);
    const offset = ((8 - d.getDay()) % 7) || 7;
    d.setDate(d.getDate() + offset);
    return d;
}

function thisMonday(from) {
    const d = new Date(from);
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    return d;
}

function resolveWeekOf(argv) {
    const wIdx = argv.indexOf('--week');
    if (wIdx !== -1 && argv[wIdx + 1]) {
        const d = new Date(argv[wIdx + 1] + 'T12:00:00');
        if (isNaN(d)) throw new Error(`--week expects YYYY-MM-DD, got: ${argv[wIdx + 1]}`);
        return isoDate(thisMonday(d));
    }
    if (argv.includes('--this-week')) return isoDate(thisMonday(new Date()));
    return isoDate(nextMonday(new Date()));
}

function addDays(iso, n) {
    const d = new Date(iso + 'T12:00:00');
    d.setDate(d.getDate() + n);
    return isoDate(d);
}

(async () => {
    const weekOf = resolveWeekOf(process.argv.slice(2));
    const ownerId = Number(process.env.FORKABLE_OWNER_ID || 2297);

    console.log(`📅 Extracting projected meal counts for week of ${weekOf}...`);
    const cookie = await resolveCookie();
    console.log(`🔑 Authenticated via ${cookie.source}.`);

    const root = await postGraphql({
        cookie: cookie.value,
        body: {
            query: SCHEDULES_MUTATION,
            variables: { input: { ownerId, weekOf } }
        }
    });

    const schedules = root?.data?.findOrCreateOwnedVenueSchedules?.schedules || [];
    if (schedules.length === 0) {
        console.log('⚠️  No schedule returned for this week.');
        process.exit(0);
    }

    const rows = [];
    for (const schedule of schedules) {
        const v = schedule.lastSentVersion;
        if (!v) continue;
        for (const [field, label] of SESSIONS) {
            for (const day of v[field] || []) {
                rows.push({
                    'Date': `${addDays(weekOf, day.wday - 1)} (${WDAYS[day.wday] || `wday ${day.wday}`})`,
                    'Session': label,
                    'Min Meals': day.min,
                    'Max Meals': day.max,
                    'Schedule Status': v.status || '',
                    'Sent At': v.sentAt ? new Date(v.sentAt).toLocaleString('en-US') : '',
                    'Confirmed At': v.confirmedAt ? new Date(v.confirmedAt).toLocaleString('en-US') : '',
                    'Rejected At': v.rejectedAt ? new Date(v.rejectedAt).toLocaleString('en-US') : '',
                    'Reject Note': v.rejectNote || schedule.rejectNote || '',
                    'Schedule ID': schedule.id,
                    'Venue ID': schedule.venue?.id ?? ''
                });
            }
        }
    }

    rows.sort((a, b) => a['Date'].localeCompare(b['Date']));

    const minTotal = rows.reduce((s, r) => s + (r['Min Meals'] || 0), 0);
    const maxTotal = rows.reduce((s, r) => s + (r['Max Meals'] || 0), 0);

    // Console table
    console.log(`\nWeek of ${weekOf} — projected meal counts (as shown on the Forkable site):\n`);
    for (const r of rows) {
        console.log(`   ${r['Date'].padEnd(20)} ${r['Session'].padEnd(10)} ~${r['Min Meals']}–${r['Max Meals']}`);
    }
    console.log(`   ${'TOTAL'.padEnd(20)} ${''.padEnd(10)} ~${minTotal}–${maxTotal}`);
    const status = schedules[0]?.lastSentVersion?.status;
    if (status) console.log(`\n   Schedule status: ${status}`);

    // Workbook: Summary first, then the daily rows
    const v0 = schedules[0]?.lastSentVersion || {};
    const summaryAoA = [
        ['Forkable Projected Meal Counts'],
        ['Week Of', weekOf],
        ['Owner ID', ownerId],
        ['Generated', new Date().toLocaleString('en-US')],
        [],
        ['Total Min Meals', minTotal],
        ['Total Max Meals', maxTotal],
        ['Schedule Status', v0.status || ''],
        ['Sent At', v0.sentAt ? new Date(v0.sentAt).toLocaleString('en-US') : ''],
        ['Confirmed At', v0.confirmedAt ? new Date(v0.confirmedAt).toLocaleString('en-US') : '']
    ];
    const wb = XLSX.utils.book_new();
    const wsSummary = XLSX.utils.aoa_to_sheet(summaryAoA);
    wsSummary['!cols'] = [{ wch: 20 }, { wch: 28 }];
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

    const detailRows = [...rows, {
        'Date': 'TOTAL', 'Session': '', 'Min Meals': minTotal, 'Max Meals': maxTotal,
        'Schedule Status': '', 'Sent At': '', 'Confirmed At': '', 'Rejected At': '',
        'Reject Note': '', 'Schedule ID': '', 'Venue ID': ''
    }];
    const wsDaily = XLSX.utils.json_to_sheet(detailRows.length ? detailRows : [{ 'Note': 'No projections for this week' }]);
    wsDaily['!cols'] = Object.keys(detailRows[0] || { Note: 1 }).map(k => ({ wch: Math.min(Math.max(k.length + 2, 12), 30) }));
    XLSX.utils.book_append_sheet(wb, wsDaily, 'Daily Projections');

    if (!fs.existsSync('./scratch')) fs.mkdirSync('./scratch');
    const outPath = `scratch/forkable_projections_${weekOf}.xlsx`;
    XLSX.writeFile(wb, outPath);
    console.log(`\n📊 Workbook written: ${outPath}`);
})().catch(error => {
    console.error(`\n❌ ${error.message}`);
    process.exit(1);
});
