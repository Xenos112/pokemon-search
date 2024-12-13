"use client";
import fetchAverageExp from "@/api/fetchAverageExpForTypes";
import { useEffect, useState } from "react";
import ChartComponent from "@/components/Chart";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function page() {
  const [stats, setStats] = useState<Record<string, number>>();
  const [uniqueAbilities, setUniqueAbilities] =
    useState<Record<string, number>>();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    (async function fetch() {
      setLoading(true);
      const data = await fetchAverageExp();
      if (!data) {
        toast.error("failed to fetch the data");
        setLoading(false);
        return;
      }
      setStats(data.averageExp);
      setUniqueAbilities(data.results);
      setLoading(false);
    })();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-cyan-500 to-purple-500">
      <div className="flex max-md:flex-col justify-center h-screen gap-5 items-center">
        {loading && (
          <div className="animate-spin duration-500">
            <Loader2 color="white" size={50} />
          </div>
        )}
        {stats && (
          <ChartComponent
            data={Object.values(stats)}
            labels={Object.keys(stats)}
            title="Average Exp"
          />
        )}
        {uniqueAbilities && (
          <ChartComponent
            data={Object.values(uniqueAbilities)}
            labels={Object.keys(uniqueAbilities)}
            title="Unique Abilities"
          />
        )}
      </div>
    </main>
  );
}
