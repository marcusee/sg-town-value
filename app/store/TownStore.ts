"use client"

import { create } from "zustand";
import { initialTownInfo, TownInfo } from "../data/towndata";
import { resaleData } from "../data/resaleData";
import { COLORS, NO_DATA_COLOR } from "../data/heatMapColor";
import { ResaleRecord } from "../types/resale";


interface ColorScale {
  min: number; max: number; getColor: (psf: number) => string 
}

export interface TransactionFilters {
  year : string;
  flatType : string;
  storyRange: string;
  commencement : string;
}


interface TownInfoState {
  townInfos: TownInfo[];
  colorScale: ColorScale | null;
  calculateAvgPsf: (filters? : TransactionFilters) => void;
}


function filterResaleData(filters? : TransactionFilters) : ResaleRecord[] {
    let filteredData = [...resaleData];
    // Apply filters if provided
    if (filters) {
      if (filters.year) {
        filteredData = filteredData.filter(t => t.month.startsWith(filters.year));
      }
      if (filters.flatType && filters.flatType !== "ALL") {
        filteredData = filteredData.filter(t => t.flat_type === filters.flatType);
      }
      if (filters.storyRange && filters.storyRange !== "ALL") {
        filteredData = filteredData.filter(t => t.storey_range === filters.storyRange);
      }
      if (filters.commencement && filters.commencement !== "ALL") {
        filteredData = filteredData.filter(t => t.lease_commence_date === filters.commencement);
      }
    } else {
      filteredData = filteredData.filter(t => t.month.startsWith("2025"));
    }

    return filteredData
}

export const useTownStore = create<TownInfoState>((set) => ({
  townInfos: initialTownInfo, 
  colorScale: null,               
  calculateAvgPsf: (filters? : TransactionFilters) => {

    let filteredData = filterResaleData(filters);

    const updatedTownInfo = calculateAvgPsfByTown(filteredData, initialTownInfo);
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

  // Group transactions by town and calculate PSF for each
  const townStats: Record<string, { totalPsf: number; count: number }> = {};

  resaleData.forEach(transaction => {
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

function calculateMedianPsfByTown(resaleData: any[], townInfo: TownInfo[]): TownInfo[] {
  const townPsfValues: Record<string, number[]> = {};

  resaleData.forEach(transaction => {
    const town = transaction.town;
    const price = parseFloat(transaction.resale_price);
    const areaSqm = parseFloat(transaction.floor_area_sqm);
    const areaSqft = areaSqm * SQM_TO_SQFT;
    const psf = price / areaSqft;

    if (!townPsfValues[town]) {
      townPsfValues[town] = [];
    }
    townPsfValues[town].push(psf);
  });

  return townInfo.map(town => ({
    ...town,
    avgPsf: townPsfValues[town.name]
      ? Math.round(calculateMedian(townPsfValues[town.name]))
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