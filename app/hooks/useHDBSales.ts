"use client";

import { useQuery } from "@tanstack/react-query";


export function useHDBSales() {
  const datasetId = "d_8b84c4ee58e3cfc0ece0d773c8ca6abc"
  const url = "https://data.gov.sg/api/action/datastore_search?resource_id=" + datasetId;
  return useQuery({
    queryKey: ["hdb-sales"],
    queryFn: () => fetch(url).then(r => calculatePsfAvg(r.json())),
  });
}