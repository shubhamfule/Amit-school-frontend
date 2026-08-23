import { useState } from "react";
import KpiCard from "./KpiCard.jsx";
import Donut from "./Donut.jsx";
import { BarTrend } from "./TrendChart.jsx";

const PROGRESS_BARS = [
  { label: "Overall Performance", pct: 92, color: "#4d0011" },
  { label: "Attendance", pct: 95, color: "#4d0011" },
  { label: "Assignments Completed", pct: 80, color: "#4d0011" }
];

const CLASS_LEVELS = [
  "Nursery",
  "LKG",
  "UKG",
  "Class 1",
  "Class 2",
  "Class 3",
  "Class 4",
  "Class 5",
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10"
];

export default function Dashboard() {
  const [classIndex, setClassIndex] = useState(CLASS_LEVELS.indexOf("Class 6"));

  const goPrevClass = () => {
    setClassIndex((i) => (i > 0 ? i - 1 : i));
  };

  const goNextClass = () => {
    setClassIndex((i) => (i < CLASS_LEVELS.length - 1 ? i + 1 : i));
  };

  return (
    <div>
      <center>
        <div className="page-header">
          <div>
            <h1 style={{ color: "#4d0011" }}> Student Dashboard</h1>
            <hr />
            <p>Welcome back, Mr. Sham 👋 Class : 6 Roll No : 20</p>
          </div>
        </div>
      </center>

      <div className="kpi-row">
        <KpiCard icon="bi-calendar-check" iconBg="#ede9fe" value="92%" label="Attendance" badge={<><i className="bi bi-check-circle"></i> Excellent</>} badgeClass="badge-green" />
        <KpiCard icon="bi-award-fill" iconBg="#fde9f0" value="A+" label="Overall Grade" badge="A+" badgeClass="badge-blue" />
        <KpiCard icon="bi-journal-check" iconBg="#e8f4fd" value="3" label="Pending Assignments" badge="Due Tomorrow" badgeClass="badge-red" />
        <KpiCard icon="bi-pencil-square" iconBg="#fff8e1" value="2" label="Upcoming Exams" badge="Starts in 5 Days" badgeClass="badge-blue" />
      </div>

      <div className="mid-row">
        <div className="att-card">
          <div className="att-header">
            <span className="att-title">My Attendance</span>
            <span className="month-badge mb-purple">This Month</span>
          </div>
          <div className="att-body">
            <Donut values={[92, 8]} colors={["#4d0011", "#f0f0f8"]} centerLabel="92%" />
            <div className="att-stats">
              <div className="row"><span className="slbl">Present</span><span className="sval">22 Days</span></div>
              <div className="row"><span className="slbl">Absent</span><span className="sval">2 Days</span></div>
              <div className="row"><span className="slbl">Leave</span><span className="sval">1 Days</span></div>
            </div>
          </div>
        </div>

        <div className="att-card">
          <div className="att-header">
            <span className="att-title">Academic performance</span>
            <span style={{ color: "#4d0011" }} className="month-badge mb-blue">Class 6</span>
          </div>
          <div className="att-body">
            <Donut values={[91, 9]} colors={["#4d0011", "#f0f0f8"]} centerLabel="A+" />
            <div className="att-stats">
              <div className="row"><span className="slbl">CGPA</span><span className="sval">9.1</span></div>
              <div className="row"><span className="slbl">Class Rank</span><span className="sval">12</span></div>
            </div>
          </div>
        </div>

        <div className="att-card">
          <div className="att-header">
            <span className="att-title">Fees Status</span>
            <span className="month-badge mb-blue">2024-25</span>
          </div>
          <div className="att-body">
            <Donut values={[80, 20]} colors={["#4d0011", "#f0f0f8"]} centerLabel="80%" />
            <div className="att-stats">
              <div className="row"><span className="slbl">Paid :</span><span className="sval">₹40,000</span></div>
              <div className="row"><span className="slbl">Pending :</span><span className="sval">₹10,000</span></div>
              <div className="row"><span className="slbl">Due Date :</span><span className="sval">15 Jul 2024</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bottom-row">
        <div className="chart-card">
          <div className="chart-header">
            <span className="chart-title">Subject-wise Marks</span>
            <button className="filter-btn">This month <i className="bi bi-chevron-down" style={{ fontSize: 10 }}></i></button>
          </div>
          <div className="chart-legend"><span><span className="leg-dot" style={{ background: "#4d0011" }}></span>Marks Obtained</span></div>
          <div style={{ position: "relative", height: 200 }}>
            <BarTrend
              labels={["Math", "Science", "English", "Computer", "History", "Geography"]}
              data={[92, 88, 95, 90, 84, 89]}
              color="#4d0011"
              max={100}
            />
          </div>
        </div>

        <div className="cal-card">
          <div className="cal-header">
            <span className="cal-title">Academic progress</span>
            <div className="cal-nav">
              <span>{CLASS_LEVELS[classIndex]}</span>
              <div
                className="cal-arrow"
                role="button"
                aria-disabled={classIndex === 0}
                onClick={goPrevClass}
                style={{ opacity: classIndex === 0 ? 0.4 : 1, cursor: classIndex === 0 ? "not-allowed" : "pointer" }}
              >
                <i className="bi bi-chevron-left"></i>
              </div>
              <div
                className="cal-arrow"
                role="button"
                aria-disabled={classIndex === CLASS_LEVELS.length - 1}
                onClick={goNextClass}
                style={{ opacity: classIndex === CLASS_LEVELS.length - 1 ? 0.4 : 1, cursor: classIndex === CLASS_LEVELS.length - 1 ? "not-allowed" : "pointer" }}
              >
                <i className="bi bi-chevron-right"></i>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 15 }}>
            {PROGRESS_BARS.map((p) => (
              <div key={p.label} style={{ marginBottom: 18 }}>
                <small>{p.label}</small>
                <div style={{ background: "#eee", height: 8, borderRadius: 5, marginTop: 5 }}>
                  <div style={{ width: `${p.pct}%`, height: 8, background: p.color, borderRadius: 5 }}></div>
                </div>
                <small>{p.pct}%</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}