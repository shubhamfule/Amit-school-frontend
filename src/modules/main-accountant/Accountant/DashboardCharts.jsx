import "./chartSetup";
import { Line, Bar, Doughnut, Pie } from "react-chartjs-2";
import { admissionTrend, attendanceToday, classes } from "./directoryData";
import { monthlySeries } from "./accountsData";

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
};

const gridOptions = {
  ...baseOptions,
  scales: {
    x: { grid: { display: false }, ticks: { font: { size: 11 }, color: "#9a96aa" } },
    y: { grid: { color: "rgba(15,23,42,0.06)" }, ticks: { font: { size: 11 }, color: "#9a96aa" } },
  },
};

export function AdmissionLineChart() {
  const data = {
    labels: admissionTrend.map((d) => d.month),
    datasets: [
      {
        label: "New Admissions",
        data: admissionTrend.map((d) => d.admissions),
        borderColor: "#4d0011",
        backgroundColor: "rgba(77,0,17,0.10)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#4d0011",
        pointRadius: 4,
      },
    ],
  };
  return (
    <div className="chart-card">
      <h4>Student Admission Overview</h4>
      <div className="chart-sub">New admissions per month</div>
      <div style={{ height: 230 }}>
        <Line data={data} options={gridOptions} />
      </div>
    </div>
  );
}

export function FeeBarChart() {
  const data = {
    labels: monthlySeries.map((d) => d.month),
    datasets: [
      {
        label: "Fee Collection",
        data: monthlySeries.map((d) => d.feeCollection),
        backgroundColor: "#4d0011",
        borderRadius: 6,
        maxBarThickness: 28,
      },
    ],
  };
  return (
    <div className="chart-card">
      <h4>Monthly Fee Collection</h4>
      <div className="chart-sub">Total fees collected per month (₹)</div>
      <div style={{ height: 230 }}>
        <Bar data={data} options={gridOptions} />
      </div>
    </div>
  );
}

export function AttendanceDonutChart() {
  const data = {
    labels: ["Present", "Absent", "On Leave"],
    datasets: [
      {
        data: [attendanceToday.present, attendanceToday.absent, attendanceToday.onLeave],
        backgroundColor: ["#3b6d11", "#a32d2d", "#ba7517"],
        borderWidth: 0,
        cutout: "72%",
      },
    ],
  };
  const total = attendanceToday.present + attendanceToday.absent + attendanceToday.onLeave;
  const pct = Math.round((attendanceToday.present / total) * 100);

  return (
    <div className="chart-card">
      <h4>Attendance Percentage</h4>
      <div className="chart-sub">Today's overall attendance</div>
      <div style={{ height: 210, position: "relative" }}>
        <Doughnut data={data} options={{ ...baseOptions, plugins: { legend: { position: "bottom", labels: { boxWidth: 10, font: { size: 11 } } } } }} />
        <div style={{ position: "absolute", top: "38%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)" }}>{pct}%</div>
          <div style={{ fontSize: 10.5, color: "var(--text-muted)" }}>Present</div>
        </div>
      </div>
    </div>
  );
}

export function ClassPieChart() {
  const data = {
    labels: classes.map((c) => c.name),
    datasets: [
      {
        data: classes.map((c) => c.students),
        backgroundColor: ["#4d0011", "#2a78d6", "#3b6d11", "#ba7517", "#d4537e"],
        borderWidth: 0,
      },
    ],
  };
  return (
    <div className="chart-card">
      <h4>Students by Class</h4>
      <div className="chart-sub">Enrolled students per class</div>
      <div style={{ height: 230 }}>
        <Pie data={data} options={{ ...baseOptions, plugins: { legend: { position: "bottom", labels: { boxWidth: 10, font: { size: 11 } } } } }} />
      </div>
    </div>
  );
}
