import { useState } from "react";
import KpiCard from "./KpiCard.jsx";
import Donut from "./Donut.jsx";
import { LineTrend } from "./TrendChart.jsx";

const CAL_MONTHS = [
  {
    label: "July 2024",
    firstDayIndex: 1,
    totalDays: 31,
    today: 24,
    status: {
      3: "absent", 10: "leave", 17: "absent",
      1: "present", 2: "present", 4: "present", 5: "present", 8: "present", 9: "present",
      11: "present", 12: "present", 15: "present", 16: "present", 18: "present", 19: "present",
      22: "present", 23: "present", 24: "present"
    }
  },
  { label: "August 2024", firstDayIndex: 4, totalDays: 31, status: {} },
  { label: "September 2024", firstDayIndex: 0, totalDays: 30, status: {} },
  { label: "October 2024", firstDayIndex: 2, totalDays: 31, status: {} },
  { label: "November 2024", firstDayIndex: 5, totalDays: 30, status: {} },
  { label: "December 2024", firstDayIndex: 0, totalDays: 31, status: {} },
  { label: "January 2025", firstDayIndex: 3, totalDays: 31, status: {} },
  { label: "February 2025", firstDayIndex: 6, totalDays: 28, status: {} },
  { label: "March 2025", firstDayIndex: 6, totalDays: 31, status: {} },
  { label: "April 2025", firstDayIndex: 2, totalDays: 30, status: {} },
  { label: "May 2025", firstDayIndex: 4, totalDays: 31, status: {} },
  { label: "June 2025", firstDayIndex: 0, totalDays: 30, status: {} },
  { label: "July 2025", firstDayIndex: 2, totalDays: 31, status: {} },
  { label: "August 2025", firstDayIndex: 5, totalDays: 31, status: {} },
  { label: "September 2025", firstDayIndex: 1, totalDays: 30, status: {} },
  { label: "October 2025", firstDayIndex: 3, totalDays: 31, status: {} },
  { label: "November 2025", firstDayIndex: 6, totalDays: 30, status: {} },
  { label: "December 2025", firstDayIndex: 1, totalDays: 31, status: {} },
  { label: "January 2026", firstDayIndex: 4, totalDays: 31, status: {} },
  { label: "February 2026", firstDayIndex: 0, totalDays: 28, status: {} },
  { label: "March 2026", firstDayIndex: 0, totalDays: 31, status: {} },
  { label: "April 2026", firstDayIndex: 3, totalDays: 30, status: {} },
  { label: "May 2026", firstDayIndex: 5, totalDays: 31, status: {} },
  { label: "June 2026", firstDayIndex: 1, totalDays: 30, status: {} },
  { label: "July 2026", firstDayIndex: 3, totalDays: 31, status: {} },
  { label: "August 2026", firstDayIndex: 6, totalDays: 31, status: {} },
  { label: "September 2026", firstDayIndex: 2, totalDays: 30, status: {} },
  { label: "October 2026", firstDayIndex: 4, totalDays: 31, status: {} },
  { label: "November 2026", firstDayIndex: 0, totalDays: 30, status: {} },
  { label: "December 2026", firstDayIndex: 2, totalDays: 31, status: {} }
];

const STATUS_COLOR = { present: "#16a34a", absent: "#dc2626", leave: "#e59d00" };
const DAY_HEADS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const INITIAL_LOG_ROWS = [
  { date: "24 Jul 2024", day: "Wed", status: "present", time: "8:02 AM", remarks: "On time" },
  { date: "23 Jul 2024", day: "Tue", status: "present", time: "7:58 AM", remarks: "On time" },
  { date: "22 Jul 2024", day: "Mon", status: "present", time: "8:05 AM", remarks: "On time" },
  { date: "21 Jul 2024", day: "Sun", status: "absent", time: "--", remarks: "Weekend" },
  { date: "19 Jul 2024", day: "Fri", status: "present", time: "8:00 AM", remarks: "On time" },
  { date: "17 Jul 2024", day: "Wed", status: "absent", time: "--", remarks: "Sick leave" },
  { date: "10 Jul 2024", day: "Wed", status: "leave", time: "--", remarks: "Family function" }
];

const STATUS_ICON = { present: "bi-check-circle", absent: "bi-x-circle", leave: "bi-info-circle" };

function toCsv(rows) {
  const header = ["Date", "Day", "Status", "Time", "Remarks"];
  const lines = [header.join(",")];
  rows.forEach((r) => {
    const line = [r.date, r.day, r.status, r.time, r.remarks]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",");
    lines.push(line);
  });
  return lines.join("\n");
}

function downloadCsv(content, filename) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function LeaveModal({ onClose, onSubmit }) {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!fromDate || !toDate || !reason.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    if (new Date(fromDate) > new Date(toDate)) {
      setError("From date cannot be after To date.");
      return;
    }
    onSubmit({ fromDate, toDate, reason: reason.trim() });
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff", borderRadius: 12, padding: 24, width: 380,
          maxWidth: "90vw", boxShadow: "0 10px 40px rgba(0,0,0,0.2)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 18 }}>Apply for Leave</h3>
          <i className="bi bi-x-lg" style={{ cursor: "pointer" }} onClick={onClose}></i>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", fontSize: 13, marginBottom: 4, fontWeight: 600 }}>From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #ddd", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", fontSize: 13, marginBottom: 4, fontWeight: 600 }}>To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #ddd", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", fontSize: 13, marginBottom: 4, fontWeight: 600 }}>Reason</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder="e.g. Family function, medical appointment..."
            style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #ddd", boxSizing: "border-box", resize: "vertical", fontFamily: "inherit" }}
          />
        </div>

        {error && <div style={{ color: "#dc2626", fontSize: 13, marginBottom: 12 }}>{error}</div>}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
          <button className="btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSubmit}>Submit Request</button>
        </div>
      </div>
    </div>
  );
}

export default function Attendance() {
  const [calIndex, setCalIndex] = useState(0);
  const [logRows, setLogRows] = useState(INITIAL_LOG_ROWS);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [toast, setToast] = useState("");

  const month = CAL_MONTHS[calIndex];

  const cells = [];
  for (let i = 0; i < month.firstDayIndex; i++) cells.push(null);
  for (let d = 1; d <= month.totalDays; d++) cells.push(d);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleExport = () => {
    const csv = toCsv(logRows);
    const filename = `attendance-log-${month.label.replace(" ", "-").toLowerCase()}.csv`;
    downloadCsv(csv, filename);
    showToast("Attendance log exported.");
  };

  const handleLeaveSubmit = ({ fromDate, toDate, reason }) => {
    const formatDate = (iso) => {
      const d = new Date(iso);
      return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    };
    const dayOfWeek = (iso) =>
      new Date(iso).toLocaleDateString("en-US", { weekday: "short" });

    const newRow = {
      date: fromDate === toDate ? formatDate(fromDate) : `${formatDate(fromDate)} - ${formatDate(toDate)}`,
      day: dayOfWeek(fromDate),
      status: "leave",
      time: "--",
      remarks: reason
    };

    setLogRows((rows) => [newRow, ...rows]);
    setShowLeaveModal(false);
    showToast("Leave request submitted.");
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Attendance</h1>
          <hr/>
          <p>Class : 6 &nbsp; Roll No : 20 &nbsp; · &nbsp; Track your daily attendance record</p>
        </div>
        <div className="header-actions">
          <button className="btn-outline" onClick={handleExport}>
            <i className="bi bi-download"></i> Export
          </button>
          <button className="btn-primary" onClick={() => setShowLeaveModal(true)}>
            <i className="bi bi-envelope-paper-fill"></i> Apply Leave
          </button>
        </div>
      </div>

      {toast && (
        <div
          style={{
            position: "fixed", top: 20, right: 20, background: "#111827", color: "#fff",
            padding: "10px 16px", borderRadius: 8, fontSize: 14, zIndex: 1100,
            boxShadow: "0 6px 20px rgba(0,0,0,0.25)"
          }}
        >
          {toast}
        </div>
      )}

      <div className="kpi-row">
        <KpiCard icon="bi-calendar-check" iconBg="#ede9fe" value="92%" label="Overall Attendance" badge={<><i className="bi bi-check-circle"></i> Excellent</>} badgeClass="badge-green" />
        <KpiCard icon="bi-check2-circle" iconBg="#dcfce7" value="22" label="Days Present" badge="This Month" badgeClass="badge-green" />
        <KpiCard icon="bi-x-circle" iconBg="#fee2e2" value="2" label="Days Absent" badge="This Month" badgeClass="badge-red" />
        <KpiCard icon="bi-calendar-minus" iconBg="#fff8e1" value="1" label="Days on Leave" badge="This Month" badgeClass="badge-amber" />
      </div>

      <div className="mid-row">
        <div className="att-card">
          <div className="att-header">
            <span className="att-title">This Month</span>
            <span className="month-badge mb-purple">July 2024</span>
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
            <span className="att-title">Overall Year</span>
            <span className="month-badge mb-pink">2024-25</span>
          </div>
          <div className="att-body">
            <Donut values={[95, 5]} colors={["#4d0011", "#f0f0f8"]} centerLabel="95%" />
            <div className="att-stats">
              <div className="row"><span className="slbl">Present</span><span className="sval">171 Days</span></div>
              <div className="row"><span className="slbl">Absent</span><span className="sval">6 Days</span></div>
              <div className="row"><span className="slbl">Leave</span><span className="sval">3 Days</span></div>
            </div>
          </div>
        </div>

        <div className="att-card">
          <div className="att-header">
            <span className="att-title">Streak</span>
            <span className="month-badge mb-blue">Consistency</span>
          </div>
          <div className="att-body">
            <Donut values={[67, 33]} colors={["#4d0011", "#f0f0f8"]} centerLabel="18" />
            <div className="att-stats">
              <div className="row"><span className="slbl">Current Streak</span><span className="sval">12 Days</span></div>
              <div className="row"><span className="slbl">Best Streak</span><span className="sval">18 Days</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bottom-row">
        <div className="chart-card">
          <div className="chart-header">
            <span className="chart-title">Attendance Trend</span>
            <button className="filter-btn">This Year <i className="bi bi-chevron-down" style={{ fontSize: 10 }}></i></button>
          </div>
          <div className="chart-legend"><span><span className="leg-dot" style={{ background: "#0d9488" }}></span>Attendance %</span></div>
          <div style={{ position: "relative", height: 200 }}>
            <LineTrend
              labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"]}
              datasets={[{
                label: "Attendance %",
                data: [88, 91, 94, 90, 93, 96, 92],
                borderColor: "#0d9488",
                backgroundColor: "rgba(13,148,136,0.2)",
                borderWidth: 3,
                fill: true,
                tension: 0.45,
                pointRadius: 3,
                pointHoverRadius: 7,
                pointBackgroundColor: "#fff",
                pointBorderColor: "#0d9488",
                pointBorderWidth: 2
              }]}
              max={100}
            />
          </div>
        </div>

        <div className="cal-card">
          <div className="cal-header">
            <select
              className="month-badge mb-purple"
              value={calIndex}
              onChange={(e) => setCalIndex(Number(e.target.value))}
              style={{ border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13 }}
            >
              {CAL_MONTHS.map((m, i) => (
                <option key={m.label} value={i}>{m.label}</option>
              ))}
            </select>
            <div className="cal-nav">
              <div className="cal-arrow" onClick={() => setCalIndex((i) => Math.max(0, i - 1))}><i className="bi bi-chevron-left"></i></div>
              <div className="cal-arrow" onClick={() => setCalIndex((i) => Math.min(CAL_MONTHS.length - 1, i + 1))}><i className="bi bi-chevron-right"></i></div>
            </div>
          </div>
          <div className="cal-grid">
            {DAY_HEADS.map((d, i) => (
              <div key={d} className={`cal-day-head ${i === 0 || i === 6 ? "weekend" : ""}`}>{d}</div>
            ))}
            {cells.map((d, idx) => {
              if (d === null) return <div key={idx} className="cal-day empty"></div>;
              const weekdayIndex = (month.firstDayIndex + d - 1) % 7;
              const isWeekend = weekdayIndex === 0 || weekdayIndex === 6;
              const status = month.status[d];
              const isToday = d === month.today;
              let style = {};
              let cls = "cal-day";
              if (isToday) cls += " today";
              else if (status) style = { background: STATUS_COLOR[status] + "22", color: STATUS_COLOR[status], fontWeight: 600 };
              else if (isWeekend) cls += " weekend";
              return <div key={idx} className={cls} style={style}>{d}</div>;
            })}
          </div>
          <div className="cal-legend">
            <span><span className="leg-dot" style={{ background: "#16a34a" }}></span>Present</span>
            <span><span className="leg-dot" style={{ background: "#dc2626" }}></span>Absent</span>
            <span><span className="leg-dot" style={{ background: "#e59d00" }}></span>Leave</span>
            <span><span className="leg-dot" style={{ background: "#3b82f6" }}></span>Holiday</span>
          </div>
        </div>
      </div>

      {showLeaveModal && (
        <LeaveModal
          onClose={() => setShowLeaveModal(false)}
          onSubmit={handleLeaveSubmit}
        />
      )}
    </div>
  );
}