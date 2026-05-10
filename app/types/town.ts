import { TownInfo } from "../data/towndata";

export interface TransactionFilters {
  year: string;
  flatType: string;
  storyRange: string;
  commencement: string;
}

export type PriceMetric = "avg" | "median";

export interface TownPriceInfo extends TownInfo {
  avgPsf: number;
  medianPsf: number;
  transactionCount: number;
}
