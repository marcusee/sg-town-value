
// Define the ResaleRecord type if not imported elsewhere

export function getAveragePsfPerTown(data: ResaleRecord[]) {
  const townStats: Record<string, { totalPsf: number; count: number }> = {};

  for (const item of data) {
    const price = Number(item.resale_price);
    const sqm = Number(item.floor_area_sqm);
    if (!price || !sqm) continue;

    const sqft = sqm * 10.7639; // convert sqm → sqft
    const psf = price / sqft;

    if (!townStats[item.town]) {
      townStats[item.town] = { totalPsf: 0, count: 0 };
    }

    townStats[item.town].totalPsf += psf;
    townStats[item.town].count += 1;
  }

  // compute average
  const result: Record<string, number> = {};
  for (const town in townStats) {
    const { totalPsf, count } = townStats[town];
    result[town] = Number((totalPsf / count).toFixed(2));
  }

  return result;
}