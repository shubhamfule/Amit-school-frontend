import { useMemo, useState } from "react";
import KpiCard from "./KpiCard.jsx";
import Donut from "./Donut.jsx";
import FilterChips from "./FilterChips.jsx";

const INITIAL_NOTICES = [
  { id: 1, title: "PTM scheduled for 12th July", category: "event", date: "05 Jul 2024", by: "Class Teacher", unread: true },
  { id: 2, title: "Half-yearly exam datesheet released", category: "academic", date: "03 Jul 2024", by: "Exam Cell", unread: true },
  { id: 3, title: "School closed on 17th July (Local Holiday)", category: "holiday", date: "02 Jul 2024", by: "Administration", unread: true },
  { id: 4, title: "Fee payment deadline reminder", category: "urgent", date: "01 Jul 2024", by: "Accounts Office", unread: true },
  { id: 5, title: "Inter-house sports meet registrations open", category: "event", date: "28 Jun 2024", by: "Sports Dept", unread: false },
  { id: 6, title: "Library book return deadline extended", category: "academic", date: "24 Jun 2024", by: "Librarian", unread: false },
  { id: 7, title: "Uniform guidelines updated for monsoon season", category: "urgent", date: "20 Jun 2024", by: "Administration", unread: false },
  { id: 8, title: "Summer break assignment submission reminder", category: "academic", date: "15 Jun 2024", by: "Class Teacher", unread: false }
];

const CATEGORY_META = {
  academic: { label: "Academic", tagClass: "tag-academic", icon: "bi-journal-check", bg: "#e8f4fd", color: "#2a78d6" },
  event: { label: "Event", tagClass: "tag-event", icon: "bi-calendar-event", bg: "#ede9fe", color: "#4f3de8" },
  holiday: { label: "Holiday", tagClass: "tag-holiday", icon: "bi-sun-fill", bg: "#dcfce7", color: "#16a34a" },
  urgent: { label: "Urgent", tagClass: "tag-urgent", icon: "bi-exclamation-triangle-fill", bg: "#fee2e2", color: "#dc2626" }
};

const FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "academic", label: "Academic" },
  { value: "event", label: "Event" },
  { value: "holiday", label: "Holiday" },
  { value: "urgent", label: "Urgent" }
];

// Builds a real .xls file (Excel-readable HTML table format) with no external library needed.
function downloadNoticeAsExcel(notice) {
  const meta = CATEGORY_META[notice.category];
  const escapeHtml = (v) =>
    String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const rows = [
    ["Field", "Value"],
    ["Title", notice.title],
    ["Category", meta.label],
    ["Date", notice.date],
    ["Posted By", notice.by],
    ["Status", notice.unread ? "Unread" : "Read"]
  ];

  const tableRows = rows
    .map(
      (r, i) =>
        `<tr>${r
          .map(
            (cell) =>
              `<${i === 0 ? "th" : "td"} style="border:1px solid #ccc;padding:6px 10px;${
                i === 0 ? "background:#f3f4f6;font-weight:bold;" : ""
              }">${escapeHtml(cell)}</${i === 0 ? "th" : "td"}>`
          )
          .join("")}</tr>`
    )
    .join("");

  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta charset="UTF-8"></head>
    <body><table>${tableRows}</table></body>
    </html>`;

  const blob = new Blob([html], { type: "application/vnd.ms-excel" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const safeName = notice.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase().slice(0, 50);
  link.setAttribute("download", `notice-${safeName}.xls`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function downloadAllNoticesAsExcel(notices) {
  const escapeHtml = (v) =>
    String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const header = `<tr>${["Title", "Category", "Date", "Posted By", "Status"]
    .map((h) => `<th style="border:1px solid #ccc;padding:6px 10px;background:#f3f4f6;font-weight:bold;">${h}</th>`)
    .join("")}</tr>`;

  const body = notices
    .map((n) => {
      const meta = CATEGORY_META[n.category];
      const cells = [n.title, meta.label, n.date, n.by, n.unread ? "Unread" : "Read"];
      return `<tr>${cells
        .map((c) => `<td style="border:1px solid #ccc;padding:6px 10px;">${escapeHtml(c)}</td>`)
        .join("")}</tr>`;
    })
    .join("");

  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta charset="UTF-8"></head>
    <body><table>${header}${body}</table></body>
    </html>`;

  const blob = new Blob([html], { type: "application/vnd.ms-excel" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "all-notices.xls");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function NoticeViewModal({ notice, onClose }) {
  const meta = CATEGORY_META[notice.category];
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
          background: "#fff", borderRadius: 12, padding: 24, width: 420,
          maxWidth: "90vw", boxShadow: "0 10px 40px rgba(0,0,0,0.2)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <span className={`status-pill ${meta.tagClass}`}><i className={`bi ${meta.icon}`}></i> {meta.label}</span>
          <i className="bi bi-x-lg" style={{ cursor: "pointer" }} onClick={onClose}></i>
        </div>

        <h3 style={{ margin: "0 0 12px 0", fontSize: 18 }}>{notice.title}</h3>

        <div style={{ fontSize: 14, color: "#555", lineHeight: 1.8 }}>
          <div><strong>Date:</strong> {notice.date}</div>
          <div><strong>Posted By:</strong> {notice.by}</div>
          <div><strong>Status:</strong> {notice.unread ? "Unread" : "Read"}</div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 }}>
          <button className="download-btn" onClick={() => downloadNoticeAsExcel(notice)}>
            <i className="bi bi-download"></i> Download
          </button>
          <button className="btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default function Notice() {
  const [notices, setNotices] = useState(INITIAL_NOTICES);
  const [filter, setFilter] = useState("all");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [viewingNotice, setViewingNotice] = useState(null);
  const [toast, setToast] = useState("");

  const rows = useMemo(
    () => (filter === "all" ? notices : notices.filter((n) => n.category === filter)),
    [notices, filter]
  );
  const recent = notices.slice(0, 4);

  function markAllRead() {
    setNotices((prev) => prev.map((n) => ({ ...n, unread: false })));
  }

  function handleViewClick(notice) {
    setNotices((prev) => prev.map((n) => (n.id === notice.id ? { ...n, unread: false } : n)));
    setViewingNotice(notice);
  }

  function handleDownloadClick(notice) {
    downloadNoticeAsExcel(notice);
    showToast(`"${notice.title}" downloaded as Excel.`);
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Notice Board</h1>
          <hr/>
          <p>Class : 6 &nbsp; Roll No : 20 &nbsp; · &nbsp; Stay updated with school announcements</p>
        </div>
        <div className="header-actions">
          <button className="btn-outline" onClick={markAllRead}><i className="bi bi-check2-all"></i> Mark All Read</button>
          <button
            className={showFilterPanel ? "btn-primary" : "btn-outline"}
            onClick={() => setShowFilterPanel((v) => !v)}
          >
            <i className="bi bi-funnel-fill"></i> Filter
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
        <KpiCard icon="bi-megaphone-fill" iconBg="#ede9fe" value="18" label="Total Notices" badge="This Year" badgeClass="badge-blue" />
        <KpiCard icon="bi-envelope-open-fill" iconBg="#e8f4fd" value={notices.filter((n) => n.unread).length} label="Unread" badge="New" badgeClass="badge-blue" />
        <KpiCard icon="bi-exclamation-triangle-fill" iconBg="#fee2e2" value="2" label="Urgent" badge="Action Needed" badgeClass="badge-red" />
        <KpiCard icon="bi-calendar2-week-fill" iconBg="#dcfce7" value="6" label="This Month" badge="Jul 2024" badgeClass="badge-green" />
      </div>

      <div className="mid-row">
        <div className="att-card">
          <div className="att-header">
            <span className="att-title">Notices by Category</span>
            <span className="month-badge mb-purple">This Year</span>
          </div>
          <div className="att-body">
            <Donut values={[8, 7, 3]} colors={["#4d0011", "#FAEBD7", "#F5DEB3"]} centerLabel="18" cutout="70%" />
            <div className="att-stats">
              <div className="row"><span className="slbl">Academic</span><span className="sval">8</span></div>
              <div className="row"><span className="slbl">Events &amp; Holidays</span><span className="sval">7</span></div>
              <div className="row"><span className="slbl">Urgent</span><span className="sval">3</span></div>
            </div>
          </div>
        </div>

        <div className="att-card" style={{ gridColumn: "span 2" }}>
          <div className="att-header">
            <span className="att-title">Latest Announcements</span>
            <span className="month-badge mb-blue">Live Feed</span>
          </div>
          <div>
            {recent.map((n) => {
              const meta = CATEGORY_META[n.category];
              return (
                <div className="notice-feed-item" key={n.id}>
                  <div className="notice-feed-icon" style={{ background: meta.bg, color: meta.color }}>
                    <i className={`bi ${meta.icon}`}></i>
                  </div>
                  <div className="notice-feed-body">
                    <div className="notice-feed-title">
                      {n.unread && <span className="unread-dot"></span>} {n.title}
                    </div>
                    <div className="notice-feed-meta">{meta.label} · {n.date} · {n.by}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="log-card">
        <div className="chart-header">
          <span className="chart-title">All Notices</span>
          <button className="filter-btn" onClick={() => downloadAllNoticesAsExcel(rows)}>
            <i className="bi bi-download"></i> Export All
          </button>
        </div>

        {showFilterPanel && <FilterChips options={FILTER_OPTIONS} active={filter} onChange={setFilter} />}

        <table>
          <thead>
            <tr><th>Notice</th><th>Category</th><th>Date</th><th>Posted By</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={5} className="log-empty">No notices in this category.</td></tr>
            )}
            {rows.map((n) => {
              const meta = CATEGORY_META[n.category];
              return (
                <tr key={n.id}>
                  <td>
                    <div className="notice-title-cell">
                      {n.unread && <span className="unread-dot"></span>}
                      <span className={`notice-title-text ${n.unread ? "" : "read"}`}>{n.title}</span>
                    </div>
                  </td>
                  <td><span className={`status-pill ${meta.tagClass}`}><i className={`bi ${meta.icon}`}></i> {meta.label}</span></td>
                  <td>{n.date}</td>
                  <td>{n.by}</td>
                  <td>
                    <button className="view-btn" onClick={() => handleViewClick(n)}>
                      <i className="bi bi-eye"></i> View
                    </button>{" "}
                    <button className="download-btn" onClick={() => handleDownloadClick(n)}>
                      <i className="bi bi-download"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {viewingNotice && (
        <NoticeViewModal notice={viewingNotice} onClose={() => setViewingNotice(null)} />
      )}
    </div>
  );
}