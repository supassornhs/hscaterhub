import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const rootDir = "/Users/barnabaskim/Desktop/hscaterhub";
const sourcePath = path.join(
  rootDir,
  "scratch/clubfeast_august_2026_all_locations_raw.json",
);
const outputDir = path.join(
  rootDir,
  "outputs/01a060dc-2199-7ea0-bbaf-39c8f9cdd801",
);
const previewDir = path.join(
  rootDir,
  "scratch/clubfeast_artifact_work/corrected_previews",
);
const outputPath = path.join(
  outputDir,
  "ClubFeast_August_2026_All_Locations.xlsx",
);

const palette = {
  navy: "#17365D",
  teal: "#00A6A6",
  note: "#EAF3F5",
  band: "#C9EAF4",
  border: "#D6E1E7",
  ink: "#17324D",
  muted: "#4E6677",
  white: "#FFFFFF",
  total: "#DDEBF7",
};

const currencyFormat = '"$"#,##0.00;[Red]-"$"#,##0.00';

function money(value) {
  if (typeof value === "number") return value;
  const parsed = Number(String(value ?? "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function dateOnly(rawDateTime) {
  return new Date(`${String(rawDateTime).slice(0, 10)}T12:00:00Z`);
}

function branchFor(sourceRestaurant) {
  const address = sourceRestaurant?.address_line ?? "";
  const city = sourceRestaurant?.city ?? "";
  if (/geary/i.test(address)) return "Geary";
  if (/tennessee/i.test(address)) return "Tennessee";
  if (/el camino/i.test(address) || /palo alto/i.test(city)) return "Palo Alto";
  return sourceRestaurant?.title ?? "Unknown";
}

function percentage(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed / 100 : 0;
}

function styleTitleAndNote(sheet, lastColumn, title, note) {
  sheet.showGridLines = false;
  sheet.mergeCells(`A1:${lastColumn}1`);
  sheet.mergeCells(`A2:${lastColumn}2`);
  sheet.getRange("A1").values = [[title]];
  sheet.getRange("A2").values = [[note]];
  sheet.getRange(`A1:${lastColumn}1`).format = {
    fill: palette.navy,
    font: { name: "Aptos Display", size: 15, bold: true, color: palette.white },
    verticalAlignment: "center",
  };
  sheet.getRange(`A2:${lastColumn}2`).format = {
    fill: palette.note,
    font: { name: "Aptos", size: 10, italic: true, color: palette.muted },
    verticalAlignment: "center",
    wrapText: true,
  };
  sheet.getRange("1:1").format.rowHeight = 30;
  sheet.getRange("2:2").format.rowHeight = 38;
  sheet.getRange("3:3").format.rowHeight = 10;
}

function styleDataTable(sheet, headerRange, dataRange) {
  headerRange.format = {
    fill: palette.teal,
    font: { name: "Aptos", size: 10, bold: true, color: palette.white },
    verticalAlignment: "center",
    wrapText: true,
    borders: { preset: "outside", style: "thin", color: palette.teal },
  };
  headerRange.format.rowHeight = 34;
  dataRange.format = {
    fill: palette.band,
    font: { name: "Aptos", size: 10, color: palette.ink },
    verticalAlignment: "center",
    borders: {
      insideHorizontal: { style: "thin", color: palette.border },
      insideVertical: { style: "thin", color: palette.border },
      bottom: { style: "thin", color: palette.border },
    },
  };
  dataRange.conditionalFormats.addCustom("=MOD(ROW(),2)=0", {
    fill: palette.white,
  });
}

function setWidths(sheet, widths, rowCount) {
  widths.forEach((width, columnIndex) => {
    sheet
      .getRangeByIndexes(0, columnIndex, Math.max(rowCount, 1), 1)
      .format.columnWidth = width;
  });
}

const packages = JSON.parse(await fs.readFile(sourcePath, "utf8"));
if (!Array.isArray(packages)) {
  throw new Error("Expected the corrected ClubFeast source to be a JSON array");
}
if (packages.some((item) => !item.source_restaurant?.id)) {
  throw new Error("Corrected ClubFeast source is missing location provenance");
}

const sortedPackages = [...packages].sort((left, right) => {
  const dateCompare = String(left.delivery_window_end).localeCompare(
    String(right.delivery_window_end),
  );
  if (dateCompare !== 0) return dateCompare;
  const branchCompare = branchFor(left.source_restaurant).localeCompare(
    branchFor(right.source_restaurant),
  );
  if (branchCompare !== 0) return branchCompare;
  return String(left.order_code).localeCompare(String(right.order_code));
});

const orderRows = sortedPackages.map((order) => [
  dateOnly(order.delivery_window_end),
  branchFor(order.source_restaurant),
  order.order_code ?? "",
  money(order.cost_summary?.subtotal),
  money(order.adjusted_cost) / 100,
  order.cost_adjustment_reason ?? "",
  percentage(order.source_restaurant.discount_percentage),
  money(order.cost_summary?.tax_amount),
  money(order.cost_summary?.total),
]);

const menuRows = [];
const sourceRows = [];
for (const order of sortedPackages) {
  const branch = branchFor(order.source_restaurant);
  (order.dish_lines ?? []).forEach((line, index) => {
    const quantity = Number(line.quantity ?? 0);
    menuRows.push([
      dateOnly(order.delivery_window_end),
      branch,
      order.order_code ?? "",
      line.name ?? line.dish?.title ?? "",
      null,
      quantity,
    ]);
    sourceRows.push([
      order.order_code ?? "",
      index + 1,
      money(line.total_cost),
      quantity,
    ]);
  });
}

const expectedRestaurantIds = new Set([3904, 4198, 4088]);
const sourceRestaurantIds = new Set(
  packages.map((item) => item.source_restaurant.id),
);
for (const id of sourceRestaurantIds) expectedRestaurantIds.delete(id);
// Palo Alto legitimately has zero August packages; it remains part of the scope
// check even though no package row can carry its provenance.
expectedRestaurantIds.delete(4198);
if (expectedRestaurantIds.size) {
  throw new Error(
    `Corrected ClubFeast source is missing non-empty location IDs: ${[
      ...expectedRestaurantIds,
    ].join(", ")}`,
  );
}

const workbook = Workbook.create();
const orderSummary = workbook.worksheets.add("Order Summary");
const menuDetails = workbook.worksheets.add("Menu Details");
const sourceData = workbook.worksheets.add("Source Data");

const orderHeaderRow = 4;
const orderStartRow = 5;
const orderEndRow = orderStartRow + orderRows.length - 1;
styleTitleAndNote(
  orderSummary,
  "I",
  "ClubFeast — Order Summary",
  "Enter one row per order. Gross Sales means portal Subtotal. Keep Cost Adjustment signed (negative values reduce revenue). Verified August scope: 36 orders (31 Tennessee, 5 Geary, 0 Palo Alto).",
);
orderSummary.getRange("A4:I4").values = [[
  "Date",
  "Branch",
  "Order ID",
  "Gross Sales (Subtotal)",
  "Cost Adjustment",
  "Cost Adjustment Reason",
  "Applicable Discount",
  "Tax Amount",
  "Order Total",
]];
orderSummary.getRange(`A${orderStartRow}:I${orderEndRow}`).values = orderRows;
const orderTable = orderSummary.tables.add(
  `A${orderHeaderRow}:I${orderEndRow}`,
  true,
  "ClubFeastOrderSummary",
);
orderTable.style = "TableStyleMedium2";
styleDataTable(
  orderSummary,
  orderSummary.getRange("A4:I4"),
  orderSummary.getRange(`A${orderStartRow}:I${orderEndRow}`),
);
orderSummary.freezePanes.freezeRows(4);
orderSummary.getRange(`A${orderStartRow}:A${orderEndRow}`).format.numberFormat =
  "yyyy-mm-dd";
orderSummary.getRange(`D${orderStartRow}:E${orderEndRow}`).format.numberFormat =
  currencyFormat;
orderSummary.getRange(`G${orderStartRow}:G${orderEndRow}`).format.numberFormat =
  "0%";
orderSummary.getRange(`H${orderStartRow}:I${orderEndRow}`).format.numberFormat =
  currencyFormat;
orderSummary.getRange(`F${orderStartRow}:F${orderEndRow}`).format.wrapText = true;
setWidths(
  orderSummary,
  [14, 16, 23, 20, 18, 34, 19, 16, 16],
  orderEndRow,
);

const menuHeaderRow = 4;
const menuStartRow = 5;
const menuEndRow = menuStartRow + menuRows.length - 1;
styleTitleAndNote(
  menuDetails,
  "F",
  "ClubFeast — Menu Details",
  "Enter one row per menu item within each order. Repeat Date, Branch, and Order ID for every menu line. Verified source: 274 menu rows from 36 August orders.",
);
menuDetails.getRange("A4:F4").values = [[
  "Date",
  "Branch",
  "Order ID",
  "Menu",
  "Menu Pricing",
  "No. of Orders for Each Menu",
]];
menuDetails.getRange(`A${menuStartRow}:F${menuEndRow}`).values = menuRows;
menuDetails.getRange(`E${menuStartRow}`).formulas = [[
  `=IFERROR('Source Data'!C${menuStartRow}/'Source Data'!D${menuStartRow},0)`,
]];
menuDetails.getRange(`E${menuStartRow}:E${menuEndRow}`).fillDown();
const menuTable = menuDetails.tables.add(
  `A${menuHeaderRow}:F${menuEndRow}`,
  true,
  "ClubFeastMenuDetails",
);
menuTable.style = "TableStyleMedium2";
styleDataTable(
  menuDetails,
  menuDetails.getRange("A4:F4"),
  menuDetails.getRange(`A${menuStartRow}:F${menuEndRow}`),
);
menuDetails.freezePanes.freezeRows(4);
menuDetails.getRange(`A${menuStartRow}:A${menuEndRow}`).format.numberFormat =
  "yyyy-mm-dd";
menuDetails.getRange(`E${menuStartRow}:E${menuEndRow}`).format.numberFormat =
  currencyFormat;
menuDetails.getRange(`F${menuStartRow}:F${menuEndRow}`).format.numberFormat =
  "#,##0";
menuDetails.getRange(`D${menuStartRow}:D${menuEndRow}`).format.wrapText = true;
setWidths(menuDetails, [14, 16, 23, 52, 17, 26], menuEndRow);

const sourceHeaderRow = 4;
const sourceStartRow = 5;
const sourceEndRow = sourceStartRow + sourceRows.length - 1;
styleTitleAndNote(
  sourceData,
  "H",
  "ClubFeast — Source & Scope Check",
  "Menu Pricing is formula-driven as source Line Total divided by source Quantity. Location counts reconcile the account-wide August extraction.",
);
sourceData.getRange("A4:D4").values = [[
  "Order ID",
  "Menu Line",
  "Source Line Total",
  "Source Quantity",
]];
sourceData.getRange(`A${sourceStartRow}:D${sourceEndRow}`).values = sourceRows;
const sourceTable = sourceData.tables.add(
  `A${sourceHeaderRow}:D${sourceEndRow}`,
  true,
  "ClubFeastSourceData",
);
sourceTable.style = "TableStyleMedium2";
styleDataTable(
  sourceData,
  sourceData.getRange("A4:D4"),
  sourceData.getRange(`A${sourceStartRow}:D${sourceEndRow}`),
);
sourceData.getRange(`C${sourceStartRow}:C${sourceEndRow}`).format.numberFormat =
  currencyFormat;
sourceData.getRange(`B${sourceStartRow}:D${sourceEndRow}`).format.horizontalAlignment =
  "right";
sourceData.getRange("F4:H4").values = [["Branch", "Restaurant ID", "August Orders"]];
sourceData.getRange("F5:G7").values = [
  ["Geary", "3904"],
  ["Tennessee", "4088"],
  ["Palo Alto", "4198"],
];
sourceData.getRange("H5").formulas = [[
  `=COUNTIF('Order Summary'!$B$${orderStartRow}:$B$${orderEndRow},F5)`,
]];
sourceData.getRange("H5:H7").fillDown();
sourceData.getRange("F8:G8").values = [["TOTAL", ""]];
sourceData.getRange("H8").formulas = [["=SUM(H5:H7)"]];
sourceData.getRange("F4:H4").format = {
  fill: palette.teal,
  font: { bold: true, color: palette.white },
  wrapText: true,
};
sourceData.getRange("F5:H8").format = {
  font: { name: "Aptos", size: 10, color: palette.ink },
  borders: { preset: "all", style: "thin", color: palette.border },
};
sourceData.getRange("F8:H8").format = {
  fill: palette.total,
  font: { bold: true, color: palette.navy },
  borders: { preset: "doubleBottom", style: "thin", color: palette.navy },
};
sourceData.getRange("H5:H8").format.numberFormat = "#,##0";
sourceData.freezePanes.freezeRows(4);
setWidths(sourceData, [23, 12, 19, 17, 3, 16, 16, 16], sourceEndRow);

const orderInspect = await workbook.inspect({
  kind: "table",
  range: `Order Summary!A1:I${Math.min(orderEndRow, 12)}`,
  include: "values,formulas",
  tableMaxRows: 12,
  tableMaxCols: 9,
  maxChars: 7000,
});
const menuInspect = await workbook.inspect({
  kind: "table",
  range: `Menu Details!A1:F${Math.min(menuEndRow, 12)}`,
  include: "values,formulas",
  tableMaxRows: 12,
  tableMaxCols: 6,
  maxChars: 7000,
});
const scopeInspect = await workbook.inspect({
  kind: "table",
  range: "Source Data!F4:H8",
  include: "values,formulas",
  tableMaxRows: 8,
  tableMaxCols: 3,
  maxChars: 3000,
});
const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 300 },
  summary: "Corrected ClubFeast workbook formula error scan",
});

await fs.mkdir(outputDir, { recursive: true });
await fs.mkdir(previewDir, { recursive: true });
for (const [sheetName, range, fileName] of [
  ["Order Summary", "A1:I22", "order_summary.png"],
  ["Menu Details", "A1:F22", "menu_details.png"],
  ["Source Data", "A1:H22", "source_data.png"],
]) {
  const preview = await workbook.render({
    sheetName,
    range,
    scale: 1,
    format: "png",
  });
  await fs.writeFile(
    path.join(previewDir, fileName),
    new Uint8Array(await preview.arrayBuffer()),
  );
}

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);

console.log(
  JSON.stringify(
    {
      outputPath,
      counts: {
        orders: orderRows.length,
        menuRows: menuRows.length,
        menuQuantity: menuRows.reduce((sum, row) => sum + row[5], 0),
      },
      totals: {
        grossSales: orderRows.reduce((sum, row) => sum + row[3], 0),
        costAdjustment: orderRows.reduce((sum, row) => sum + row[4], 0),
        tax: orderRows.reduce((sum, row) => sum + row[7], 0),
        orderTotal: orderRows.reduce((sum, row) => sum + row[8], 0),
      },
      orderInspect: orderInspect.ndjson,
      menuInspect: menuInspect.ndjson,
      scopeInspect: scopeInspect.ndjson,
      formulaErrors: errors.ndjson,
    },
    null,
    2,
  ),
);
