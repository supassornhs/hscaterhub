import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const rootDir = "/Users/barnabaskim/Desktop/hscaterhub";
const sourcePath = path.join(rootDir, "scratch/clubfeast_latest_raw.json");
const outputDir = path.join(rootDir, "outputs/01a060dc-2199-7ea0-bbaf-39c8f9cdd801");
const previewDir = path.join(rootDir, "scratch/clubfeast_artifact_work/previews");
const outputPath = path.join(outputDir, "ClubFeast_August_2026_Orders.xlsx");

const palette = {
  navy: "#17324D",
  teal: "#2A9D8F",
  paleTeal: "#E9F5F3",
  paleBlue: "#EEF3F8",
  amber: "#FFF4CC",
  amberText: "#755600",
  ink: "#243746",
  border: "#CBD5E1",
  total: "#DDE9F2",
  white: "#FFFFFF",
};

const currencyFormat = '"$"#,##0.00';
const countFormat = "#,##0";

function dateOnly(rawDateTime) {
  return new Date(`${String(rawDateTime).slice(0, 10)}T12:00:00Z`);
}

function timeOnly(rawDateTime) {
  const match = String(rawDateTime || "").match(/\b(\d{2}:\d{2}):\d{2}\b/);
  return match ? `${match[1]} PT` : "";
}

function money(value) {
  if (typeof value === "number") return value;
  const parsed = Number(String(value ?? "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function textValue(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  return JSON.stringify(value);
}

function flatten(packages) {
  const sorted = [...packages].sort((left, right) =>
    String(left.delivery_window_start).localeCompare(String(right.delivery_window_start)),
  );
  const orders = [];
  const meals = [];

  for (const order of sorted) {
    const dishLines = order.dish_lines || [];
    orders.push({
      values: [
        dateOnly(order.delivery_window_start),
        timeOnly(order.delivery_window_start),
        timeOnly(order.delivery_window_end),
        String(order.id ?? ""),
        order.order_code || "",
        order.delivery_name || "",
        order.restaurant_name || "",
        order.delivery_address?.formatted_address || order.delivery_address?.address_line || "",
        Number(order.size ?? order.shipping_size ?? 0),
        dishLines.length,
        null,
        money(order.cost_summary?.utensils_cost),
        money(order.cost_summary?.subtotal),
        money(order.cost_summary?.tax_amount),
        null,
        order.restaurant_invoice_id == null ? null : Number(order.restaurant_invoice_id),
        order.vip ? "Yes" : "No",
        order.organization_code || "",
        order.delivery_instructions || "",
      ],
      sourceTotal: money(order.cost_summary?.total),
    });

    for (const line of dishLines) {
      const dietaryTags = (line.dish?.dietary_restrictions || [])
        .map((restriction) => restriction.name)
        .filter(Boolean)
        .join(", ");
      const options = Array.isArray(line.dish_options_details)
        ? line.dish_options_details.map(textValue).filter(Boolean).join("; ")
        : textValue(line.dish_options_details);
      meals.push([
        dateOnly(order.delivery_window_start),
        order.order_code || "",
        order.delivery_name || "",
        line.name || line.dish?.title || "",
        line.type || line.dish?.dish_type || "",
        Number(line.quantity ?? 0),
        Number(line.serving_size ?? line.quantity ?? 0),
        money(line.dish?.cost) / 100,
        null,
        dietaryTags,
        textValue(line.customer_note),
        line.dish_options_titles || options,
      ]);
    }
  }

  return { orders, meals };
}

function setColumnWidths(sheet, widths, rowCount) {
  widths.forEach((width, index) => {
    sheet.getRangeByIndexes(0, index, Math.max(rowCount, 1), 1).format.columnWidth = width;
  });
}

function styleTableSheet(sheet, headerRange, usedRange, widths) {
  sheet.showGridLines = false;
  sheet.freezePanes.freezeRows(1);
  usedRange.format.font = { name: "Aptos", size: 10, color: palette.ink };
  usedRange.format.borders = {
    insideHorizontal: { style: "thin", color: palette.border },
    bottom: { style: "thin", color: palette.border },
  };
  headerRange.format = {
    fill: palette.navy,
    font: { name: "Aptos", size: 10, bold: true, color: palette.white },
    verticalAlignment: "center",
    wrapText: true,
    borders: { preset: "outside", style: "thin", color: palette.navy },
  };
  headerRange.format.rowHeight = 34;
  setColumnWidths(sheet, widths, usedRange.rowCount || 1);
}

const packages = JSON.parse(await fs.readFile(sourcePath, "utf8"));
if (!Array.isArray(packages)) throw new Error("Expected Club Feast source to be a top-level JSON array");
const { orders: orderRows, meals: mealRows } = flatten(packages);

const workbook = Workbook.create();
const summary = workbook.worksheets.add("Summary");
const orders = workbook.worksheets.add("Orders");
const mealBreakdown = workbook.worksheets.add("Meal Breakdown");
const dishSummary = workbook.worksheets.add("Dish Summary");

// Orders ----------------------------------------------------------------------
const orderHeaders = [[
  "Delivery Date", "Window Start", "Window End", "Order ID", "Order Code",
  "Customer", "Restaurant", "Delivery Address", "Meals", "Dish Lines",
  "Food Cost $", "Utensil Fee $", "Subtotal $", "Tax $", "Order Total $",
  "Invoice ID", "VIP", "Organization", "Delivery Instructions",
]];
orders.getRange("A1:S1").values = orderHeaders;
if (orderRows.length) {
  orders.getRange(`A2:S${orderRows.length + 1}`).values = orderRows.map((row) => row.values);
  orders.getRange("K2").formulas = [["=M2-L2"]];
  orders.getRange(`K2:K${orderRows.length + 1}`).fillDown();
  orders.getRange("O2").formulas = [["=M2+N2"]];
  orders.getRange(`O2:O${orderRows.length + 1}`).fillDown();
}
const orderLastDataRow = orderRows.length + 1;
const orderTotalRow = orderLastDataRow + 1;
orders.getRange(`A${orderTotalRow}:H${orderTotalRow}`).values = [["TOTAL", "", "", "", "", "", "", ""]];
orders.getRange(`I${orderTotalRow}:O${orderTotalRow}`).formulas = [[
  `=SUM(I2:I${orderLastDataRow})`,
  `=SUM(J2:J${orderLastDataRow})`,
  `=SUM(K2:K${orderLastDataRow})`,
  `=SUM(L2:L${orderLastDataRow})`,
  `=SUM(M2:M${orderLastDataRow})`,
  `=SUM(N2:N${orderLastDataRow})`,
  `=SUM(O2:O${orderLastDataRow})`,
]];
orders.getRange(`P${orderTotalRow}:S${orderTotalRow}`).values = [["", "", "", ""]];
orders.getRange(`A${orderTotalRow}:S${orderTotalRow}`).format = {
  fill: palette.total,
  font: { bold: true, color: palette.navy },
  borders: { preset: "doubleBottom", style: "thin", color: palette.navy },
};
styleTableSheet(
  orders,
  orders.getRange("A1:S1"),
  orders.getRange(`A1:S${orderTotalRow}`),
  [14, 14, 14, 13, 22, 26, 25, 44, 10, 12, 14, 15, 14, 12, 16, 14, 9, 14, 56],
);
orders.getRange(`A2:A${orderLastDataRow}`).format.numberFormat = "yyyy-mm-dd";
orders.getRange(`I2:J${orderTotalRow}`).format.numberFormat = countFormat;
orders.getRange(`K2:O${orderTotalRow}`).format.numberFormat = currencyFormat;
orders.getRange(`H2:H${orderLastDataRow}`).format.wrapText = true;
orders.getRange(`S2:S${orderLastDataRow}`).format.wrapText = true;
if (orderRows.length) {
  const table = orders.tables.add(`A1:S${orderLastDataRow}`, true, "ClubFeastOrders");
  table.style = "TableStyleMedium2";
}

// Meal Breakdown --------------------------------------------------------------
const mealHeaders = [[
  "Delivery Date", "Order Code", "Customer", "Dish", "Type", "Quantity",
  "Serving Size", "Unit Cost $", "Line Total $", "Dietary Tags", "Customer Note", "Options",
]];
mealBreakdown.getRange("A1:L1").values = mealHeaders;
if (mealRows.length) {
  mealBreakdown.getRange(`A2:L${mealRows.length + 1}`).values = mealRows;
  mealBreakdown.getRange("I2").formulas = [["=F2*H2"]];
  mealBreakdown.getRange(`I2:I${mealRows.length + 1}`).fillDown();
}
const mealLastDataRow = mealRows.length + 1;
const mealTotalRow = mealLastDataRow + 1;
mealBreakdown.getRange(`A${mealTotalRow}:E${mealTotalRow}`).values = [["TOTAL", "", "", "", ""]];
mealBreakdown.getRange(`F${mealTotalRow}:I${mealTotalRow}`).formulas = [[
  `=SUM(F2:F${mealLastDataRow})`,
  `=SUM(G2:G${mealLastDataRow})`,
  "",
  `=SUM(I2:I${mealLastDataRow})`,
]];
mealBreakdown.getRange(`J${mealTotalRow}:L${mealTotalRow}`).values = [["", "", ""]];
mealBreakdown.getRange(`A${mealTotalRow}:L${mealTotalRow}`).format = {
  fill: palette.total,
  font: { bold: true, color: palette.navy },
  borders: { preset: "doubleBottom", style: "thin", color: palette.navy },
};
styleTableSheet(
  mealBreakdown,
  mealBreakdown.getRange("A1:L1"),
  mealBreakdown.getRange(`A1:L${mealTotalRow}`),
  [14, 22, 26, 42, 12, 11, 13, 14, 15, 46, 34, 32],
);
mealBreakdown.getRange(`A2:A${mealLastDataRow}`).format.numberFormat = "yyyy-mm-dd";
mealBreakdown.getRange(`F2:G${mealTotalRow}`).format.numberFormat = countFormat;
mealBreakdown.getRange(`H2:I${mealTotalRow}`).format.numberFormat = currencyFormat;
mealBreakdown.getRange(`D2:L${mealLastDataRow}`).format.wrapText = true;
if (mealRows.length) {
  const table = mealBreakdown.tables.add(`A1:L${mealLastDataRow}`, true, "ClubFeastMeals");
  table.style = "TableStyleMedium2";
}

// Dish Summary ----------------------------------------------------------------
const dishes = [...new Set(mealRows.map((row) => row[3]))].sort();
dishSummary.getRange("A1:D1").values = [["Dish", "Order Lines", "Meals", "Food Cost $"]];
if (dishes.length) {
  dishSummary.getRange(`A2:A${dishes.length + 1}`).values = dishes.map((dish) => [dish]);
  dishSummary.getRange("B2").formulas = [[`=COUNTIF('Meal Breakdown'!$D$2:$D$${mealLastDataRow},A2)`]];
  dishSummary.getRange(`B2:B${dishes.length + 1}`).fillDown();
  dishSummary.getRange("C2").formulas = [[`=SUMIF('Meal Breakdown'!$D$2:$D$${mealLastDataRow},A2,'Meal Breakdown'!$F$2:$F$${mealLastDataRow})`]];
  dishSummary.getRange(`C2:C${dishes.length + 1}`).fillDown();
  dishSummary.getRange("D2").formulas = [[`=SUMIF('Meal Breakdown'!$D$2:$D$${mealLastDataRow},A2,'Meal Breakdown'!$I$2:$I$${mealLastDataRow})`]];
  dishSummary.getRange(`D2:D${dishes.length + 1}`).fillDown();
}
const dishTotalRow = dishes.length + 2;
dishSummary.getRange(`A${dishTotalRow}`).values = [["TOTAL"]];
dishSummary.getRange(`B${dishTotalRow}:D${dishTotalRow}`).formulas = [[
  `=SUM(B2:B${dishTotalRow - 1})`,
  `=SUM(C2:C${dishTotalRow - 1})`,
  `=SUM(D2:D${dishTotalRow - 1})`,
]];
dishSummary.getRange(`A${dishTotalRow}:D${dishTotalRow}`).format = {
  fill: palette.total,
  font: { bold: true, color: palette.navy },
  borders: { preset: "doubleBottom", style: "thin", color: palette.navy },
};
styleTableSheet(
  dishSummary,
  dishSummary.getRange("A1:D1"),
  dishSummary.getRange(`A1:D${dishTotalRow}`),
  [48, 14, 12, 16],
);
dishSummary.getRange(`B2:C${dishTotalRow}`).format.numberFormat = countFormat;
dishSummary.getRange(`D2:D${dishTotalRow}`).format.numberFormat = currencyFormat;
if (dishes.length) {
  const table = dishSummary.tables.add(`A1:D${dishes.length + 1}`, true, "ClubFeastDishSummary");
  table.style = "TableStyleMedium2";
}

// Summary ---------------------------------------------------------------------
summary.showGridLines = false;
summary.getRange("A1:H30").format.font = { name: "Aptos", size: 10, color: palette.ink };
summary.mergeCells("A1:H2");
summary.getRange("A1").values = [["Club Feast Order Summary"]];
summary.getRange("A1:H2").format = {
  fill: palette.navy,
  font: { name: "Aptos Display", size: 20, bold: true, color: palette.white },
  verticalAlignment: "center",
};
summary.getRange("A4:A7").values = [["Source"], ["Restaurant"], ["First delivery"], ["Last delivery"]];
summary.getRange("B4:B7").values = [["clubfeast_latest_raw.json"], [packages[0]?.restaurant_name || ""] , [null], [null]];
summary.getRange("B6").formulas = [[`=MIN('Orders'!A2:A${orderLastDataRow})`]];
summary.getRange("B7").formulas = [[`=MAX('Orders'!A2:A${orderLastDataRow})`]];
summary.getRange("A4:A7").format.font = { bold: true, color: palette.navy };
summary.getRange("B6:B7").format.numberFormat = "yyyy-mm-dd";

const cards = [
  { labelRange: "A9:B9", valueRange: "A10:B11", label: "Order Packages", formula: `=COUNTA('Orders'!E2:E${orderLastDataRow})`, format: countFormat },
  { labelRange: "C9:D9", valueRange: "C10:D11", label: "Meals", formula: `=SUM('Orders'!I2:I${orderLastDataRow})`, format: countFormat },
  { labelRange: "E9:F9", valueRange: "E10:F11", label: "Dish Lines", formula: `=COUNTA('Meal Breakdown'!D2:D${mealLastDataRow})`, format: countFormat },
  { labelRange: "G9:H9", valueRange: "G10:H11", label: "Order Total $", formula: `=SUM('Orders'!O2:O${orderLastDataRow})`, format: currencyFormat },
  { labelRange: "A13:B13", valueRange: "A14:B15", label: "Food Cost $", formula: `=SUM('Orders'!K2:K${orderLastDataRow})`, format: currencyFormat },
  { labelRange: "C13:D13", valueRange: "C14:D15", label: "Utensil Fees $", formula: `=SUM('Orders'!L2:L${orderLastDataRow})`, format: currencyFormat },
  { labelRange: "E13:F13", valueRange: "E14:F15", label: "Tax $", formula: `=SUM('Orders'!N2:N${orderLastDataRow})`, format: currencyFormat },
  { labelRange: "G13:H13", valueRange: "G14:H15", label: "Invoiced Orders", formula: `=COUNT('Orders'!P2:P${orderLastDataRow})`, format: countFormat },
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

summary.mergeCells("A17:H18");
summary.getRange("A17").values = [["5 order packages contain 57 meals. One package can represent many individual meals."]];
summary.getRange("A17:H18").format = {
  fill: palette.amber,
  font: { bold: true, color: palette.amberText, size: 11 },
  verticalAlignment: "center",
  horizontalAlignment: "center",
  wrapText: true,
  borders: { preset: "outside", style: "thin", color: "#E5C84B" },
};

const customers = [...new Set(orderRows.map((row) => row.values[5]))].sort();
summary.mergeCells("A21:H21");
summary.getRange("A21").values = [["Customer breakdown"]];
summary.getRange("A21:H21").format = {
  fill: palette.navy,
  font: { bold: true, color: palette.white, size: 12 },
};
summary.getRange("A22:E22").values = [["Customer", "Orders", "Meals", "Subtotal $", "Order Total $"]];
summary.getRange("A22:E22").format = {
  fill: palette.paleBlue,
  font: { bold: true, color: palette.navy },
  borders: { bottom: { style: "thin", color: palette.border } },
};
if (customers.length) {
  summary.getRange(`A23:A${22 + customers.length}`).values = customers.map((customer) => [customer]);
  const formulas = customers.map((_, index) => {
    const row = 23 + index;
    return [
      `=COUNTIF('Orders'!$F$2:$F$${orderLastDataRow},A${row})`,
      `=SUMIF('Orders'!$F$2:$F$${orderLastDataRow},A${row},'Orders'!$I$2:$I$${orderLastDataRow})`,
      `=SUMIF('Orders'!$F$2:$F$${orderLastDataRow},A${row},'Orders'!$M$2:$M$${orderLastDataRow})`,
      `=SUMIF('Orders'!$F$2:$F$${orderLastDataRow},A${row},'Orders'!$O$2:$O$${orderLastDataRow})`,
    ];
  });
  summary.getRange(`B23:E${22 + customers.length}`).formulas = formulas;
  summary.getRange(`B23:C${22 + customers.length}`).format.numberFormat = countFormat;
  summary.getRange(`D23:E${22 + customers.length}`).format.numberFormat = currencyFormat;
  summary.getRange(`A22:E${22 + customers.length}`).format.borders = {
    insideHorizontal: { style: "thin", color: palette.border },
    bottom: { style: "thin", color: palette.border },
  };
}
summary.getRange("A:A").format.columnWidth = 22;
summary.getRange("B:B").format.columnWidth = 28;
summary.getRange("C:H").format.columnWidth = 16;

// Verification and export -----------------------------------------------------
const summaryInspect = await workbook.inspect({
  kind: "table",
  range: "Summary!A1:H27",
  include: "values,formulas",
  tableMaxRows: 27,
  tableMaxCols: 8,
  maxChars: 7000,
});
const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  summary: "Club Feast final formula error scan",
});

await fs.mkdir(outputDir, { recursive: true });
await fs.mkdir(previewDir, { recursive: true });
for (const [sheetName, range] of [
  ["Summary", "A1:H27"],
  ["Orders", `A1:S${orderTotalRow}`],
  ["Meal Breakdown", `A1:L${mealTotalRow}`],
  ["Dish Summary", `A1:D${dishTotalRow}`],
]) {
  const preview = await workbook.render({ sheetName, range, scale: 1, format: "png" });
  const safeName = sheetName.toLowerCase().replace(/[^a-z0-9]+/g, "_");
  await fs.writeFile(path.join(previewDir, `${safeName}.png`), new Uint8Array(await preview.arrayBuffer()));
}

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);

const sourceTotals = orderRows.reduce((totals, row) => ({
  orders: totals.orders + 1,
  meals: totals.meals + row.values[8],
  dishLines: totals.dishLines + row.values[9],
  subtotal: totals.subtotal + row.values[12],
  tax: totals.tax + row.values[13],
  orderTotal: totals.orderTotal + row.sourceTotal,
}), { orders: 0, meals: 0, dishLines: 0, subtotal: 0, tax: 0, orderTotal: 0 });

console.log(JSON.stringify({
  outputPath,
  sourceTotals,
  summaryInspect: summaryInspect.ndjson,
  formulaErrors: errors.ndjson,
}, null, 2));
