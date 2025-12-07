"use client"

import { create } from "zustand";
import { initialTownInfo, TownInfo } from "../data/towndata";
import { resaleData } from "../data/resaleData";

interface TownInfoState {
  townInfos: TownInfo[];
  setTownInfo: (partial: TownInfo[]) => void;
  calculateAvgPsf: () => void;
}


export const useTownStore = create<TownInfoState>((set) => ({
  townInfos: initialTownInfo,                         // what you're hovering
  setTownInfo: (townInfo: TownInfo[]) => set({ townInfos: townInfo }),
  calculateAvgPsf: () => {
    const updatedTownInfo = calculateAvgPsfByTown(resaleData, initialTownInfo);
    return set({ townInfos: updatedTownInfo })
  }
}));


const SQM_TO_SQFT = 10.7639;

function calculateAvgPsfByTown(resaleData: any[], townInfo: TownInfo[]): TownInfo[] {
  const year = 2025;
  const startMonth = `${year}-01`;
  const endMonth = `${year}-12`;

  const filtered = resaleData.filter(t => {
    if (startMonth && t.month < startMonth) return false;
    if (endMonth && t.month > endMonth) return false;
    return true;
  });


  // Group transactions by town and calculate PSF for each
  const townStats: Record<string, { totalPsf: number; count: number }> = {};

  filtered.forEach(transaction => {
    const town = transaction.town;
    const price = parseFloat(transaction.resale_price);
    const areaSqm = parseFloat(transaction.floor_area_sqm);
    const areaSqft = areaSqm * SQM_TO_SQFT;
    const psf = price / areaSqft;

    if (!townStats[town]) {
      townStats[town] = { totalPsf: 0, count: 0 };
    }
    townStats[town].totalPsf += psf;
    townStats[town].count += 1;
  });

  // Update townInfo with calculated averages
  return townInfo.map(town => ({
    ...town,
    avgPsf: townStats[town.name]
      ? Math.round(townStats[town.name].totalPsf / townStats[town.name].count)
      : 0
  }));
}

// Usage