import { ResaleRecord } from "../types/resale";
import { resaleData } from "./resaleData";
export const ALL_OPTION = "ALL" as const

function getUniqueSorted<T extends keyof ResaleRecord>(
  data: ResaleRecord[],
  key: T,
  sortFn?: (a: string, b: string) => number
): string[] {
  const values = Array.from(
    new Set(data.map(item => item[key]).filter(Boolean))
  )

  return sortFn ? values.sort(sortFn) : values.sort()
}

function withAllOption(values: string[]): string[] {
  return [ALL_OPTION, ...values]
}

export const leaseCommenceOptions = withAllOption(
  getUniqueSorted(
    resaleData,
    "lease_commence_date",
    (a, b) => Number(a) - Number(b)
  )
)

export const flatTypesOptions = withAllOption(
  getUniqueSorted(resaleData, "flat_type")
)

export const storeyRangesOptions = withAllOption(
  getUniqueSorted(
    resaleData,
    "storey_range",
    (a, b) => {
      const aStart = Number(a.split(" TO ")[0])
      const bStart = Number(b.split(" TO ")[0])
      return aStart - bStart
    }
  )
)

// export const flatTypesOptions = [
//   "ALL",
//   "4 ROOM",
//   "5 ROOM",
//   "3 ROOM",
//   "EXECUTIVE",
//   "2 ROOM",
//   "MULTI-GENERATION",
//   "1 ROOM",
// ];


// export const storeyRangesOptions = [
//   "ALL",
//   "04 TO 06",
//   "07 TO 09",
//   "10 TO 12",
//   "01 TO 03",
//   "13 TO 15",
//   "16 TO 18",
//   "19 TO 21",
//   "22 TO 24",
//   "25 TO 27",
//   "28 TO 30",
//   "31 TO 33",
//   "34 TO 36",
//   "37 TO 39",
//   "40 TO 42",
//   "43 TO 45",
//   "46 TO 48",
//   "49 TO 51",
// ];


export function generateYearOptions(startYear = 2017): string[] {
  const currentYear = new Date().getFullYear();
  const years: string[] = [];

  for (let y = startYear; y <= currentYear; y++) {
    years.push(String(y));
  }

  years.unshift("ALL");
  return years;
}


export const yearOptions = generateYearOptions()


