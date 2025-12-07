"use client"

import { create } from "zustand";
import { initialTownInfo, TownInfo } from "../data/towndata";
import { resaleData } from "../data/resaleData";
import { COLORS, NO_DATA_COLOR } from "../data/heatMapColor";


interface ColorScale {
  min: number; max: number; getColor: (psf: number) => string 
}

interface TownInfoState {
  townInfos: TownInfo[];
  colorScale: ColorScale | null;
  calculateAvgPsf: () => void;
}


export const useTownStore = create<TownInfoState>((set) => ({
  townInfos: initialTownInfo, 
  colorScale: null,               
  calculateAvgPsf: () => {
    const updatedTownInfo = calculateAvgPsfByTown(resaleData, initialTownInfo);
    // Create color scale based on calculated data
    const colorScale = createColorScale(updatedTownInfo);
    // Add colors to towns
    const townsWithColors = updatedTownInfo.map(town => ({
      ...town,
      color: colorScale.getColor(town.avgPsf)
    }));
    return set({ townInfos: townsWithColors, colorScale })
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



export function createColorScale(towns: TownInfo[]) {
  const psfValues = towns.map(t => t.avgPsf).filter(v => v > 0);
  
  if (psfValues.length === 0) {
    return { getColor: () => NO_DATA_COLOR, min: 0, max: 0 };
  }
  
  const min = Math.min(...psfValues);
  const max = Math.max(...psfValues);

  const getColor = (avgPsf: number): string => {
    if (avgPsf <= 0) return NO_DATA_COLOR;
    
    const normalized = (avgPsf - min) / (max - min);
    const index = Math.min(Math.floor(normalized * COLORS.length), COLORS.length - 1);
    
    return COLORS[index];
  };

  return { getColor, min, max, colors: COLORS };
}