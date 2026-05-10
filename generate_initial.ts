import fs from "fs";
import { fileURLToPath } from "url";
import { CONFIG } from "./app/config/config";
import { NO_DATA_COLOR } from "./app/data/heatMapColor";
import { PriceMetric, TownPriceInfo } from "./app/types/town";
import { computeTownPrices, createColorScale, filterTransactions, ColorScale } from "./app/util/psfCalculations";


export interface TownInfo {
  id: string;
  name: string;
  x: number;
  y: number;
  avgPsf: number;
  color: string;
  displayValue: number;
  medianPsf: number;
}

const initialTownInfo: TownInfo[] = [
    { id: "sengkang", name: "SENGKANG", x: 103.8951, y: 1.3911, avgPsf: 0, color: NO_DATA_COLOR, displayValue: 0,medianPsf: 0},
    { id: "punggol", name: "PUNGGOL", x: 103.9065, y: 1.4055, avgPsf: 0, color: NO_DATA_COLOR , displayValue: 0,medianPsf: 0},
    { id: "woodlands", name: "WOODLANDS", x: 103.7865, y: 1.4360, avgPsf: 0, color: NO_DATA_COLOR , displayValue: 0,medianPsf: 0},
    { id: "yishun", name: "YISHUN", x: 103.8354, y: 1.4297, avgPsf: 0, color: NO_DATA_COLOR , displayValue: 0,medianPsf: 0},
    { id: "tampines", name: "TAMPINES", x: 103.9454, y: 1.3536, avgPsf: 0, color: NO_DATA_COLOR , displayValue: 0,medianPsf: 0},
    { id: "jurong-west", name: "JURONG WEST", x: 103.7038, y: 1.3527, avgPsf: 0, color: NO_DATA_COLOR , displayValue: 0,medianPsf: 0},
    { id: "bedok", name: "BEDOK", x: 103.9294, y: 1.3236, avgPsf: 0, color: NO_DATA_COLOR , displayValue: 0 ,medianPsf: 0},
    { id: "hougang", name: "HOUGANG", x: 103.8870, y: 1.3736, avgPsf: 0, color: NO_DATA_COLOR , displayValue: 0,medianPsf: 0},
    { id: "choa-chu-kang", name: "CHOA CHU KANG", x: 103.7445, y: 1.3856, avgPsf: 0, color: NO_DATA_COLOR , displayValue: 0,medianPsf: 0},
    { id: "bukit-batok", name: "BUKIT BATOK", x: 103.7490, y: 1.3496, avgPsf: 0, color: NO_DATA_COLOR , displayValue: 0,medianPsf: 0},
    { id: "ang-mo-kio", name: "ANG MO KIO", x: 103.8493, y: 1.3691, avgPsf: 0, color: NO_DATA_COLOR , displayValue: 0,medianPsf: 0},
    { id: "bukit-merah", name: "BUKIT MERAH", x: 103.8190, y: 1.2819, avgPsf: 0, color: NO_DATA_COLOR , displayValue: 0,medianPsf: 0},
    { id: "bukit-panjang", name: "BUKIT PANJANG", x: 103.7661, y: 1.3780, avgPsf: 0, color: NO_DATA_COLOR , displayValue: 0,medianPsf: 0},
    { id: "toa-payoh", name: "TOA PAYOH", x: 103.8463, y: 1.3341, avgPsf: 0, color: NO_DATA_COLOR , displayValue: 0,medianPsf: 0},
    { id: "kallang-whampoa", name: "KALLANG/WHAMPOA", x: 103.8667, y: 1.3190, avgPsf: 0, color: NO_DATA_COLOR , displayValue: 0,medianPsf: 0},
    { id: "sembawang", name: "SEMBAWANG", x: 103.8198, y: 1.4432, avgPsf: 0, color: NO_DATA_COLOR , displayValue: 0,medianPsf: 0},
    { id: "pasir-ris", name: "PASIR RIS", x: 103.9646, y: 1.3720, avgPsf: 0, color: NO_DATA_COLOR , displayValue: 0,medianPsf: 0},
    { id: "queenstown", name: "QUEENSTOWN", x: 103.8060, y: 1.2940, avgPsf: 0, color: NO_DATA_COLOR , displayValue: 0,medianPsf: 0},
    { id: "geylang", name: "GEYLANG", x: 103.8920, y: 1.3180, avgPsf: 0, color: NO_DATA_COLOR , displayValue: 0,medianPsf: 0},
    { id: "clementi", name: "CLEMENTI", x: 103.7702, y: 1.3151, avgPsf: 0, color: NO_DATA_COLOR , displayValue: 0,medianPsf: 0},
    { id: "jurong-east", name: "JURONG EAST", x: 103.7396, y: 1.3331, avgPsf: 0, color: NO_DATA_COLOR , displayValue: 0,medianPsf: 0},
    { id: "serangoon", name: "SERANGOON", x: 103.8730, y: 1.3541, avgPsf: 0, color: NO_DATA_COLOR , displayValue: 0,medianPsf: 0},
    { id: "bishan", name: "BISHAN", x: 103.8497, y: 1.3505, avgPsf: 0, color: NO_DATA_COLOR , displayValue: 0,medianPsf: 0},
    { id: "central-area", name: "CENTRAL AREA", x: 103.8514, y: 1.2890, avgPsf: 0, color: NO_DATA_COLOR , displayValue: 0,medianPsf: 0},
    { id: "marine-parade", name: "MARINE PARADE", x: 103.9020, y: 1.3020, avgPsf: 0, color: NO_DATA_COLOR , displayValue: 0,medianPsf: 0},
    { id: "bukit-timah", name: "BUKIT TIMAH", x: 103.7910, y: 1.3294, avgPsf: 0, color: NO_DATA_COLOR , displayValue: 0,medianPsf: 0,medianPsf: 0}
];



function applyColors(towns: TownPriceInfo[], metric: PriceMetric, colorScale: ColorScale): TownPriceInfo[] {
  return towns.map(town => {
    const psf = metric === "avg" ? town.avgPsf : town.medianPsf;
    return { ...town, displayValue: psf, color: colorScale.getColor(psf) };
  });
}



async function main() {
  try {
    console.log("Fetching resale data...");
    const data = await fetch(CONFIG.R2_HDB_DATA_URL).then(r => r.json());
    console.log(`Fetched ${data.length} records`);

    const towns = computeTownPrices(filterTransactions(data, {
      year: String(new Date().getFullYear()),
      flatType: "ALL",
      storyRange: "ALL",
      commencement: "ALL"
    }), initialTownInfo);
    const colorScale = createColorScale(towns, "avg");
    const townsData = applyColors(towns, "avg", colorScale)
      .map(({ id, name, x, y, avgPsf, color, medianPsf }) => ({ id, name, x, y, avgPsf, medianPsf, color, displayValue: avgPsf }));

    const output =
`import { NO_DATA_COLOR } from "./heatMapColor";

export interface TownInfo {
  id: string;
  name: string;
  x: number;
  y: number;
  avgPsf: number;
  color: string;
  displayValue: number;
  medianPsf: number;
}

export const initialTownInfo: TownInfo[] = ${JSON.stringify(townsData, null, 2)};`;

    const outPath = fileURLToPath(new URL("./app/data/towndata.ts", import.meta.url));
    fs.writeFileSync(outPath, output);
    console.log("Written to app/data/towndata.ts");
  } catch (err) {
    console.error("Failed:", err);
    process.exit(1);
  }
}

main();