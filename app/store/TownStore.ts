"use client"

import { create } from "zustand";
import { initialTownInfo } from "../data/towndata";
import { ResaleRecord } from "../types/resale";
import { CONFIG } from "../config/config";
import { filterTransactions, computeTownPrices, createColorScale, ColorScale } from "../util/psfCalculations";
import { TransactionFilters, PriceMetric, TownPriceInfo } from "../types/town";

export type { TransactionFilters, PriceMetric, TownPriceInfo, ColorScale };


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




function applyColors(towns: TownPriceInfo[], metric: PriceMetric, colorScale: ColorScale): TownPriceInfo[] {
  return towns.map(town => {
    const psf = metric === "avg" ? town.avgPsf : town.medianPsf;
    return { ...town, displayValue: psf, color: colorScale.getColor(psf) };
  });
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
  },
  towns: initialTownInfo.map(town => ({
    ...town,
    transactionCount: 0
  })),
  colorScale: null,
  priceMetric: "avg",

  setPriceMetric: (metric: PriceMetric) => {
    const { towns } = get();
    const colorScale = createColorScale(towns, metric);
    set({ priceMetric: metric, towns: applyColors(towns, metric, colorScale), colorScale });
  },

  updateTownPrices: (filters?: TransactionFilters) => {
    const { priceMetric, resaleData } = get();
    const towns = computeTownPrices(filterTransactions(resaleData, filters), initialTownInfo);
    const colorScale = createColorScale(towns, priceMetric);
    set({ towns: applyColors(towns, priceMetric, colorScale), colorScale });
  }
}));