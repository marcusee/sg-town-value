import Image from "next/image";
import SGmap from "./components/SGmap";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12">
      <SGmap />
    </div>
  );
}
