import { useMemo, useState } from "react";
import KpiCard from "./KpiCard.jsx";
import Donut from "./Donut.jsx";
import FilterChips from "./FilterChips.jsx";
import { BarTrend } from "./TrendChart.jsx";

const INITIAL_BOOKS = [
  { title: "The Wonders of Science", author: "R. K. Sharma", Id: "Wonders@12", issue: "20 Jun 2024", due: "04 Jul 2024", status: "issued", initial: "W", color: "#4d0011" },
  { title: "A Journey Through History", author: "Meena Rao", Id: "journery@2", issue: "15 Jun 2024", due: "29 Jun 2024", status: "overdue", initial: "J", color: "#dc2626" },
  { title: "Mathematics Made Easy", author: "Anil Verma", Id: "Mathematics@3", issue: "25 Jun 2024", due: "09 Jul 2024", status: "issued", initial: "M", color: "#2a78d6" },
  { title: "Tales from Panchatantra", author: "Vishnu Sharma", Id: "Panchatntra@14", issue: "01 May 2024", due: "15 May 2024", status: "returned", initial: "T", color: "#16a34a" },
  { title: "The Solar System", author: "Kavita Nair", Id: "Solar@12", issue: "10 Apr 2024", due: "24 Apr 2024", status: "returned", initial: "S", color: "#e59d00" }
];

const RECOMMENDED = [
  { title: "Around the World in 80 Days", sub: "Jules Verne · Fiction", badge: "New", badgeClass: "badge-blue" },
  { title: "The Elements of Chemistry", sub: "S. Iyer · Science", badge: "Popular", badgeClass: "badge-green" },
  { title: "Great Indian Freedom Fighters", sub: "P. Bose · Reference", badge: "New", badgeClass: "badge-blue" }
];

const CATALOGUE = [
  ...RECOMMENDED,
  { title: "The Wonders of Science", sub: "R. K. Sharma · Science", badge: "Issued to you", badgeClass: "badge-amber" },
  { title: "Mathematics Made Easy", sub: "Anil Verma · Reference", badge: "Issued to you", badgeClass: "badge-amber" },
  { title: "Tales from Panchatantra", sub: "Vishnu Sharma · Fiction", badge: "Available", badgeClass: "badge-green" },
  { title: "The Solar System", sub: "Kavita Nair · Science", badge: "Available", badgeClass: "badge-green" },
  { title: "A Journey Through History", sub: "Meena Rao · Reference", badge: "Available", badgeClass: "badge-green" }
];

const STATUS_META = {
  issued: { label: "Issued", cls: "status-issued", icon: "bi-bookmark-check" },
  returned: { label: "Returned", cls: "status-returned", icon: "bi-check-circle" },
  overdue: { label: "Overdue", cls: "status-overdue", icon: "bi-exclamation-circle" }
};

const FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "issued", label: "Issued" },
  { value: "returned", label: "Returned" },
  { value: "overdue", label: "Overdue" }
];

function addDays(dateStr, days) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function HistoryModal({ books, onClose }) {
  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
      onClick={onClose}
    >
      <div
        style={{ background: "#fff", borderRadius: 12, padding: 24, width: 480, maxWidth: "90vw", maxHeight: "80vh", overflowY: "auto", boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 18 }}>Borrowing History</h3>
          <i className="bi bi-x-lg" style={{ cursor: "pointer" }} onClick={onClose}></i>
        </div>
        {books.map((b, i) => {
          const meta = STATUS_META[b.status];
          return (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < books.length - 1 ? "1px solid #eee" : "none" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{b.title}</div>
                <div style={{ fontSize: 12, color: "#888" }}>{b.author} · Issued {b.issue} · Due {b.due}</div>
              </div>
              <span className={`status-pill ${meta.cls}`}><i className={`bi ${meta.icon}`}></i> {meta.label}</span>
            </div>
          );
        })}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
          <button className="btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

function CatalogueModal({ onClose }) {
  const [query, setQuery] = useState("");
  const filtered = CATALOGUE.filter(
    (b) => b.title.toLowerCase().includes(query.toLowerCase()) || b.sub.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
      onClick={onClose}
    >
      <div
        style={{ background: "#fff", borderRadius: 12, padding: 24, width: 480, maxWidth: "90vw", maxHeight: "80vh", overflowY: "auto", boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 18 }}>Full Catalogue</h3>
          <i className="bi bi-x-lg" style={{ cursor: "pointer" }} onClick={onClose}></i>
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search title, author, ISBN..."
          style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #ddd", boxSizing: "border-box", marginBottom: 14, fontSize: 14 }}
          autoFocus
        />

        {filtered.length === 0 && <div style={{ fontSize: 13, color: "#999", textAlign: "center", padding: "20px 0" }}>No books match your search.</div>}

        {filtered.map((b, i) => (
          <div className="browse-item" key={`${b.title}-${i}`}>
            <div className="browse-meta">
              <div className="browse-title">{b.title}</div>
              <div className="browse-sub">{b.sub}</div>
            </div>
            <span className={`kpi-badge ${b.badgeClass} browse-badge`}>{b.badge}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Library() {
  const [books, setBooks] = useState(INITIAL_BOOKS);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [showCatalogue, setShowCatalogue] = useState(false);
  const [toast, setToast] = useState("");

  const rows = useMemo(() => {
    let list = filter === "all" ? books : books.filter((b) => b.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.Id.toLowerCase().includes(q)
      );
    }
    return list;
  }, [books, filter, search]);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  function handleRenew(index) {
    setBooks((prev) =>
      prev.map((b, i) => {
        if (i !== index) return b;
        const newDue = addDays(b.due, 14);
        return { ...b, due: newDue, status: "issued" };
      })
    );
    showToast(`Renewed. New due date set.`);
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Library</h1>
          <hr/>
          <p>Class : 6 &nbsp; Roll No : 20 &nbsp; · &nbsp; Borrowed books, due dates, and catalogue</p>
        </div>
        <div className="header-actions">
          <button className="btn-outline" onClick={() => setShowHistory(true)}>
            <i className="bi bi-clock-history"></i> Borrowing History
          </button>
          <button className="btn-primary" onClick={() => setShowCatalogue(true)}>
            <i className="bi bi-search"></i> Browse Catalogue
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
        <KpiCard icon="bi-journal-bookmark-fill" iconBg="#ede9fe" value="3" label="Books Borrowed" badge="Currently Issued" badgeClass="badge-blue" />
        <KpiCard icon="bi-exclamation-circle" iconBg="#fee2e2" value="1" label="Overdue" badge="Return Now" badgeClass="badge-red" />
        <KpiCard icon="bi-cash-coin" iconBg="#fff8e1" value="₹15" label="Fine Due" badge="Pay at Desk" badgeClass="badge-amber" />
        <KpiCard icon="bi-book-half" iconBg="#dcfce7" value="14" label="Books Read This Year" badge="On Track" badgeClass="badge-green" />
      </div>

      <div className="mid-row">
        <div className="att-card">
          <div className="att-header">
            <span className="att-title">Books by Category</span>
            <span className="month-badge mb-purple">This Year</span>
          </div>
          <div className="att-body">
            <Donut values={[6, 5, 3]} colors={["#4d0011", "#FAEBD7", "#F5DEB3"]} centerLabel="14" cutout="70%" />
            <div className="att-stats">
              <div className="row"><span className="slbl">Fiction</span><span className="sval">6</span></div>
              <div className="row"><span className="slbl">Science</span><span className="sval">5</span></div>
              <div className="row"><span className="slbl">Reference</span><span className="sval">3</span></div>
            </div>
          </div>
        </div>

        <div className="att-card">
          <div className="att-header">
            <span className="att-title">Return Status</span>
            <span className="month-badge mb-pink">Current</span>
          </div>
          <div className="att-body">
            <Donut values={[2, 1]} colors={["#4d0011", "#F5DEB3"]} centerLabel="3" cutout="70%" />
            <div className="att-stats">
              <div className="row"><span className="slbl">On Time</span><span className="sval">2</span></div>
              <div className="row"><span className="slbl">Overdue</span><span className="sval">1</span></div>
            </div>
          </div>
        </div>

        <div className="att-card">
          <div className="att-header">
            <span className="att-title">Recommended for You</span>
            <span className="month-badge mb-blue">New Arrivals</span>
          </div>
          <div>
            {RECOMMENDED.map((b) => (
              <div className="browse-item" key={b.title}>
                <div className="browse-meta">
                  <div className="browse-title">{b.title}</div>
                  <div className="browse-sub">{b.sub}</div>
                </div>
                <span className={`kpi-badge ${b.badgeClass} browse-badge`}>{b.badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bottom-row">
        <div className="chart-card">
          <div className="chart-header">
            <span className="chart-title">Books Read Per Month</span>
            <button className="filter-btn">This Year <i className="bi bi-chevron-down" style={{ fontSize: 10 }}></i></button>
          </div>
          <div className="chart-legend"><span><span className="leg-dot" style={{ background: "#4d0011" }}></span>Books Completed</span></div>
          <div style={{ position: "relative", height: 200 }}>
            <BarTrend
              labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"]}
              data={[1, 2, 1, 3, 2, 3, 2]}
              color="#4d0011"
            />
          </div>
        </div>

        <div className="cal-card">
          <div className="cal-header"><span className="cal-title">Quick Search</span></div>
          <div className="search-lib-wrap">
            <i className="bi bi-search" style={{ fontSize: 14 }}></i>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title, author, ISBN..."
              style={{ border: "none", outline: "none", background: "transparent", fontSize: 13, flex: 1, marginLeft: 6 }}
            />
          </div>
          <p style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5 }}>
            {search.trim()
              ? `Filtering "My Borrowed Books" below for "${search}". Clear the box to see everything again.`
              : "Browse the full catalogue to check availability and place a hold on a book that's currently issued to someone else."}
          </p>
          <button className="add-event" style={{ marginTop: 10 }} onClick={() => setShowCatalogue(true)}>
            <i className="bi bi-arrow-right-circle"></i> Open Full Catalogue
          </button>
        </div>
      </div>

      <div className="log-card">
        <div className="chart-header">
          <span className="chart-title">My Borrowed Books</span>
          <button className="filter-btn">All Time <i className="bi bi-chevron-down" style={{ fontSize: 10 }}></i></button>
        </div>

        <FilterChips options={FILTER_OPTIONS} active={filter} onChange={setFilter} />

        <table>
          <thead>
            <tr><th>Book Name</th><th>Book ID</th><th>Issue Date</th><th>Due Date</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={6} className="log-empty">No books match your search or filter.</td></tr>}
            {rows.map((b) => {
              const meta = STATUS_META[b.status];
              const originalIndex = books.indexOf(b);
              return (
                <tr key={b.Id}>
                  <td>
                    <div className="book-title-cell">
                      <div className="book-cover" style={{ background: b.color }}>{b.initial}</div>
                      <div>
                        <div className="book-title-text">{b.title}</div>
                        <div className="book-author">{b.author}</div>
                      </div>
                    </div>
                  </td>
                  <td>{b.Id}</td>
                  <td>{b.issue}</td>
                  <td>{b.due}</td>
                  <td><span className={`status-pill ${meta.cls}`}><i className={`bi ${meta.icon}`}></i> {meta.label}</span></td>
                  <td>
                    {b.status === "returned"
                      ? <button className="renew-btn" disabled><i className="bi bi-dash"></i> N/A</button>
                      : <button className="renew-btn" onClick={() => handleRenew(originalIndex)}><i className="bi bi-arrow-repeat"></i> Renew</button>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showHistory && <HistoryModal books={books} onClose={() => setShowHistory(false)} />}
      {showCatalogue && <CatalogueModal onClose={() => setShowCatalogue(false)} />}
    </div>
  );
}