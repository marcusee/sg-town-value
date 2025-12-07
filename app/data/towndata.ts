import { NO_DATA_COLOR } from "./heatMapColor";

export interface TownInfo {
  id: string;
  name: string;
  x: number;
  y: number;
  avgPsf: number;
  color: string;
}

export const initialTownInfo: TownInfo[] = [
  { id: "sengkang",        name: "SENGKANG",        x: 103.8951, y: 1.3911, avgPsf: 0, color :  NO_DATA_COLOR},
  { id: "punggol",         name: "PUNGGOL",         x: 103.9065, y: 1.4055, avgPsf: 0, color :  NO_DATA_COLOR },
  { id: "woodlands",       name: "WOODLANDS",       x: 103.7865, y: 1.4360, avgPsf: 0, color :  NO_DATA_COLOR },
  { id: "yishun",          name: "YISHUN",          x: 103.8354, y: 1.4297, avgPsf: 0, color :  NO_DATA_COLOR },
  { id: "tampines",        name: "TAMPINES",        x: 103.9454, y: 1.3536, avgPsf: 0, color :  NO_DATA_COLOR },
  { id: "jurong-west",     name: "JURONG WEST",     x: 103.7038, y: 1.3527, avgPsf: 0, color :  NO_DATA_COLOR },
  { id: "bedok",           name: "BEDOK",           x: 103.9294, y: 1.3236, avgPsf: 0, color :  NO_DATA_COLOR },
  { id: "hougang",         name: "HOUGANG",         x: 103.8870, y: 1.3736, avgPsf: 0, color :  NO_DATA_COLOR },
  { id: "choa-chu-kang",   name: "CHOA CHU KANG",   x: 103.7445, y: 1.3856 , avgPsf: 0, color :  NO_DATA_COLOR},
  { id: "bukit-batok",     name: "BUKIT BATOK",     x: 103.7490, y: 1.3496, avgPsf: 0, color :  NO_DATA_COLOR },
  { id: "ang-mo-kio",      name: "ANG MO KIO",      x: 103.8493, y: 1.3691, avgPsf: 0, color :  NO_DATA_COLOR },
  { id: "bukit-merah",     name: "BUKIT MERAH",     x: 103.8190, y: 1.2819 , avgPsf: 0, color :  NO_DATA_COLOR},
  { id: "bukit-panjang",   name: "BUKIT PANJANG",   x: 103.7661, y: 1.3780 , avgPsf: 0, color :  NO_DATA_COLOR},
  { id: "toa-payoh",       name: "TOA PAYOH",       x: 103.8463, y: 1.3341 , avgPsf: 0, color :  NO_DATA_COLOR},
  { id: "kallang-whampoa", name: "KALLANG/WHAMPOA", x: 103.8667, y: 1.3190 , avgPsf: 0, color :  NO_DATA_COLOR},
  { id: "sembawang",       name: "SEMBAWANG",       x: 103.8198, y: 1.4432 , avgPsf: 0, color :  NO_DATA_COLOR},
  { id: "pasir-ris",       name: "PASIR RIS",       x: 103.9646, y: 1.3720 , avgPsf: 0, color :  NO_DATA_COLOR},
  { id: "queenstown",      name: "QUEENSTOWN",      x: 103.8060, y: 1.2940 , avgPsf: 0, color :  NO_DATA_COLOR},
  { id: "geylang",         name: "GEYLANG",         x: 103.8820, y: 1.3180 , avgPsf: 0, color :  NO_DATA_COLOR},
  { id: "clementi",        name: "CLEMENTI",        x: 103.7702, y: 1.3151 , avgPsf: 0, color :  NO_DATA_COLOR},
  { id: "jurong-east",     name: "JURONG EAST",     x: 103.7396, y: 1.3331 , avgPsf: 0, color :  NO_DATA_COLOR},
  { id: "serangoon",       name: "SERANGOON",       x: 103.8730, y: 1.3541 , avgPsf: 0, color :  NO_DATA_COLOR},
  { id: "bishan",          name: "BISHAN",          x: 103.8497, y: 1.3505 , avgPsf: 0, color :  NO_DATA_COLOR},
  { id: "central-area",    name: "CENTRAL AREA",    x: 103.8514, y: 1.2890 , avgPsf: 0, color :  NO_DATA_COLOR},
  { id: "marine-parade",   name: "MARINE PARADE",   x: 103.9020, y: 1.3020 , avgPsf: 0, color :  NO_DATA_COLOR},
  { id: "bukit-timah",     name: "BUKIT TIMAH",     x: 103.7910, y: 1.3294 , avgPsf: 0, color :  NO_DATA_COLOR}
];
