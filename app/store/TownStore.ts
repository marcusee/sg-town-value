"use client"

import { create } from "zustand";
import { initialTownInfo } from "../data/towndata";
import { COLORS, NO_DATA_COLOR } from "../data/heatMapColor";
import { ResaleRecord } from "../types/resale";
import { CONFIG } from "../config/config";
import { filterTransactions, computeTownPrices } from "../util/psfCalculations";
import { TransactionFilters, PriceMetric, TownPriceInfo } from "../types/town";

export type { TransactionFilters, PriceMetric, TownPriceInfo };

interface ColorScale {
  min: number;
  max: number;
  getColor: (psf: number) => string;
}

interface TownStoreState {
  resaleData: ResaleRecord[];
  isLoading: boolean;
  fetchResaleData: () => Promise<void>;
  towns: TownPriceInfo[];
  colorScale: ColorScale | null;
  priceMetric: PriceMetric;
  setPriceMetric: (metric: PriceMetric) => void;
  updateTownPrices: (filters?: TransactionFilters) => void;
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
  resaleData: [],
  isLoading: false,

  fetchResaleData: async () => {
    const { resaleData, isLoading } = get();
    if (resaleData.length > 0 || isLoading) return;
    set({ isLoading: true });
     let data: ResaleRecord[] = [];
    try {

      data = await fetch(CONFIG.R2_HDB_DATA_URL).then(r => r.json());
    } catch (error) {
      console.error("Error fetching resale data:", error);
    }
    set({ resaleData: data, isLoading: false });
    get().updateTownPrices();
  },

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
    const townsWithColors = towns.map(town => ({
      ...town,
      displayValue: metric === "avg" ? town.avgPsf : town.medianPsf,
      color: colorScale.getColor(metric === "avg" ? town.avgPsf : town.medianPsf)
    }));
    set({ priceMetric: metric, towns: townsWithColors, colorScale });
  },

  updateTownPrices: (filters?: TransactionFilters) => {
    console.log("Updating town prices with filters:", filters);
    const start = performance.now();

    const { priceMetric, resaleData } = get();
    const transactions = filterTransactions(resaleData, filters);
    const towns = computeTownPrices(transactions, initialTownInfo);
    const colorScale = createColorScale(towns, priceMetric);
    const townsWithColors = towns.map(town => ({
      ...town,
      displayValue: priceMetric === "avg" ? town.avgPsf : town.medianPsf,
      color: colorScale.getColor(priceMetric === "avg" ? town.avgPsf : town.medianPsf)
    }));
    console.log(`updateTownPrices: ${(performance.now() - start).toFixed(2)}ms`);

    set({ towns: townsWithColors, colorScale });
  }
}));