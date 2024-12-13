"use client";
import { useEffect, useRef } from "react";
import {
  Title,
  Chart,
  CategoryScale,
  LinearScale,
  Legend,
  BarElement,
  Tooltip,
  BarController,
} from "chart.js";

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend
);

type ChartProps = {
  labels: string[];
  title: string;
  data: number[];
};
export const dynamic = "force-dynamic";

export default function ChartComponent({ data, labels, title }: ChartProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      const chartInstance = new Chart(chartRef.current, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              data: data,
              label: title,
              borderColor: "rgb(3, 100, 100)",
              backgroundColor: "rgba(3, 100, 100, 0.2)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              type: "linear",
              beginAtZero: true,
            },
          },
        },
      });

      return () => {
        chartInstance.destroy();
      };
    }
  }, [data, labels, title]);

  return (
    <div className="w-[50%] max-md:w-fit bg-white">
      <canvas ref={chartRef} style={{ width: "100% !important" }} />
    </div>
  );
}
