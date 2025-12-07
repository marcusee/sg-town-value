"use client"

import Image from "next/image";
import SGmap from "./components/SGmap";
import OneMap from "./components/OneMap";
import Transactions from "./components/Transactions";
import { resaleData } from "./data/resaleData";
import { useTownStore } from "./store/TownStore";
import { useEffect } from "react";

export default function Home() {
  const { calculateAvgPsf} = useTownStore()

  useEffect(() => {
    calculateAvgPsf();
  }, []);


  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 py-12">
      {/* <Transactions /> */}
      <SGmap />
      {/* <OneMap /> */}
    </div>
  );
}
