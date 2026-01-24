"use client"

import Image from "next/image";
import SGmap from "./components/SGmap";
import OneMap from "./components/OneMap";
import Transactions from "./components/Transactions";
import { resaleData } from "./data/resaleData";
import { useTownStore } from "./store/TownStore";
import { useEffect } from "react";

export default function Home() {
  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 py-12">
      {/* <Transactions /> */}
      <SGmap />
      {/* <OneMap /> */}
      <footer className="text-center p-5 text-gray-400 text-xs">
        Data source: <a href="https://data.gov.sg" target="_blank" className="hover:underline">data.gov.sg</a> ·
        Contact: <a href="mailto:marcuseecl@gmail.com" className="hover:underline">marcuseecl@gmail.com</a>
      </footer>
    </div>
  );
}
