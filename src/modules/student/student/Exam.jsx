import { useRef, useState } from "react";
import KpiCard from "./KpiCard.jsx";
import Donut from "./Donut.jsx";
import { BarTrend } from "./TrendChart.jsx";

const EXAMS = [
  { subject: "Mathematics", date: "09 Jul 2024", time: "10:00 AM", room: "Room 12", syllabus: "Ch 1-10", status: "upcoming" },
  { subject: "Science", date: "12 Jul 2024", time: "10:00 AM", room: "Room 12", syllabus: "Ch 1-9", status: "upcoming" },
  { subject: "English", date: "01 Jun 2024", time: "10:00 AM", room: "Room 8", syllabus: "Ch 1-8", status: "completed" },
  { subject: "Computer", date: "28 May 2024", time: "11:00 AM", room: "Lab 2", syllabus: "Ch 1-6", status: "completed" },
  { subject: "History", date: "24 May 2024", time: "10:00 AM", room: "Room 8", syllabus: "Ch 1-7", status: "completed" },
  { subject: "Geography", date: "20 May 2024", time: "10:00 AM", room: "Room 8", syllabus: "Ch 1-6", status: "completed" }
];

const SYLLABUS_PROGRESS = [
  { subject: "Mathematics", pct: 85, color: "#4d0011" },
  { subject: "Science", pct: 72, color: "#4d0011" },
  { subject: "English", pct: 90, color: "#4d0011" },
  { subject: "History", pct: 60, color: "#4d0011" }
];

const SYLLABUS_CHAPTERS = EXAMS.map((e) => ({
  subject: e.subject,
  syllabus: e.syllabus,
  status: e.status,
  pct: SYLLABUS_PROGRESS.find((s) => s.subject === e.subject)?.pct ?? null
}));

function SyllabusModal({ onClose }) {
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
          background: "#fff", borderRadius: 12, padding: 24, width: 460,
          maxWidth: "90vw", maxHeight: "80vh", overflowY: "auto",
          boxShadow: "0 10px 40px rgba(0,0,0,0.2)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 18 }}>Syllabus Overview</h3>
          <i className="bi bi-x-lg" style={{ cursor: "pointer" }} onClick={onClose}></i>
        </div>

        {SYLLABUS_CHAPTERS.map((s) => (
          <div key={s.subject} style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 4 }}>
              <strong>{s.subject}</strong>
              <span style={{ color: "#777" }}>{s.syllabus}</span>
            </div>
            {s.pct !== null && (
              <div style={{ background: "#eee", height: 8, borderRadius: 5, overflow: "hidden" }}>
                <div style={{ width: `${s.pct}%`, height: 8, background: "#4d0011", borderRadius: 5 }}></div>
              </div>
            )}
            {s.pct !== null && (
              <div style={{ fontSize: 12, color: "#999", marginTop: 3 }}>{s.pct}% covered</div>
            )}
          </div>
        ))}

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
          <button className="btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

// Draws a hall ticket on an offscreen canvas and downloads it as a PNG.
function downloadHallTicketPng(upcomingExams) {
  const canvas = document.createElement("canvas");
  const width = 800;
  const rowHeight = 40;
  const tableTop = 300;
  const height = tableTop + rowHeight * (upcomingExams.length + 1) + 80;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  // Border
  ctx.strokeStyle = "#4d0011";
  ctx.lineWidth = 4;
  ctx.strokeRect(10, 10, width - 20, height - 20);

  // Header band
  ctx.fillStyle = "#4d0011";
  ctx.fillRect(10, 10, width - 20, 90);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 28px Arial";
  ctx.textAlign = "center";
  ctx.fillText("EXAMINATION HALL TICKET", width / 2, 55);
  ctx.font = "16px Arial";
  ctx.fillText("Final Term Examination · 2024-25", width / 2, 82);

  // Student details
  ctx.fillStyle = "#222222";
  ctx.textAlign = "left";
  ctx.font = "bold 16px Arial";
  ctx.fillText("Student Details", 40, 135);
  ctx.font = "15px Arial";
  ctx.fillText("Class : 6", 40, 165);
  ctx.fillText("Roll No : 20", 220, 165);
  ctx.fillText("Section : A", 400, 165);

  ctx.strokeStyle = "#ddd";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(40, 185);
  ctx.lineTo(width - 40, 185);
  ctx.stroke();

  // Exam schedule title
  ctx.font = "bold 16px Arial";
  ctx.fillText("Exam Schedule", 40, 215);

  // Table header
  const colX = [40, 260, 420, 560, 700];
  const headers = ["Subject", "Date", "Time", "Room", "Syllabus"];
  let y = 250;
  ctx.fillStyle = "#f3f4f6";
  ctx.fillRect(40, y - 24, width - 80, 34);
  ctx.fillStyle = "#333333";
  ctx.font = "bold 13px Arial";
  headers.forEach((h, i) => ctx.fillText(h, colX[i], y - 2));

  y += 20;
  ctx.font = "13px Arial";
  ctx.fillStyle = "#222222";
  upcomingExams.forEach((e, i) => {
    const rowY = y + i * rowHeight;
    if (i % 2 === 1) {
      ctx.fillStyle = "#fafafa";
      ctx.fillRect(40, rowY - 20, width - 80, rowHeight);
      ctx.fillStyle = "#222222";
    }
    ctx.fillText(e.subject, colX[0], rowY + 4);
    ctx.fillText(e.date, colX[1], rowY + 4);
    ctx.fillText(e.time, colX[2], rowY + 4);
    ctx.fillText(e.room, colX[3], rowY + 4);
    ctx.fillText(e.syllabus, colX[4], rowY + 4);
  });

  // Footer note
  const footerY = y + upcomingExams.length * rowHeight + 30;
  ctx.font = "italic 12px Arial";
  ctx.fillStyle = "#777777";
  ctx.textAlign = "center";
  ctx.fillText("Please carry this hall ticket along with your school ID card to every exam.", width / 2, footerY);

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "hall-ticket.png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, "image/png");
}

export default function Exam() {
  const [showSyllabus, setShowSyllabus] = useState(false);
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);

  function showToast(msg) {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3000);
  }

  function handleDownloadHallTicket() {
    const upcoming = EXAMS.filter((e) => e.status === "upcoming");
    downloadHallTicketPng(upcoming);
    showToast("Hall ticket downloaded as PNG.");
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Exam</h1>
          <hr/>
          <p>Class : 6 &nbsp; Roll No : 20 &nbsp; · &nbsp; Upcoming exams, schedule, and syllabus progress</p>
        </div>
        <div className="header-actions">
          <button className="btn-outline" onClick={() => setShowSyllabus(true)}>
            <i className="bi bi-file-earmark-text"></i> Syllabus
          </button>
          <button className="btn-primary" onClick={handleDownloadHallTicket}>
            <i className="bi bi-ticket-perforated-fill"></i> Download Hall Ticket
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
        <KpiCard icon="bi-journal-text" iconBg="#e8f4fd" value="2" label="Upcoming Exams" badge="Final Term" badgeClass="badge-blue" />
        <KpiCard icon="bi-hourglass-split" iconBg="#fff8e1" value="5" label="Days to Next Exam" badge="Math · 09 Jul" badgeClass="badge-amber" />
        <KpiCard icon="bi-stack" iconBg="#ede9fe" value="6" label="Total Papers" badge="Final Term" badgeClass="badge-blue" />
        <KpiCard icon="bi-check2-square" iconBg="#dcfce7" value="78%" label="Syllabus Covered" badge="On Track" badgeClass="badge-green" />
      </div>

      <div className="mid-row">
        <div className="att-card">
          <div className="att-header">
            <span className="att-title">Next Exam</span>
            <span className="month-badge mb-purple">Mathematics</span>
          </div>
          <div className="countdown-box">
            <span className="countdown-num">5</span>
            <span className="countdown-unit">days left</span>
          </div>
          <div className="att-stats" style={{ textAlign: "center" }}>
            <div className="row" style={{ marginBottom: 0 }}><span className="slbl">09 Jul 2024 · 10:00 AM · Room 12</span></div>
          </div>
        </div>

        <div className="att-card">
          <div className="att-header">
            <span className="att-title">Syllabus Progress</span>
            <span className="month-badge mb-pink">Overall</span>
          </div>
          <div className="att-body">
            <Donut values={[78, 22]} colors={["#4d0011", "#FAEBD7"]} centerLabel="78%" />
            <div className="att-stats">
              <div className="row"><span className="slbl">Completed</span><span className="sval">78%</span></div>
              <div className="row"><span className="slbl">Remaining</span><span className="sval">22%</span></div>
            </div>
          </div>
        </div>

        <div className="att-card">
          <div className="att-header">
            <span className="att-title">Exam Types</span>
            <span className="month-badge mb-blue">This Year</span>
          </div>
          <div className="att-body">
            <Donut values={[4, 1, 1]} colors={["#4d0011", "#FAEBD7", "#F5DEB3"]} centerLabel="9" cutout="70%" />
            <div className="att-stats">
              <div className="row"><span className="slbl">Unit Tests</span><span className="sval">4</span></div>
              <div className="row"><span className="slbl">Mid-Term</span><span className="sval">1</span></div>
              <div className="row"><span className="slbl">Final Term</span><span className="sval">1</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bottom-row">
        <div className="chart-card">
          <div className="chart-header">
            <span className="chart-title">Subject-wise Syllabus Coverage</span>
            <button className="filter-btn">Final Term <i className="bi bi-chevron-down" style={{ fontSize: 10 }}></i></button>
          </div>
          <div className="chart-legend"><span><span className="leg-dot" style={{ background: "#4d0011" }}></span>% Covered</span></div>
          <div style={{ position: "relative", height: 200 }}>
            <BarTrend
              labels={["Math", "Science", "English", "Computer", "History", "Geography"]}
              data={[85, 72, 90, 80, 60, 75]}
              color="#4d0011"
              max={100}
            />
          </div>
        </div>

        <div className="cal-card">
          <div className="cal-header"><span className="cal-title">Prep Checklist</span></div>
          {SYLLABUS_PROGRESS.map((s) => (
            <div className="syllabus-row" key={s.subject}>
              <div className="syllabus-label"><span>{s.subject}</span><span>{s.pct}%</span></div>
              <div className="syllabus-track"><div className="syllabus-fill" style={{ width: `${s.pct}%`, background: s.color }}></div></div>
            </div>
          ))}
        </div>
      </div>

      {showSyllabus && <SyllabusModal onClose={() => setShowSyllabus(false)} />}
    </div>
  );
}