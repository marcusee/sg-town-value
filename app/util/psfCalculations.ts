import { ResaleRecord } from "../types/resale";
import { TownInfo } from "../data/towndata";
import { TownPriceInfo, TransactionFilters } from "../types/town";

export const SQM_TO_SQFT = 10.7639;

export function calculatePsf(resalePrice: string, floorAreaSqm: string): number {
  const price = parseFloat(resalePrice);
  const areaSqft = parseFloat(floorAreaSqm) * SQM_TO_SQFT;
  return price / areaSqft;
}

export function getAverage(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((acc, val) => acc + val, 0) / values.length;
}

export function getMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

export function filterTransactions(data: ResaleRecord[], filters?: TransactionFilters): ResaleRecord[] {
  let filtered = [...data];
  if (!filters) return filtered;
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
  return filtered;
}

export function computeTownPrices(transactions: ResaleRecord[], baseTownInfo: TownInfo[]): TownPriceInfo[] {
  const townPsfMap: Record<string, number[]> = {};

  transactions.forEach(t => {
    const psf = calculatePsf(t.resale_price, t.floor_area_sqm);
    if (!townPsfMap[t.town]) townPsfMap[t.town] = [];
    townPsfMap[t.town].push(psf);
  });

  return baseTownInfo.map(town => {
    const psfValues = townPsfMap[town.name] || [];
    return {
      ...town,
      avgPsf: Math.round(getAverage(psfValues)),
      medianPsf: Math.round(getMedian(psfValues)),
      displayValue: 0,
      transactionCount: psfValues.length,
    };
  });
}
