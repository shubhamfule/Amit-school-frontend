import { useMemo, useState } from "react";
import PageHeader from "./PageHeader";
import LiveClock from "./LiveClock";
import StaffDetailModal from "./StaffDetailModal";
import { teacherRows } from "./salaryData";

const inr = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

function initialsOf(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

// Teaching Staff directory — one card per staff member (mirrors the
// Teachers page card layout), each with a "View attendance & salary" button
// that opens the full profile + monthly attendance/salary modal, reading the
// same already-entered staff data used across the Accounts module.
export default function StaffDirectory() {
  const [search, setSearch] = useState("");
  const [designationFilter, setDesignationFilter] = useState("all");
  const [activeStaff, setActiveStaff] = useState(null);

  const designationOptions = useMemo(
    () => [...new Set(teacherRows.map((r) => r.designation))].sort(),
    []
  );

  const totalPayable = teacherRows.reduce((sum, r) => sum + r.salary, 0);
  const totalPending = teacherRows.reduce((sum, r) => sum + Math.max(0, r.salary - r.paid), 0);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return teacherRows.filter((r) => {
      const matchesSearch =
        !q || r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || r.mobile.includes(q);
      const matchesDesignation = designationFilter === "all" || r.designation === designationFilter;
      return matchesSearch && matchesDesignation;
    });
  }, [search, designationFilter]);

  return (
    <div>
      <PageHeader title="Teaching Staff" subtitle="Manage teaching staff, attendance and salary" />
      <LiveClock />

      <div className="row-cards">
        <div className="card stat-card">
          <div className="card-body">
            <h3 className="counter">{teacherRows.length}</h3>
            <p>Total teaching staff</p>
          </div>
        </div>
        <div className="card stat-card">
          <div className="card-body">
            <h3 className="counter">{inr(totalPayable)}</h3>
            <p>Monthly payable salary</p>
          </div>
        </div>
        <div className="card stat-card">
          <div className="card-body">
            <h3 className="counter">{inr(totalPending)}</h3>
            <p>Pending salary</p>
          </div>
        </div>
      </div>

      <div className="toolbar-row">
        <div className="filters-row">
          <input
            type="text"
            className="form-control"
            placeholder="Search by ID, name or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="form-control" value={designationFilter} onChange={(e) => setDesignationFilter(e.target.value)}>
            <option value="all">All Designations</option>
            {designationOptions.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="staff-directory-grid">
        {filtered.map((s) => (
          <div className="staff-directory-card" key={s.key}>
            <span className="staff-avatar-circle">{initialsOf(s.name)}</span>
            <div className="staff-directory-name">{s.name}</div>
            <div className="staff-directory-meta">{s.id} · {s.designation}</div>
            <button type="button" className="staff-directory-btn" onClick={() => setActiveStaff(s)}>
              <i className="bi bi-clipboard2-pulse"></i> View attendance &amp; salary
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="widget-empty" style={{ gridColumn: "1 / -1" }}>No staff match your search.</div>
        )}
      </div>

      {activeStaff && <StaffDetailModal staff={activeStaff} onClose={() => setActiveStaff(null)} />}
    </div>
  );
}
