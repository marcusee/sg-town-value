"use client"

import { useEffect } from "react";
import SGmap from "./components/SGmap";
import { useTownStore } from "./store/TownStore";

export default function Home() {
  const fetchResaleData = useTownStore(s => s.fetchResaleData);

  useEffect(() => {
    fetchResaleData();
  }, []);

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
