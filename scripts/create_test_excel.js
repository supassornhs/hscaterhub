import * as XLSX from 'xlsx';
import fs from 'fs';

// Construct the data array matching the image
const data = [
  ["Count", "Meal", "Options", "Special Notes", "Customer", "Club", "Pickup"],
  // Green Curry section
  ["8x", "Green Curry Hatyai Crispy Chicken Rice", "", "", "Matt K.", "FL", "10:30AM"],
  ["", "Green Curry Hatyai Crispy Chicken Rice", "Add Side: Gyoza with Green Chilli Mayo", "", "Caspar B.", "SN", "10:30AM"],
  ["", "Green Curry Hatyai Crispy Chicken Rice", "Add Side: Bangkok Pepper Tofu", "", "Justin J.", "YD", "10:45AM"],
  ["", "Green Curry Hatyai Crispy Chicken Rice", "", "", "Juan Carlos T.", "YH", "10:45AM"],
  ["", "Green Curry Hatyai Crispy Chicken Rice", "", "", "Norm P.", "YH", "10:45AM"],
  ["", "Green Curry Hatyai Crispy Chicken Rice", "Add Side: Spring Roll with Thai Sweet Chilli", "", "Andrew H.", "GO", "11:00AM"],
  ["", "Green Curry Hatyai Crispy Chicken Rice", "", "", "Carlos P.", "V", "11:00AM"],
  ["", "Green Curry Hatyai Crispy Chicken Rice", "", "", "Zi J.", "V", "11:00AM"],
  // Charcoal Grilled section
  ["11x", "Charcoal-Grilled BBQ Chicken Rice", "", "", "Eric C.", "FL", "10:30AM"],
  ["", "Charcoal-Grilled BBQ Chicken Rice", "", "sauce on the side", "Immanuel B.", "SN", "10:30AM"],
  ["", "Charcoal-Grilled BBQ Chicken Rice", "Add Side: Gyoza with Green Chilli Mayo", "", "Jake B.", "SN", "10:30AM"]
];

const ws = XLSX.utils.aoa_to_sheet(data);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Orders");

const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
fs.writeFileSync('test_forkable.xlsx', buffer);
console.log("Written test_forkable.xlsx");
