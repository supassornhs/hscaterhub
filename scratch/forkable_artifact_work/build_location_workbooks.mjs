import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const rootDir = "/Users/barnabaskim/Desktop/hscaterhub";
const outputDir = path.join(rootDir, "outputs/01a060dc-2199-7ea0-bbaf-39c8f9cdd801");
const previewDir = path.join(rootDir, "scratch/forkable_artifact_work/previews");

const locations = [
  {
    label: "Geary St",
    venueId: 17414,
    address: "829 Geary St, San Francisco, CA 94109",
    rawPath: path.join(rootDir, "scratch/forkable_august_2026_geary_raw.json"),
    outputName: "Forkable_Aug_2026_Geary_St.xlsx",
  },
  {
    label: "Palo Alto",
    venueId: 17413,
    address: "3924 El Camino Real, Palo Alto, CA 94306",
    rawPath: path.join(rootDir, "scratch/forkable_august_2026_palo_alto_raw.json"),
    outputName: "Forkable_Aug_2026_Palo_Alto.xlsx",
  },
  {
    label: "Tennessee St",
    venueId: 17201,
    address: "1661 Tennessee St, San Francisco, CA 94107",
    rawPath: path.join(rootDir, "scratch/forkable_august_2026_tennessee_raw.json"),
    outputName: "Forkable_Aug_2026_Tennessee_St.xlsx",
  },
];

const palette = {
  navy: "#17324D",
  teal: "#2A9D8F",
  paleTeal: "#E9F5F3",
  paleBlue: "#EEF3F8",
  ink: "#243746",
  muted: "#5F6B76",
  border: "#CBD5E1",
  white: "#FFFFFF",
  total: "#DDE9F2",
};

const cents = (value) => (typeof value === "number" ? value / 100 : null);
const toDate = (iso) => new Date(`${String(iso).slice(0, 10)}T12:00:00Z`);
const r2 = (value) => (typeof value === "number" ? Math.round(value * 100) / 100 : null);

function orderType(order) {
  if (order.forFamily) return "Family";
  if (order.forBuffet) return "Buffet";
  if (order.forSpecialPm) return "Special PM";
  return "Classic";
}

function pieceFlags(piece) {
  return [
    piece.isAddition ? "ADDITION" : "",
    piece.isRemoval ? "REMOVAL" : "",
    piece.isVenueReplacement ? "VENUE REPLACEMENT" : "",
    piece.requestStatus ? `req:${piece.requestStatus}` : "",
  ].filter(Boolean).join(", ");
}

function flatten(raw) {
  const dailyRows = [];
  const orderRows = [];
  const itemRows = [];

  for (const week of raw.weeks || []) {
    const pickups = week.filteredPayload?.data?.pickupsForVenue
      || week.payload?.data?.pickupsForVenue
      || [];

    for (const pickup of pickups) {
      const date = toDate(pickup.forPickupAt);
      const serviceWindow = pickup.serviceWindow?.name || "(no window)";
      const orders = pickup.orders || [];
      let orderItems = 0;
      let utensils = 0;

      for (const order of orders) {
        const pieces = order.pieces || [];
        const activePieces = pieces.filter((piece) => !piece.isRemoval);
        const orderSubtotal = activePieces.reduce(
          (sum, piece) => sum + (typeof piece.price === "number" ? piece.price : 0),
          0,
        );
        const client = order.club?.name || "";
        const changeRequest = order.changeRequest || {};
        const flags = [
          changeRequest.isPending ? "CR PENDING" : "",
          changeRequest.isLateReplacementPending ? "LATE REPLACEMENT PENDING" : "",
          order.isSplitted
            ? `SPLIT ${(order.orderSplitGroupIndex ?? 0) + 1}/${order.orderSplitTotalOrders}`
            : "",
        ].filter(Boolean).join(" | ");
        const itemCount = order.totalItemsWithChangeRequests
          ?? order.totalItems
          ?? pieces.length;

        orderRows.push([
          date,
          serviceWindow,
          pickup.id,
          order.id,
          client,
          order.groupLabel || "",
          orderType(order),
          order.state || "",
          itemCount,
          order.totalUtensils ?? 0,
          r2(orderSubtotal),
          flags,
        ]);

        for (const piece of pieces) {
          itemRows.push([
            date,
            pickup.id,
            order.id,
            client,
            order.groupLabel || "",
            piece.userFullName || "",
            piece.name || "",
            typeof piece.price === "number" ? piece.price : null,
            piece.totalContainers ?? 1,
            piece.instructions || "",
            pieceFlags(piece),
          ]);
        }

        orderItems += Number(itemCount) || 0;
        utensils += Number(order.totalUtensils) || 0;
      }

      const grossSubtotal = (pickup.totalByOrderType || []).reduce(
        (sum, total) => sum + (Number(total.totalSubTotalWithChangeRequest) || 0),
        0,
      );
      const rejected = pickup.dayBeforeRejectedAt
        ? [pickup.rejectType, pickup.rejectNote].filter(Boolean).join(" — ") || "YES"
        : "";

      dailyRows.push([
        date,
        serviceWindow,
        pickup.id,
        orders.length,
        orderItems,
        utensils,
        cents(grossSubtotal),
        cents(pickup.balanceWithChangeRequests),
        pickup.completedAt ? "YES" : "",
        rejected,
      ]);
    }
  }

  const byDateThenId = (left, right) => left[0] - right[0] || Number(left[2] || left[1]) - Number(right[2] || right[1]);
  dailyRows.sort(byDateThenId);
  orderRows.sort(byDateThenId);
  itemRows.sort(byDateThenId);

  return { dailyRows, orderRows, itemRows };
}

function writeMatrix(sheet, startRow, startCol, matrix) {
  if (!matrix.length || !matrix[0]?.length) return;
  sheet.getRangeByIndexes(startRow, startCol, matrix.length, matrix[0].length).values = matrix;
}

function styleDataSheet(sheet, headerRange, usedRange, widths, dateColumn, currencyColumns, numericColumns = []) {
  sheet.showGridLines = false;
  sheet.freezePanes.freezeRows(1);
  usedRange.format.font = { name: "Aptos", size: 10, color: palette.ink };
  headerRange.format = {
    fill: palette.navy,
    font: { bold: true, color: palette.white },
    verticalAlignment: "center",
    wrapText: true,
    borders: { preset: "outside", style: "thin", color: palette.navy },
  };
  headerRange.format.rowHeight = 30;
  usedRange.format.borders = {
    insideHorizontal: { style: "thin", color: palette.border },
    bottom: { style: "thin", color: palette.border },
  };
  widths.forEach((width, index) => {
    sheet.getRangeByIndexes(0, index, Math.max(usedRange.rowCount || 1, 1), 1).format.columnWidth = width;
  });
  if (dateColumn) sheet.getRange(dateColumn).format.numberFormat = "yyyy-mm-dd";
  for (const col of currencyColumns) sheet.getRange(col).format.numberFormat = '"$"#,##0.00';
  for (const col of numericColumns) sheet.getRange(col).format.numberFormat = "#,##0";
}

function buildWorkbook(location, raw) {
  const workbook = Workbook.create();
  const summary = workbook.worksheets.add("Summary");
  const weekly = workbook.worksheets.add("Weekly");
  const daily = workbook.worksheets.add("Daily");
  const orders = workbook.worksheets.add("Orders");
  const lineItems = workbook.worksheets.add("Line Items");
  const { dailyRows, orderRows, itemRows } = flatten(raw);

  const dailyHeaders = [[
    "Date", "Service Window", "Pickup ID", "Orders", "Items", "Utensils",
    "Gross Subtotal $", "Payout $", "Completed", "Rejected",
  ]];
  writeMatrix(daily, 0, 0, dailyHeaders);
  writeMatrix(daily, 1, 0, dailyRows);
  const dailyLastDataRow = dailyRows.length + 1;
  const dailyTotalRow = dailyLastDataRow + 1;
  daily.getRange(`A${dailyTotalRow}:C${dailyTotalRow}`).values = [["TOTAL", "", ""]];
  daily.getRange(`D${dailyTotalRow}:H${dailyTotalRow}`).formulas = [[
    `=SUM(D2:D${dailyLastDataRow})`,
    `=SUM(E2:E${dailyLastDataRow})`,
    `=SUM(F2:F${dailyLastDataRow})`,
    `=SUM(G2:G${dailyLastDataRow})`,
    `=SUM(H2:H${dailyLastDataRow})`,
  ]];
  daily.getRange(`I${dailyTotalRow}:J${dailyTotalRow}`).values = [["", ""]];
  daily.getRange(`A${dailyTotalRow}:J${dailyTotalRow}`).format = {
    fill: palette.total,
    font: { bold: true, color: palette.navy },
    borders: { preset: "doubleBottom", style: "thin", color: palette.navy },
  };
  styleDataSheet(
    daily,
    daily.getRange("A1:J1"),
    daily.getRange(`A1:J${dailyTotalRow}`),
    [13, 16, 13, 10, 10, 11, 18, 15, 12, 28],
    `A2:A${dailyLastDataRow}`,
    [`G2:H${dailyTotalRow}`],
    [`C2:F${dailyTotalRow}`],
  );

  const orderHeaders = [[
    "Date", "Service Window", "Pickup ID", "Order ID", "Client", "Group",
    "Type", "State", "Items", "Utensils", "Subtotal $", "Flags",
  ]];
  writeMatrix(orders, 0, 0, orderHeaders);
  writeMatrix(orders, 1, 0, orderRows);
  const orderLastRow = orderRows.length + 1;
  styleDataSheet(
    orders,
    orders.getRange("A1:L1"),
    orders.getRange(`A1:L${Math.max(orderLastRow, 1)}`),
    [13, 16, 13, 13, 24, 18, 13, 14, 10, 11, 15, 28],
    `A2:A${Math.max(orderLastRow, 2)}`,
    [`K2:K${Math.max(orderLastRow, 2)}`],
    [`C2:D${Math.max(orderLastRow, 2)}`, `I2:J${Math.max(orderLastRow, 2)}`],
  );
  orders.getRange(`L2:L${Math.max(orderLastRow, 2)}`).format.wrapText = true;

  const itemHeaders = [[
    "Date", "Pickup ID", "Order ID", "Client", "Group", "Ordered By", "Item",
    "Price $", "Containers", "Instructions", "Flags",
  ]];
  writeMatrix(lineItems, 0, 0, itemHeaders);
  writeMatrix(lineItems, 1, 0, itemRows);
  const itemLastRow = itemRows.length + 1;
  styleDataSheet(
    lineItems,
    lineItems.getRange("A1:K1"),
    lineItems.getRange(`A1:K${Math.max(itemLastRow, 1)}`),
    [13, 13, 13, 24, 18, 22, 42, 13, 12, 36, 24],
    `A2:A${Math.max(itemLastRow, 2)}`,
    [`H2:H${Math.max(itemLastRow, 2)}`],
    [`B2:C${Math.max(itemLastRow, 2)}`, `I2:I${Math.max(itemLastRow, 2)}`],
  );
  lineItems.getRange(`G2:K${Math.max(itemLastRow, 2)}`).format.wrapText = true;

  const weekStarts = [...new Set((raw.dateWindow?.weeks || []).filter((weekOf) => {
    const end = new Date(`${weekOf}T12:00:00Z`);
    end.setUTCDate(end.getUTCDate() + 6);
    return weekOf <= raw.dateWindow.endDate && end.toISOString().slice(0, 10) >= raw.dateWindow.startDate;
  }))].sort();
  weekly.getRange("A1:G1").values = [[
    "Week Of", "Sessions", "Orders", "Items", "Utensils", "Gross Subtotal $", "Payout $",
  ]];
  if (weekStarts.length) {
    weekly.getRange(`A2:A${weekStarts.length + 1}`).values = weekStarts.map((date) => [toDate(date)]);
    const formulas = weekStarts.map((_, index) => {
      const row = index + 2;
      const dateRange = `'Daily'!$A$2:$A$${dailyLastDataRow}`;
      return [
        `=COUNTIFS(${dateRange},">="&A${row},${dateRange},"<="&A${row}+6)`,
        `=SUMIFS('Daily'!$D$2:$D$${dailyLastDataRow},${dateRange},">="&A${row},${dateRange},"<="&A${row}+6)`,
        `=SUMIFS('Daily'!$E$2:$E$${dailyLastDataRow},${dateRange},">="&A${row},${dateRange},"<="&A${row}+6)`,
        `=SUMIFS('Daily'!$F$2:$F$${dailyLastDataRow},${dateRange},">="&A${row},${dateRange},"<="&A${row}+6)`,
        `=SUMIFS('Daily'!$G$2:$G$${dailyLastDataRow},${dateRange},">="&A${row},${dateRange},"<="&A${row}+6)`,
        `=SUMIFS('Daily'!$H$2:$H$${dailyLastDataRow},${dateRange},">="&A${row},${dateRange},"<="&A${row}+6)`,
      ];
    });
    weekly.getRange(`B2:G${weekStarts.length + 1}`).formulas = formulas;
  }
  const weeklyTotalRow = weekStarts.length + 2;
  weekly.getRange(`A${weeklyTotalRow}`).values = [["TOTAL"]];
  weekly.getRange(`B${weeklyTotalRow}:G${weeklyTotalRow}`).formulas = [[
    `=SUM(B2:B${weeklyTotalRow - 1})`,
    `=SUM(C2:C${weeklyTotalRow - 1})`,
    `=SUM(D2:D${weeklyTotalRow - 1})`,
    `=SUM(E2:E${weeklyTotalRow - 1})`,
    `=SUM(F2:F${weeklyTotalRow - 1})`,
    `=SUM(G2:G${weeklyTotalRow - 1})`,
  ]];
  weekly.getRange(`A${weeklyTotalRow}:G${weeklyTotalRow}`).format = {
    fill: palette.total,
    font: { bold: true, color: palette.navy },
    borders: { preset: "doubleBottom", style: "thin", color: palette.navy },
  };
  styleDataSheet(
    weekly,
    weekly.getRange("A1:G1"),
    weekly.getRange(`A1:G${weeklyTotalRow}`),
    [14, 12, 12, 12, 12, 19, 15],
    `A2:A${weeklyTotalRow - 1}`,
    [`F2:G${weeklyTotalRow}`],
    [`B2:E${weeklyTotalRow}`],
  );

  summary.showGridLines = false;
  summary.getRange("A1:H24").format.font = { name: "Aptos", color: palette.ink };
  summary.mergeCells("A1:H2");
  summary.getRange("A1").values = [[`Forkable — ${location.label}`]];
  summary.getRange("A1:H2").format = {
    fill: palette.navy,
    font: { name: "Aptos Display", size: 20, bold: true, color: palette.white },
    horizontalAlignment: "left",
    verticalAlignment: "center",
  };
  summary.getRange("A4:B7").values = [
    ["Restaurant location", location.label],
    ["Address", location.address],
    ["Venue ID", location.venueId],
    ["Reporting window", `${raw.dateWindow.startDate} to ${raw.dateWindow.endDate}`],
  ];
  summary.getRange("A4:A7").format = { font: { bold: true, color: palette.navy } };
  summary.getRange("B4:B7").format = { font: { color: palette.ink }, wrapText: true };

  const cards = [
    { labelRange: "A9:B9", valueRange: "A10:B11", label: "Pickup Sessions", formula: `=COUNTA('Daily'!A2:A${dailyLastDataRow})`, format: "#,##0" },
    { labelRange: "C9:D9", valueRange: "C10:D11", label: "Orders", formula: `=SUM('Daily'!D2:D${dailyLastDataRow})`, format: "#,##0" },
    { labelRange: "E9:F9", valueRange: "E10:F11", label: "Items", formula: `=SUM('Daily'!E2:E${dailyLastDataRow})`, format: "#,##0" },
    { labelRange: "G9:H9", valueRange: "G10:H11", label: "Payout $", formula: `=SUM('Daily'!H2:H${dailyLastDataRow})`, format: '"$"#,##0.00' },
    { labelRange: "A13:D13", valueRange: "A14:D15", label: "Gross Subtotal $", formula: `=SUM('Daily'!G2:G${dailyLastDataRow})`, format: '"$"#,##0.00' },
    { labelRange: "E13:H13", valueRange: "E14:H15", label: "Payout Rate", formula: "=IFERROR(G10/A14,0)", format: "0.0%" },
  ];
  for (const card of cards) {
    summary.mergeCells(card.labelRange);
    summary.mergeCells(card.valueRange);
    summary.getRange(card.labelRange.split(":")[0]).values = [[card.label]];
    summary.getRange(card.valueRange.split(":")[0]).formulas = [[card.formula]];
    summary.getRange(card.labelRange).format = {
      fill: palette.teal,
      font: { bold: true, color: palette.white },
      horizontalAlignment: "center",
      verticalAlignment: "center",
    };
    summary.getRange(card.valueRange).format = {
      fill: palette.paleTeal,
      font: { name: "Aptos Display", size: 18, bold: true, color: palette.navy },
      horizontalAlignment: "center",
      verticalAlignment: "center",
      numberFormat: card.format,
      borders: { preset: "outside", style: "thin", color: palette.border },
    };
  }

  const windows = [...new Set(dailyRows.map((row) => row[1]))].sort();
  summary.mergeCells("A18:H18");
  summary.getRange("A18").values = [["Breakdown by service window"]];
  summary.getRange("A18:H18").format = {
    fill: palette.navy,
    font: { bold: true, color: palette.white, size: 12 },
  };
  summary.getRange("A19:F19").values = [["Service Window", "Sessions", "Orders", "Items", "Gross Subtotal $", "Payout $"]];
  summary.getRange("A19:F19").format = {
    fill: palette.paleBlue,
    font: { bold: true, color: palette.navy },
    borders: { bottom: { style: "thin", color: palette.border } },
  };
  if (windows.length) {
    summary.getRange(`A20:A${19 + windows.length}`).values = windows.map((name) => [name]);
    const breakdownFormulas = windows.map((_, index) => {
      const row = 20 + index;
      const windowRange = `'Daily'!$B$2:$B$${dailyLastDataRow}`;
      return [
        `=COUNTIF(${windowRange},A${row})`,
        `=SUMIF(${windowRange},A${row},'Daily'!$D$2:$D$${dailyLastDataRow})`,
        `=SUMIF(${windowRange},A${row},'Daily'!$E$2:$E$${dailyLastDataRow})`,
        `=SUMIF(${windowRange},A${row},'Daily'!$G$2:$G$${dailyLastDataRow})`,
        `=SUMIF(${windowRange},A${row},'Daily'!$H$2:$H$${dailyLastDataRow})`,
      ];
    });
    summary.getRange(`B20:F${19 + windows.length}`).formulas = breakdownFormulas;
  }
  const breakdownLastRow = Math.max(19 + windows.length, 19);
  summary.getRange(`A19:F${breakdownLastRow}`).format.borders = {
    insideHorizontal: { style: "thin", color: palette.border },
    bottom: { style: "thin", color: palette.border },
  };
  if (windows.length) {
    summary.getRange(`B20:D${breakdownLastRow}`).format.numberFormat = "#,##0";
    summary.getRange(`E20:F${breakdownLastRow}`).format.numberFormat = '"$"#,##0.00';
  }
  summary.getRange("A1:H2").format.font = { name: "Aptos Display", size: 20, bold: true, color: palette.white };
  summary.getRange("A:A").format.columnWidth = 20;
  summary.getRange("B:B").format.columnWidth = 27;
  summary.getRange("C:H").format.columnWidth = 15;
  summary.getRange("A4:B7").format.rowHeight = 23;

  return { workbook, counts: { daily: dailyRows.length, orders: orderRows.length, items: itemRows.length } };
}

async function savePreview(workbook, locationSlug, sheetName, range) {
  const preview = await workbook.render({ sheetName, range, scale: 1, format: "png" });
  const bytes = new Uint8Array(await preview.arrayBuffer());
  const safeSheet = sheetName.toLowerCase().replace(/[^a-z0-9]+/g, "_");
  await fs.writeFile(path.join(previewDir, `${locationSlug}_${safeSheet}.png`), bytes);
}

await fs.mkdir(outputDir, { recursive: true });
await fs.mkdir(previewDir, { recursive: true });

const results = [];
for (const location of locations) {
  const raw = JSON.parse(await fs.readFile(location.rawPath, "utf8"));
  if (raw.venueId !== location.venueId) {
    throw new Error(`Venue mismatch for ${location.label}: expected ${location.venueId}, got ${raw.venueId}`);
  }
  const { workbook, counts } = buildWorkbook(location, raw);

  const summaryInspect = await workbook.inspect({
    kind: "table",
    range: "Summary!A1:H24",
    include: "values,formulas",
    tableMaxRows: 24,
    tableMaxCols: 8,
    maxChars: 6000,
  });
  const formulaErrors = await workbook.inspect({
    kind: "match",
    searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
    options: { useRegex: true, maxResults: 100 },
    summary: `formula error scan for ${location.label}`,
  });

  const slug = location.outputName.replace(/\.xlsx$/i, "").toLowerCase();
  await savePreview(workbook, slug, "Summary", "A1:H24");
  await savePreview(workbook, slug, "Weekly", "A1:G10");
  await savePreview(workbook, slug, "Daily", `A1:J${Math.min(counts.daily + 2, 20)}`);
  await savePreview(workbook, slug, "Orders", `A1:L${Math.min(counts.orders + 1, 20)}`);
  await savePreview(workbook, slug, "Line Items", `A1:K${Math.min(counts.items + 1, 20)}`);

  const output = await SpreadsheetFile.exportXlsx(workbook);
  const outputPath = path.join(outputDir, location.outputName);
  await output.save(outputPath);

  results.push({
    location: location.label,
    venueId: location.venueId,
    outputPath,
    counts,
    summaryInspect: summaryInspect.ndjson,
    formulaErrors: formulaErrors.ndjson,
  });
}

console.log(JSON.stringify(results, null, 2));
