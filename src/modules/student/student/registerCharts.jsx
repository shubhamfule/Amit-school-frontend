/**
 * Chart.js v3+ (used via react-chartjs-2) requires every element/scale/
 * plugin to be explicitly registered before use. Registration is global
 * and idempotent, so importing this file once anywhere in the tree is
 * enough to make Donut.jsx and TrendChart.jsx work correctly.
 *
 * This lives inside the student folder (instead of assuming the host
 * project's main.jsx registers these) so the folder stays self-contained
 * and doesn't throw "arc is not a registered element" / "bar is not a
 * registered element" errors when dropped into a new project.
 */
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);
