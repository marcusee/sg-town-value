import Image from "next/image";
import SGmap from "./components/SGmap";
import OneMap from "./components/OneMap";

export default function Home() {
  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 py-12">
      <SGmap />
      {/* <OneMap /> */}
    </div>
  );
}
