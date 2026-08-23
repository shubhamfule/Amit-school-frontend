import "./registerCharts.jsx";
import { Bar, Line } from "react-chartjs-2";

const baseScales = {
  x: { grid: { display: false }, ticks: { color: "#9090a8", font: { size: 10 } } },
  y: {
    beginAtZero: true,
    ticks: { color: "#9090a8", font: { size: 10 } },
    grid: { color: "#eeecf8" },
    border: { display: false }
  }
};

/** Bar chart used by Dashboard, Fees, Result, Exam, Library, Certificate. */
export function BarTrend({ labels, data, color = "#4d0011", max, yFormatter }) {
  return (
    <Bar
      data={{ labels, datasets: [{ label: "value", data, backgroundColor: color, borderRadius: 6, barPercentage: 0.6 }] }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          ...baseScales,
          y: {
            ...baseScales.y,
            max,
            ticks: { ...baseScales.y.ticks, callback: yFormatter || undefined }
          }
        }
      }}
    />
  );
}

/** Line chart used by Attendance (single line) and Result (dual line vs class avg). */
export function LineTrend({ labels, datasets, max = 100 }) {
  return (
    <Line
      data={{ labels, datasets }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        interaction: { intersect: false, mode: "index" },
        plugins: { legend: { display: false } },
        scales: { ...baseScales, y: { ...baseScales.y, max, beginAtZero: false } }
      }}
    />
  );
}
