"use client"

import { create } from "zustand";
import { initialTownInfo, TownInfo } from "../data/towndata";
import { resaleData } from "../data/resaleData";
import { COLORS, NO_DATA_COLOR } from "../data/heatMapColor";
import { ResaleRecord } from "../types/resale";


interface ColorScale {
  min: number;
  max: number;
  getColor: (psf: number) => string;
}

export interface TransactionFilters {
  year: string;
  flatType: string;
  storyRange: string;
  commencement: string;
}

export type PriceMetric = "avg" | "median";

// Extended TownInfo with both metrics
export interface TownPriceInfo extends TownInfo {
  avgPsf: number;
  medianPsf: number;
  displayValue : number;
  transactionCount: number;
}

interface TownStoreState {
  towns: TownPriceInfo[];
  colorScale: ColorScale | null;
  priceMetric: PriceMetric;
  setPriceMetric: (metric: PriceMetric) => void;
  updateTownPrices: (filters?: TransactionFilters) => void;
}


const SQM_TO_SQFT = 10.7639;


function filterTransactions(filters?: TransactionFilters): ResaleRecord[] {
  let filtered = [...resaleData];
  if (filters) {
    if (filters.year && filters.year !== "ALL") {
      filtered = filtered.filter(t => t.month.startsWith(filters.year));
    }
    if (filters.flatType && filters.flatType !== "ALL") {
      filtered = filtered.filter(t => t.flat_type === filters.flatType);
    }
    if (filters.storyRange && filters.storyRange !== "ALL") {
      filtered = filtered.filter(t => t.storey_range === filters.storyRange);
    }
    if (filters.commencement && filters.commencement !== "ALL") {
      filtered = filtered.filter(t => t.lease_commence_date === filters.commencement);
    }
  } else {
    // filtered = filtered.filter(t => t.month.startsWith("2025"));
  }

  return filtered;
}


function calculatePsfFromTransaction(transaction: any): number {
  const price = parseFloat(transaction.resale_price);
  const areaSqm = parseFloat(transaction.floor_area_sqm);
  const areaSqft = areaSqm * SQM_TO_SQFT;
  return price / areaSqft;
}


function getMedian(values: number[]): number {
  if (values.length === 0) return 0;

  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }

  return sorted[mid];
}


function getAverage(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
}


function computeTownPrices(transactions: any[], baseTownInfo: TownInfo[]): TownPriceInfo[] {
  // Group PSF values by town
  const townPsfMap: Record<string, number[]> = {};

  transactions.forEach(transaction => {
    const town = transaction.town;
    const psf = calculatePsfFromTransaction(transaction);

    if (!townPsfMap[town]) {
      townPsfMap[town] = [];
    }
    townPsfMap[town].push(psf);
  });

  // Calculate both metrics for each town
  return baseTownInfo.map(town => {
    const psfValues = townPsfMap[town.name] || [];

    return {
      ...town,
      avgPsf: Math.round(getAverage(psfValues)),
      medianPsf: Math.round(getMedian(psfValues)),
      displayValue : 0,
      transactionCount: psfValues.length
    };
  });
}


function createColorScale(towns: TownPriceInfo[], metric: PriceMetric): ColorScale {
  const psfValues = towns
    .map(t => metric === "avg" ? t.avgPsf : t.medianPsf)
    .filter(v => v > 0);

  if (psfValues.length === 0) {
    return { getColor: () => NO_DATA_COLOR, min: 0, max: 0 };
  }

  const min = Math.min(...psfValues);
  const max = Math.max(...psfValues);

  const getColor = (psf: number): string => {
    if (psf <= 0) return NO_DATA_COLOR;

    const normalized = (psf - min) / (max - min);
    const index = Math.min(Math.floor(normalized * COLORS.length), COLORS.length - 1);

    return COLORS[index];
  };

  return { getColor, min, max };
}


export const useTownStore = create<TownStoreState>((set, get) => ({
  towns: initialTownInfo.map(town => ({
    ...town,
    avgPsf: 0,
    medianPsf: 0,
    displayValue: 0,
    transactionCount: 0
  })),
  colorScale: null,
  priceMetric: "avg",

  setPriceMetric: (metric: PriceMetric) => {

    const { towns } = get();
    const colorScale = createColorScale(towns, metric);

    // Update colors based on new metric
    const townsWithColors = towns.map(town => ({
      ...town,
      displayValue : metric === "avg" ? town.avgPsf : town.medianPsf,
      color: colorScale.getColor(metric === "avg" ? town.avgPsf : town.medianPsf)
    }));

    set({ priceMetric: metric, towns: townsWithColors, colorScale });
  },

  updateTownPrices: (filters?: TransactionFilters) => {
    const { priceMetric } = get();
    const transactions = filterTransactions(filters);
    const towns = computeTownPrices(transactions, initialTownInfo);
    const colorScale = createColorScale(towns, priceMetric);
    const townsWithColors = towns.map(town  => ({
      ...town,
      displayValue : priceMetric === "avg" ? town.avgPsf : town.medianPsf,
      color: colorScale.getColor(priceMetric === "avg" ? town.avgPsf : town.medianPsf)
    }));
    set({ towns: townsWithColors, colorScale });
  }
}));