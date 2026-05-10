import { describe, it, expect } from "vitest";
import {
  calculatePsf,
  getAverage,
  getMedian,
  filterTransactions,
  computeTownPrices,
  SQM_TO_SQFT,
} from "./psfCalculations";
import { ResaleRecord } from "../types/resale";

const makeRecord = (overrides: Partial<ResaleRecord> = {}): ResaleRecord => ({
  month: "2025-01",
  town: "TAMPINES",
  flat_type: "4 ROOM",
  block: "123",
  street_name: "TAMPINES ST 1",
  storey_range: "07 TO 09",
  floor_area_sqm: "90",
  flat_model: "Model A",
  lease_commence_date: "1990",
  remaining_lease: "64 years",
  resale_price: "500000",
  ...overrides,
});

// Realistic cross-town dataset used across multiple test suites
const RECORDS: ResaleRecord[] = [
  // TAMPINES — 4 ROOM, mix of years and floors
  makeRecord({ month: "2024-03", town: "TAMPINES", flat_type: "4 ROOM", storey_range: "01 TO 03", floor_area_sqm: "90",  resale_price: "480000", lease_commence_date: "1988" }),
  makeRecord({ month: "2024-09", town: "TAMPINES", flat_type: "4 ROOM", storey_range: "07 TO 09", floor_area_sqm: "93",  resale_price: "530000", lease_commence_date: "1988" }),
  makeRecord({ month: "2025-01", town: "TAMPINES", flat_type: "4 ROOM", storey_range: "10 TO 12", floor_area_sqm: "93",  resale_price: "570000", lease_commence_date: "1990" }),
  makeRecord({ month: "2025-06", town: "TAMPINES", flat_type: "5 ROOM", storey_range: "13 TO 15", floor_area_sqm: "121", resale_price: "750000", lease_commence_date: "1992" }),
  makeRecord({ month: "2025-06", town: "TAMPINES", flat_type: "5 ROOM", storey_range: "16 TO 18", floor_area_sqm: "121", resale_price: "820000", lease_commence_date: "1992" }),

  // BEDOK — 3 ROOM and EXECUTIVE
  makeRecord({ month: "2024-01", town: "BEDOK", flat_type: "3 ROOM", storey_range: "01 TO 03", floor_area_sqm: "68",  resale_price: "310000", lease_commence_date: "1982" }),
  makeRecord({ month: "2024-07", town: "BEDOK", flat_type: "3 ROOM", storey_range: "04 TO 06", floor_area_sqm: "68",  resale_price: "335000", lease_commence_date: "1982" }),
  makeRecord({ month: "2025-02", town: "BEDOK", flat_type: "EXECUTIVE", storey_range: "07 TO 09", floor_area_sqm: "146", resale_price: "880000", lease_commence_date: "1985" }),
  makeRecord({ month: "2025-04", town: "BEDOK", flat_type: "EXECUTIVE", storey_range: "10 TO 12", floor_area_sqm: "146", resale_price: "930000", lease_commence_date: "1985" }),

  // ANG MO KIO — older stock, low floors
  makeRecord({ month: "2023-11", town: "ANG MO KIO", flat_type: "3 ROOM", storey_range: "01 TO 03", floor_area_sqm: "65",  resale_price: "290000", lease_commence_date: "1978" }),
  makeRecord({ month: "2023-11", town: "ANG MO KIO", flat_type: "4 ROOM", storey_range: "04 TO 06", floor_area_sqm: "88",  resale_price: "430000", lease_commence_date: "1980" }),
  makeRecord({ month: "2025-03", town: "ANG MO KIO", flat_type: "4 ROOM", storey_range: "07 TO 09", floor_area_sqm: "88",  resale_price: "470000", lease_commence_date: "1980" }),

  // BISHAN — premium central town
  makeRecord({ month: "2025-01", town: "BISHAN", flat_type: "4 ROOM", storey_range: "10 TO 12", floor_area_sqm: "93",  resale_price: "720000", lease_commence_date: "1993" }),
  makeRecord({ month: "2025-05", town: "BISHAN", flat_type: "5 ROOM", storey_range: "16 TO 18", floor_area_sqm: "121", resale_price: "980000", lease_commence_date: "1995" }),
];

// ─── RECORDS-based filter tests ───────────────────────────────────────────────

describe("filterTransactions (RECORDS dataset)", () => {
  it("filters to only 2025 records", () => {
    const result = filterTransactions(RECORDS, { year: "2025", flatType: "ALL", storyRange: "ALL", commencement: "ALL" });
    expect(result.length).toBeGreaterThan(0);
    result.forEach(r => expect(r.month.startsWith("2025")).toBe(true));
  });

  it("filters to only EXECUTIVE flat type", () => {
    const result = filterTransactions(RECORDS, { year: "ALL", flatType: "EXECUTIVE", storyRange: "ALL", commencement: "ALL" });
    expect(result).toHaveLength(2);
    result.forEach(r => expect(r.flat_type).toBe("EXECUTIVE"));
  });

  it("returns empty array when no records match", () => {
    const result = filterTransactions(RECORDS, { year: "2020", flatType: "ALL", storyRange: "ALL", commencement: "ALL" });
    expect(result).toHaveLength(0);
  });

  it("BISHAN only appears in 2025", () => {
    const result = filterTransactions(RECORDS, { year: "2024", flatType: "ALL", storyRange: "ALL", commencement: "ALL" });
    result.forEach(r => expect(r.town).not.toBe("BISHAN"));
  });
});

// ─── computeTownPrices (RECORDS dataset) ──────────────────────────────────────

describe("computeTownPrices (RECORDS dataset)", () => {
  const townInfo = ["TAMPINES", "BEDOK", "ANG MO KIO", "BISHAN"].map(name => ({
    id: name.toLowerCase().replace(/ /g, "-"),
    name,
    x: 0,
    y: 0,
    avgPsf: 0,
    color: "",
  }));

  it("BISHAN has higher avgPsf than ANG MO KIO", () => {
    const result = computeTownPrices(RECORDS, townInfo);
    const bishan = result.find(t => t.name === "BISHAN")!;
    const amk    = result.find(t => t.name === "ANG MO KIO")!;
    expect(bishan.avgPsf).toBeGreaterThan(amk.avgPsf);
  });

  it("transaction counts match the dataset", () => {
    const result = computeTownPrices(RECORDS, townInfo);
    expect(result.find(t => t.name === "TAMPINES")!.transactionCount).toBe(5);
    expect(result.find(t => t.name === "BEDOK")!.transactionCount).toBe(4);
    expect(result.find(t => t.name === "ANG MO KIO")!.transactionCount).toBe(3);
    expect(result.find(t => t.name === "BISHAN")!.transactionCount).toBe(2);
  });

  it("avgPsf and medianPsf differ when distribution is skewed", () => {
    const result = computeTownPrices(RECORDS, townInfo);
    const tampines = result.find(t => t.name === "TAMPINES")!;
    // 5 ROOM records have very different PSF from 4 ROOM, so avg ≠ median
    expect(tampines.avgPsf).not.toBe(tampines.medianPsf);
  });
});

// ─── calculatePsf ─────────────────────────────────────────────────────────────

describe("calculatePsf", () => {
  it("converts sqm to sqft and divides price by area", () => {
    const psf = calculatePsf("500000", "90");
    const expected = 500000 / (90 * SQM_TO_SQFT);
    expect(psf).toBeCloseTo(expected, 5);
  });

  it("returns a higher PSF for a smaller flat at the same price", () => {
    const psfSmall = calculatePsf("500000", "60");
    const psfLarge = calculatePsf("500000", "90");
    expect(psfSmall).toBeGreaterThan(psfLarge);
  });

  it("scales linearly with price", () => {
    const psf1 = calculatePsf("500000", "90");
    const psf2 = calculatePsf("1000000", "90");
    expect(psf2).toBeCloseTo(psf1 * 2, 5);
  });
});

// ─── getAverage ───────────────────────────────────────────────────────────────

describe("getAverage", () => {
  it("returns 0 for empty array", () => {
    expect(getAverage([])).toBe(0);
  });

  it("returns the single value for a one-element array", () => {
    expect(getAverage([42])).toBe(42);
  });

  it("computes the correct mean", () => {
    expect(getAverage([100, 200, 300])).toBe(200);
  });
});

// ─── getMedian ────────────────────────────────────────────────────────────────

describe("getMedian", () => {
  it("returns 0 for empty array", () => {
    expect(getMedian([])).toBe(0);
  });

  it("returns the middle value for odd-length arrays", () => {
    expect(getMedian([100, 200, 300])).toBe(200);
  });

  it("averages the two middle values for even-length arrays", () => {
    expect(getMedian([100, 200, 300, 400])).toBe(250);
  });

  it("sorts before computing (input order doesn't matter)", () => {
    expect(getMedian([300, 100, 200])).toBe(200);
  });

  it("does not mutate the input array", () => {
    const values = [300, 100, 200];
    getMedian(values);
    expect(values).toEqual([300, 100, 200]);
  });
});

// ─── filterTransactions ───────────────────────────────────────────────────────

describe("filterTransactions", () => {
  const data = [
    makeRecord({ month: "2024-06", flat_type: "3 ROOM", storey_range: "01 TO 03", lease_commence_date: "1985" }),
    makeRecord({ month: "2025-01", flat_type: "4 ROOM", storey_range: "07 TO 09", lease_commence_date: "1990" }),
    makeRecord({ month: "2025-03", flat_type: "4 ROOM", storey_range: "10 TO 12", lease_commence_date: "1990" }),
  ];

  it("returns all records when no filters are provided", () => {
    expect(filterTransactions(data)).toHaveLength(3);
  });

  it("filters by year", () => {
    const result = filterTransactions(data, { year: "2025", flatType: "ALL", storyRange: "ALL", commencement: "ALL" });
    expect(result).toHaveLength(2);
    result.forEach(r => expect(r.month.startsWith("2025")).toBe(true));
  });

  it("filters by flat type", () => {
    const result = filterTransactions(data, { year: "ALL", flatType: "3 ROOM", storyRange: "ALL", commencement: "ALL" });
    expect(result).toHaveLength(1);
    expect(result[0].flat_type).toBe("3 ROOM");
  });

  it("filters by storey range", () => {
    const result = filterTransactions(data, { year: "ALL", flatType: "ALL", storyRange: "07 TO 09", commencement: "ALL" });
    expect(result).toHaveLength(1);
    expect(result[0].storey_range).toBe("07 TO 09");
  });

  it("filters by lease commencement", () => {
    const result = filterTransactions(data, { year: "ALL", flatType: "ALL", storyRange: "ALL", commencement: "1990" });
    expect(result).toHaveLength(2);
  });

  it("applies multiple filters together", () => {
    const result = filterTransactions(data, { year: "2025", flatType: "4 ROOM", storyRange: "07 TO 09", commencement: "ALL" });
    expect(result).toHaveLength(1);
  });
});

// ─── computeTownPrices ────────────────────────────────────────────────────────

describe("computeTownPrices", () => {
  const townInfo = [
    { id: "T1", name: "TAMPINES",   x: 0, y: 0, avgPsf: 0, color: "" },
    { id: "T2", name: "BEDOK",      x: 0, y: 0, avgPsf: 0, color: "" },
    { id: "T3", name: "BISHAN",     x: 0, y: 0, avgPsf: 0, color: "" },
    { id: "T4", name: "JURONG WEST",x: 0, y: 0, avgPsf: 0, color: "" },
  ];

  it("two towns, two transactions each — avg and median match", () => {
    const transactions = [
      makeRecord({ town: "TAMPINES", resale_price: "500000", floor_area_sqm: "90" }),
      makeRecord({ town: "TAMPINES", resale_price: "600000", floor_area_sqm: "90" }),
      makeRecord({ town: "BEDOK",    resale_price: "400000", floor_area_sqm: "80" }),
      makeRecord({ town: "BEDOK",    resale_price: "450000", floor_area_sqm: "80" }),
    ];
    const result = computeTownPrices(transactions, townInfo);
    const tampines = result.find(t => t.name === "TAMPINES")!;
    const bedok    = result.find(t => t.name === "BEDOK")!;

    expect(tampines.transactionCount).toBe(2);
    expect(tampines.avgPsf).toBe(Math.round((calculatePsf("500000", "90") + calculatePsf("600000", "90")) / 2));
    expect(tampines.medianPsf).toBe(tampines.avgPsf);

    expect(bedok.transactionCount).toBe(2);
    expect(bedok.avgPsf).toBe(Math.round((calculatePsf("400000", "80") + calculatePsf("450000", "80")) / 2));
  });

  it("single transaction town — avg equals medianPsf", () => {
    const transactions = [
      makeRecord({ town: "BISHAN",      resale_price: "750000", floor_area_sqm: "93"  }),
      makeRecord({ town: "TAMPINES",    resale_price: "520000", floor_area_sqm: "90"  }),
      makeRecord({ town: "JURONG WEST", resale_price: "380000", floor_area_sqm: "83"  }),
      makeRecord({ town: "BEDOK",       resale_price: "610000", floor_area_sqm: "110" }),
    ];
    const result = computeTownPrices(transactions, townInfo);

    ["BISHAN", "TAMPINES", "JURONG WEST", "BEDOK"].forEach(name => {
      const town = result.find(t => t.name === name)!;
      expect(town.transactionCount).toBe(1);
      expect(town.avgPsf).toBe(town.medianPsf);
    });
  });

  it("large flat vs small flat at same price — smaller sqm yields higher PSF", () => {
    const transactions = [
      makeRecord({ town: "TAMPINES", resale_price: "500000", floor_area_sqm: "65"  }), // 3 ROOM
      makeRecord({ town: "BEDOK",    resale_price: "500000", floor_area_sqm: "121" }), // 5 ROOM
    ];
    const result = computeTownPrices(transactions, townInfo);
    const tampines = result.find(t => t.name === "TAMPINES")!;
    const bedok    = result.find(t => t.name === "BEDOK")!;
    expect(tampines.avgPsf).toBeGreaterThan(bedok.avgPsf);
  });

  it("skewed price outlier pulls avg above median", () => {
    const transactions = [
      makeRecord({ town: "BISHAN", resale_price: "600000",  floor_area_sqm: "93" }),
      makeRecord({ town: "BISHAN", resale_price: "620000",  floor_area_sqm: "93" }),
      makeRecord({ town: "BISHAN", resale_price: "630000",  floor_area_sqm: "93" }),
      makeRecord({ town: "BISHAN", resale_price: "640000",  floor_area_sqm: "93" }),
      makeRecord({ town: "BISHAN", resale_price: "1200000", floor_area_sqm: "93" }), // outlier
    ];
    const result = computeTownPrices(transactions, townInfo);
    const bishan = result.find(t => t.name === "BISHAN")!;
    expect(bishan.avgPsf).toBeGreaterThan(bishan.medianPsf);
    expect(bishan.avgPsf).toBe(737);
    expect(bishan.medianPsf).toBe(629);

  });

  it("transactions only for one town — others stay at zero", () => {
    const transactions = [
      makeRecord({ town: "JURONG WEST", resale_price: "420000", floor_area_sqm: "90" }),
      makeRecord({ town: "JURONG WEST", resale_price: "440000", floor_area_sqm: "90" }),
    ];
    const result = computeTownPrices(transactions, townInfo);
    result
      .filter(t => t.name !== "JURONG WEST")
      .forEach(t => {
        expect(t.avgPsf).toBe(0);
        expect(t.medianPsf).toBe(0);
        expect(t.transactionCount).toBe(0);
      });
    expect(result.find(t => t.name === "JURONG WEST")!.transactionCount).toBe(2);
  });

  it("returns zero PSF and zero transactionCount for all towns when data is empty", () => {
    const result = computeTownPrices([], townInfo);
    result.forEach(t => {
      expect(t.avgPsf).toBe(0);
      expect(t.medianPsf).toBe(0);
      expect(t.transactionCount).toBe(0);
    });
  });
});
