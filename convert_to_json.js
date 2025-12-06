const fs = require("fs");
const Papa = require("papaparse");

// Load CSV
const csv = fs.readFileSync("./app/data/resale_flat_price.csv", "utf8");

// Parse
const { data } = Papa.parse(csv, {
  header: true,    // CSV → object
  skipEmptyLines: true
});

// Write to .ts file
const output =
`export const resaleData = ${JSON.stringify(data, null, 2)} as const;`;

fs.writeFileSync("./app/data/resaleData.ts", output);

console.log("✔ Done: resale-data.ts created.");
