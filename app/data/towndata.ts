import { NO_DATA_COLOR } from "./heatMapColor";

export interface TownInfo {
  id: string;
  name: string;
  x: number;
  y: number;
  avgPsf: number;
  color: string;
  displayValue: number;
}

export const initialTownInfo: TownInfo[] = [
  {
    "id": "sengkang",
    "name": "SENGKANGG",
    "x": 103.8951,
    "y": 1.3911,
    "avgPsf": 650,
    "color": "#bef264",
    "displayValue": 650
  },
  {
    "id": "punggol",
    "name": "PUNGGOL",
    "x": 103.9065,
    "y": 1.4055,
    "avgPsf": 691,
    "color": "#fde047",
    "displayValue": 691
  },
  {
    "id": "woodlands",
    "name": "WOODLANDS",
    "x": 103.7865,
    "y": 1.436,
    "avgPsf": 541,
    "color": "#7dd3fc",
    "displayValue": 541
  },
  {
    "id": "yishun",
    "name": "YISHUN",
    "x": 103.8354,
    "y": 1.4297,
    "avgPsf": 574,
    "color": "#67e8f9",
    "displayValue": 574
  },
  {
    "id": "tampines",
    "name": "TAMPINES",
    "x": 103.9454,
    "y": 1.3536,
    "avgPsf": 658,
    "color": "#bef264",
    "displayValue": 658
  },
  {
    "id": "jurong-west",
    "name": "JURONG WEST",
    "x": 103.7038,
    "y": 1.3527,
    "avgPsf": 531,
    "color": "#7dd3fc",
    "displayValue": 531
  },
  {
    "id": "bedok",
    "name": "BEDOK",
    "x": 103.9294,
    "y": 1.3236,
    "avgPsf": 628,
    "color": "#86efac",
    "displayValue": 628
  },
  {
    "id": "hougang",
    "name": "HOUGANG",
    "x": 103.887,
    "y": 1.3736,
    "avgPsf": 621,
    "color": "#86efac",
    "displayValue": 621
  },
  {
    "id": "choa-chu-kang",
    "name": "CHOA CHU KANG",
    "x": 103.7445,
    "y": 1.3856,
    "avgPsf": 532,
    "color": "#7dd3fc",
    "displayValue": 532
  },
  {
    "id": "bukit-batok",
    "name": "BUKIT BATOK",
    "x": 103.749,
    "y": 1.3496,
    "avgPsf": 639,
    "color": "#86efac",
    "displayValue": 639
  },
  {
    "id": "ang-mo-kio",
    "name": "ANG MO KIO",
    "x": 103.8493,
    "y": 1.3691,
    "avgPsf": 697,
    "color": "#fde047",
    "displayValue": 697
  },
  {
    "id": "bukit-merah",
    "name": "BUKIT MERAH",
    "x": 103.819,
    "y": 1.2819,
    "avgPsf": 800,
    "color": "#fb923c",
    "displayValue": 800
  },
  {
    "id": "bukit-panjang",
    "name": "BUKIT PANJANG",
    "x": 103.7661,
    "y": 1.378,
    "avgPsf": 581,
    "color": "#67e8f9",
    "displayValue": 581
  },
  {
    "id": "toa-payoh",
    "name": "TOA PAYOH",
    "x": 103.8463,
    "y": 1.3341,
    "avgPsf": 782,
    "color": "#fbbf24",
    "displayValue": 782
  },
  {
    "id": "kallang-whampoa",
    "name": "KALLANG/WHAMPOA",
    "x": 103.8667,
    "y": 1.319,
    "avgPsf": 801,
    "color": "#fb923c",
    "displayValue": 801
  },
  {
    "id": "sembawang",
    "name": "SEMBAWANG",
    "x": 103.8198,
    "y": 1.4432,
    "avgPsf": 628,
    "color": "#86efac",
    "displayValue": 628
  },
  {
    "id": "pasir-ris",
    "name": "PASIR RIS",
    "x": 103.9646,
    "y": 1.372,
    "avgPsf": 591,
    "color": "#67e8f9",
    "displayValue": 591
  },
  {
    "id": "queenstown",
    "name": "QUEENSTOWN",
    "x": 103.806,
    "y": 1.294,
    "avgPsf": 913,
    "color": "#ef4444",
    "displayValue": 913
  },
  {
    "id": "geylang",
    "name": "GEYLANG",
    "x": 103.892,
    "y": 1.318,
    "avgPsf": 705,
    "color": "#fde047",
    "displayValue": 705
  },
  {
    "id": "clementi",
    "name": "CLEMENTI",
    "x": 103.7702,
    "y": 1.3151,
    "avgPsf": 750,
    "color": "#fcd34d",
    "displayValue": 750
  },
  {
    "id": "jurong-east",
    "name": "JURONG EAST",
    "x": 103.7396,
    "y": 1.3331,
    "avgPsf": 556,
    "color": "#7dd3fc",
    "displayValue": 556
  },
  {
    "id": "serangoon",
    "name": "SERANGOON",
    "x": 103.873,
    "y": 1.3541,
    "avgPsf": 670,
    "color": "#bef264",
    "displayValue": 670
  },
  {
    "id": "bishan",
    "name": "BISHAN",
    "x": 103.8497,
    "y": 1.3505,
    "avgPsf": 750,
    "color": "#fcd34d",
    "displayValue": 750
  },
  {
    "id": "central-area",
    "name": "CENTRAL AREA",
    "x": 103.8514,
    "y": 1.289,
    "avgPsf": 913,
    "color": "#ef4444",
    "displayValue": 913
  },
  {
    "id": "marine-parade",
    "name": "MARINE PARADE",
    "x": 103.902,
    "y": 1.302,
    "avgPsf": 676,
    "color": "#bef264",
    "displayValue": 676
  },
  {
    "id": "bukit-timah",
    "name": "BUKIT TIMAH",
    "x": 103.791,
    "y": 1.3294,
    "avgPsf": 805,
    "color": "#fb923c",
    "displayValue": 805
  }
];