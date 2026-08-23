import "./registerCharts.jsx";
import { Doughnut } from "react-chartjs-2";

/**
 * Replaces the repeated makeDonut(id, pct, color) helper that was
 * copy-pasted (with small variations) into every fragment's <script>.
 * Pass either a simple pct (0-100, single accent color) or a full
 * `values`/`colors` array for multi-segment donuts (e.g. fee breakdown,
 * certificate categories).
 */
export default function Donut({ values, colors, centerLabel, size = 90, cutout = "76%" }) {
  return (
    <div className="donut-wrap" style={{ width: size, height: size }}>
      <Doughnut
        data={{
          datasets: [
            {
              data: values,
              backgroundColor: colors,
              borderWidth: 0,
              cutout
            }
          ]
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          animation: { animateRotate: true, duration: 600 },
          plugins: { legend: { display: false }, tooltip: { enabled: true } }
        }}
      />
      {centerLabel && <div className="donut-center">{centerLabel}</div>}
    </div>
  );
}
