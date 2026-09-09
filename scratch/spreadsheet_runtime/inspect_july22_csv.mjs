import fs from "node:fs/promises";
import { Workbook } from "@oai/artifact-tool";

const csvPath = "/Users/barnabaskim/Downloads/july22.csv";
const csvText = await fs.readFile(csvPath, "utf8");
const workbook = await Workbook.fromCSV(csvText, { sheetName: "Manual Check" });

const overview = await workbook.inspect({
  kind: "workbook,sheet,table",
  maxChars: 12000,
  tableMaxRows: 50,
  tableMaxCols: 20,
  tableMaxCellChars: 160,
});

console.log(overview.ndjson);
