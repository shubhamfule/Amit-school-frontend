import { useMemo, useState } from "react";
import KpiCard from "./KpiCard.jsx";
import Donut from "./Donut.jsx";
import FilterChips from "./FilterChips.jsx";
import { BarTrend, LineTrend } from "./TrendChart.jsx";

const RESULTS = [
  { subject: "Math", term: "unit1", marks: 42, max: 50, grade: "A+", status: "pass" },
  { subject: "Science", term: "unit1", marks: 40, max: 50, grade: "A", status: "pass" },
  { subject: "English", term: "unit1", marks: 44, max: 50, grade: "A+", status: "pass" },
  { subject: "Computer", term: "unit1", marks: 41, max: 50, grade: "A", status: "pass" },
  { subject: "History", term: "unit1", marks: 36, max: 50, grade: "B+", status: "average" },
  { subject: "Geography", term: "unit1", marks: 39, max: 50, grade: "A", status: "pass" },

  { subject: "Math", term: "unit2", marks: 44, max: 50, grade: "A+", status: "pass" },
  { subject: "Science", term: "unit2", marks: 41, max: 50, grade: "A", status: "pass" },
  { subject: "English", term: "unit2", marks: 45, max: 50, grade: "A+", status: "pass" },
  { subject: "Computer", term: "unit2", marks: 42, max: 50, grade: "A", status: "pass" },
  { subject: "History", term: "unit2", marks: 38, max: 50, grade: "A", status: "pass" },
  { subject: "Geography", term: "unit2", marks: 40, max: 50, grade: "A", status: "pass" },

  { subject: "Math", term: "term1", marks: 88, max: 100, grade: "A", status: "pass" },
  { subject: "Science", term: "term1", marks: 84, max: 100, grade: "A", status: "pass" },
  { subject: "English", term: "term1", marks: 90, max: 100, grade: "A+", status: "pass" },
  { subject: "Computer", term: "term1", marks: 86, max: 100, grade: "A", status: "pass" },
  { subject: "History", term: "term1", marks: 78, max: 100, grade: "B+", status: "average" },
  { subject: "Geography", term: "term1", marks: 82, max: 100, grade: "A", status: "pass" },

  { subject: "Math", term: "term2", marks: 90, max: 100, grade: "A+", status: "pass" },
  { subject: "Science", term: "term2", marks: 86, max: 100, grade: "A", status: "pass" },
  { subject: "English", term: "term2", marks: 92, max: 100, grade: "A+", status: "pass" },
  { subject: "Computer", term: "term2", marks: 88, max: 100, grade: "A", status: "pass" },
  { subject: "History", term: "term2", marks: 80, max: 100, grade: "A", status: "pass" },
  { subject: "Geography", term: "term2", marks: 85, max: 100, grade: "A", status: "pass" },

  { subject: "Math", term: "final", marks: 92, max: 100, grade: "A+", status: "pass" },
  { subject: "Science", term: "final", marks: 88, max: 100, grade: "A", status: "pass" },
  { subject: "English", term: "final", marks: 95, max: 100, grade: "A+", status: "pass" },
  { subject: "Computer", term: "final", marks: 90, max: 100, grade: "A+", status: "pass" },
  { subject: "History", term: "final", marks: 84, max: 100, grade: "A", status: "pass" },
  { subject: "Geography", term: "final", marks: 89, max: 100, grade: "A", status: "pass" }
];

const STATUS_META = {
  pass: { label: "Pass", cls: "status-pass", icon: "bi-check-circle" },
  average: { label: "Average", cls: "status-average", icon: "bi-dash-circle" },
  fail: { label: "Fail", cls: "status-fail", icon: "bi-x-circle" }
};

const TERM_LABELS = {
  unit1: "Unit Test 1",
  unit2: "Unit Test 2",
  term1: "Term 1",
  term2: "Term 2",
  final: "Final Term"
};

const FILTER_OPTIONS = [
  { value: "all", label: "All Terms" },
  { value: "unit1", label: "Unit Test 1" },
  { value: "unit2", label: "Unit Test 2" },
  { value: "term1", label: "Term 1" },
  { value: "term2", label: "Term 2" },
  { value: "final", label: "Final Term" }
];

const escapeHtml = (v) =>
  String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function excelBlobDownload(html, filename) {
  const blob = new Blob([html], { type: "application/vnd.ms-excel" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function wrapExcelHtml(tableHtml) {
  return `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta charset="UTF-8"></head>
    <body><table>${tableHtml}</table></body>
    </html>`;
}

function downloadSubjectResultAsExcel(r) {
  const meta = STATUS_META[r.status];
  const rows = [
    ["Field", "Value"],
    ["Subject", r.subject],
    ["Term", TERM_LABELS[r.term] || r.term],
    ["Marks Obtained", r.marks],
    ["Max Marks", r.max],
    ["Grade", r.grade],
    ["Status", meta.label]
  ];
  const tableHtml = rows
    .map(
      (row, i) =>
        `<tr>${row
          .map(
            (cell) =>
              `<${i === 0 ? "th" : "td"} style="border:1px solid #ccc;padding:6px 10px;${
                i === 0 ? "background:#f3f4f6;font-weight:bold;" : ""
              }">${escapeHtml(cell)}</${i === 0 ? "th" : "td"}>`
          )
          .join("")}</tr>`
    )
    .join("");
  const safeName = `${r.subject}-${r.term}`.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  excelBlobDownload(wrapExcelHtml(tableHtml), `result-${safeName}.xls`);
}

function downloadReportCardAsExcel(results) {
  const header = `<tr>${["Subject", "Term", "Marks Obtained", "Max Marks", "Grade", "Status"]
    .map((h) => `<th style="border:1px solid #ccc;padding:6px 10px;background:#f3f4f6;font-weight:bold;">${h}</th>`)
    .join("")}</tr>`;

  const body = results
    .map((r) => {
      const meta = STATUS_META[r.status];
      const cells = [r.subject, TERM_LABELS[r.term] || r.term, r.marks, r.max, r.grade, meta.label];
      return `<tr>${cells
        .map((c) => `<td style="border:1px solid #ccc;padding:6px 10px;">${escapeHtml(c)}</td>`)
        .join("")}</tr>`;
    })
    .join("");

  excelBlobDownload(wrapExcelHtml(header + body), "report-card.xls");
}

function ResultViewModal({ result, onClose }) {
  const meta = STATUS_META[result.status];
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <span className={`status-pill ${meta.cls}`}><i className={`bi ${meta.icon}`}></i> {meta.label}</span>
          <i className="bi bi-x-lg" style={{ cursor: "pointer" }} onClick={onClose}></i>
        </div>

        <h3 style={{ margin: "0 0 12px 0", fontSize: 18 }}>{result.subject}</h3>

        <div style={{ fontSize: 14, color: "#555", lineHeight: 1.8 }}>
          <div><strong>Term:</strong> {TERM_LABELS[result.term] || result.term}</div>
          <div><strong>Marks:</strong> {result.marks} / {result.max}</div>
          <div><strong>Grade:</strong> {result.grade}</div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 }}>
          <button className="download-btn" onClick={() => downloadSubjectResultAsExcel(result)}>
            <i className="bi bi-download"></i> Download
          </button>
          <button className="btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default function Result() {
  const [filter, setFilter] = useState("all");
  const [viewingResult, setViewingResult] = useState(null);
  const [toast, setToast] = useState("");

  const rows = useMemo(
    () => (filter === "all" ? RESULTS : RESULTS.filter((r) => r.term === filter)),
    [filter]
  );

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  function handleDownloadReportCard() {
    downloadReportCardAsExcel(RESULTS);
    showToast("Report card downloaded as Excel.");
  }

  function handlePrint() {
    window.print();
  }

  function handleRowDownload(r) {
    downloadSubjectResultAsExcel(r);
    showToast(`${r.subject} (${TERM_LABELS[r.term] || r.term}) downloaded as Excel.`);
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Result</h1>
          <hr/>
          <p>Class : 6 &nbsp; Roll No : 20 &nbsp; · &nbsp; Academic performance and exam results</p>
        </div>
        <div className="header-actions">
          <button className="btn-outline" onClick={handleDownloadReportCard}>
            <i className="bi bi-download"></i> Download Report Card
          </button>
          <button className="btn-primary" onClick={handlePrint}>
            <i className="bi bi-printer-fill"></i> Print
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
        <KpiCard icon="bi-award-fill" iconBg="#fde9f0" value="A+" label="Overall Grade" badge="CGPA 9.1" badgeClass="badge-blue" />
        <KpiCard icon="bi-percent" iconBg="#ede9fe" value="91.3%" label="Overall Percentage" badge={<><i className="bi bi-arrow-up-short"></i> +2.4% vs last term</>} badgeClass="badge-green" />
        <KpiCard icon="bi-trophy-fill" iconBg="#e8f4fd" value="12" label="Class Rank" badge="Out of 40" badgeClass="badge-blue" />
        <KpiCard icon="bi-check2-circle" iconBg="#dcfce7" value="6 / 6" label="Subjects Passed" badge="All Clear" badgeClass="badge-green" />
      </div>

      <div className="mid-row">
        <div className="att-card">
          <div className="att-header">
            <span className="att-title">Grade Distribution</span>
            <span className="month-badge mb-purple">Final Term</span>
          </div>
          <div className="att-body">
            <Donut values={[3, 2, 1]} colors={["#4d0011", "#FAEBD7", "#F5DEB3"]} centerLabel="A+" cutout="70%" />
            <div className="att-stats">
              <div className="row"><span className="slbl">A+ Subjects</span><span className="sval">3</span></div>
              <div className="row"><span className="slbl">A Subjects</span><span className="sval">2</span></div>
              <div className="row"><span className="slbl">B+ Subjects</span><span className="sval">1</span></div>
            </div>
          </div>
        </div>

        <div className="att-card">
          <div className="att-header">
            <span className="att-title">Best &amp; Weakest Subject</span>
            <span className="month-badge mb-pink">Final Term</span>
          </div>
          <div style={{ paddingTop: 4 }}>
            <div className="marks-bar-row" style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}><span>English (Best)</span><span>95%</span></div>
              <div style={{ background: "#eee", height: 8, borderRadius: 5, overflow: "hidden" }}>
                <div style={{ width: "95%", height: 8, background: "#16a34a", borderRadius: 5 }}></div>
              </div>
            </div>
            <div className="marks-bar-row">
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}><span>History (Needs Focus)</span><span>84%</span></div>
              <div style={{ background: "#eee", height: 8, borderRadius: 5, overflow: "hidden" }}>
                <div style={{ width: "84%", height: 8, background: "#e59d00", borderRadius: 5 }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="att-card">
          <div className="att-header">
            <span className="att-title">You vs Class Average</span>
            <span className="month-badge mb-blue">Final Term</span>
          </div>
          <div className="att-body">
            <Donut values={[91, 9]} colors={["#4d0011", "#f0f0f8"]} centerLabel="+9%" />
            <div className="att-stats">
              <div className="row"><span className="slbl">Your Score</span><span className="sval">91.3%</span></div>
              <div className="row"><span className="slbl">Class Average</span><span className="sval">82.5%</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bottom-row">
        <div className="chart-card">
          <div className="chart-header">
            <span className="chart-title">Subject-wise Marks</span>
            <button className="filter-btn">Final Term <i className="bi bi-chevron-down" style={{ fontSize: 10 }}></i></button>
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
          <div className="cal-header"><span className="cal-title">Performance Trend</span></div>
          <div style={{ position: "relative", height: 180 }}>
            <LineTrend
              labels={["Unit 1", "Unit 2", "Term 1", "Term 2", "Final Term"]}
              datasets={[
                { label: "Your %", data: [80.7, 83.3, 86, 88, 91.3], borderColor: "#4d0011", backgroundColor: "rgba(77,0,17,0.12)", fill: true, tension: 0.35, pointRadius: 4, pointBackgroundColor: "#4d0011" },
                { label: "Class Avg", data: [75, 77, 80, 81, 82.5], borderColor: "#b8899a", backgroundColor: "rgba(184,137,154,0.12)", fill: false, tension: 0.35, pointRadius: 3, pointBackgroundColor: "#b8899a", borderDash: [4, 4] }
              ]}
            />
          </div>
          <div className="compare-legend" style={{ display: "flex", gap: 16, fontSize: 11, color: "var(--text2)", marginTop: 10 }}>
            <span><span style={{ background: "#4d0011", display: "inline-block", width: 10, height: 10, borderRadius: 3, marginRight: 4 }}></span>Your %</span>
            <span><span style={{ background: "#b8899a", display: "inline-block", width: 10, height: 10, borderRadius: 3, marginRight: 4 }}></span>Class Avg</span>
          </div>
        </div>
      </div>

      <div className="log-card">
        <div className="chart-header">
          <span className="chart-title">Subject-wise Result Sheet</span>
          <button className="filter-btn" onClick={handleDownloadReportCard}>
            <i className="bi bi-download"></i> Export All
          </button>
        </div>

        <FilterChips options={FILTER_OPTIONS} active={filter} onChange={setFilter} />

        <table>
          <thead>
            <tr><th>Subject</th><th>Marks Obtained</th><th>Max Marks</th><th>Grade</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={6} className="log-empty">No results for this term yet.</td></tr>}
            {rows.map((r, i) => {
              const meta = STATUS_META[r.status];
              return (
                <tr key={i}>
                  <td>{r.subject}</td>
                  <td>{r.marks}</td>
                  <td>{r.max}</td>
                  <td><span className="grade-badge">{r.grade}</span></td>
                  <td><span className={`status-pill ${meta.cls}`}><i className={`bi ${meta.icon}`}></i> {meta.label}</span></td>
                  <td>
                    <button className="view-btn" onClick={() => setViewingResult(r)}>
                      <i className="bi bi-eye"></i> View
                    </button>{" "}
                    <button className="download-btn" onClick={() => handleRowDownload(r)}>
                      <i className="bi bi-download"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {viewingResult && (
        <ResultViewModal result={viewingResult} onClose={() => setViewingResult(null)} />
      )}
    </div>
  );
}