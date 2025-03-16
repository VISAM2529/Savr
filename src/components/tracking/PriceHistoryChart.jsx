"use client";
import { Line } from "react-chartjs-2";

export default function PriceHistoryChart({ data }) {
  const chartData = {
    labels: data.map((entry) => entry.date),
    datasets: [
      {
        label: "Price (₹)",
        data: data.map((entry) => entry.price),
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.2)",
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded shadow mt-5">
      <h2 className="text-lg font-bold mb-2">Price History</h2>
      <Line data={chartData} />
    </div>
  );
}
