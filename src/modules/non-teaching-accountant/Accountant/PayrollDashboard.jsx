import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import PageHeader from "./PageHeader";
import LiveClock from "./LiveClock";
import ExportButtons from "./ExportButtons";

const inr = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

/**
 * Generic payroll-style dashboard.
 *
 * rows: [{ id, name, meta, total, paid }]
 * idLabel / nameLabel / metaLabel: column headers
 * paidCountLabel: label for the "fully paid" stat tile
 * classFilterOptions: optional array of strings -> renders an extra class filter (student fee page)
 * getClass: optional fn(row) => class value, required if classFilterOptions given
 * extraColumn: optional { label, render(row, status) } -> extra action column (e.g. Notify / Send Msg)
 * showDesignationColumn: optional bool -> renders an extra read-only "designation" column from row.designation
 * designationLabel: optional string -> header label for the designation column
 * designationFilterOptions: optional array of strings -> renders a Designation filter dropdown (filters on row.designation)
 * sortable: optional bool -> renders a "Sort by Salary" control (Low to High / High to Low), sorting on row.total
 */
export default function PayrollDashboard({
  title,
  subtitle,
  rows,
  idLabel = "ID",
  nameLabel = "Name",
  metaLabel = "Details",
  paidCountLabel = "Paid",
  classFilterOptions,
  getClass,
  extraColumn,
  showDesignationColumn = false,
  designationLabel = "Designation",
  designationFilterOptions,
  sortable = false,
}) {
  const { showToast } = useOutletContext();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [designationFilter, setDesignationFilter] = useState("all");
  const [designationSort, setDesignationSort] = useState("none");
  const [salarySort, setSalarySort] = useState("none");
  const [modalRow, setModalRow] = useState(null);

  const computed = useMemo(
    () =>
      rows.map((r) => {
        const pending = Math.max(0, r.total - r.paid);
        const status = pending === 0 ? "Paid" : "Pending";
        return { ...r, pending, status };
      }),
    [rows]
  );

  const filtered = computed.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(search.trim().toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    const matchesClass = !classFilterOptions || classFilter === "all" || getClass(r) === classFilter;
    const matchesDesignation =
      !designationFilterOptions || designationFilter === "all" || r.designation === designationFilter;
    return matchesSearch && matchesStatus && matchesClass && matchesDesignation;
  });

  const sorted = useMemo(() => {
    let out = filtered;
    if (designationFilterOptions && designationSort !== "none") {
      out = [...out].sort((a, b) => {
        const cmp = (a.designation || "").localeCompare(b.designation || "");
        return designationSort === "asc" ? cmp : -cmp;
      });
    }
    if (sortable && salarySort !== "none") {
      out = [...out].sort((a, b) => (salarySort === "asc" ? a.total - b.total : b.total - a.total));
    }
    return out;
  }, [filtered, sortable, salarySort, designationFilterOptions, designationSort]);

  const paidCount = computed.filter((r) => r.status === "Paid").length;
  const pendingCount = computed.filter((r) => r.status === "Pending").length;
  const totalSalary = computed.reduce((sum, r) => sum + r.total, 0);

  const exportColumns = [
    { header: idLabel, key: "id" },
    { header: nameLabel, key: "name" },
    ...(showDesignationColumn ? [{ header: designationLabel, key: "designation" }] : []),
    { header: metaLabel, key: "meta" },
    { header: "Total", key: "totalLabel" },
    { header: "Paid", key: "paidLabel" },
    { header: "Pending", key: "pendingLabel" },
    { header: "Status", key: "status" },
  ];
  const exportRows = sorted.map((r) => ({
    ...r,
    totalLabel: inr(r.total),
    paidLabel: inr(r.paid),
    pendingLabel: inr(r.pending),
  }));

  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} />
      <LiveClock />

      <div className="row-cards">
        <div className="card stat-card">
          <div className="card-body">
            <h3 className="counter">{paidCount}</h3>
            <p>{paidCountLabel}</p>
          </div>
        </div>
        <div className="card stat-card">
          <div className="card-body">
            <h3 className="counter">{pendingCount}</h3>
            <p>Pending Payments</p>
          </div>
        </div>
        <div className="card stat-card">
          <div className="card-body">
            <h3 className="counter">{inr(totalSalary)}</h3>
            <p>Total Salary</p>
          </div>
        </div>
      </div>

      <div className="toolbar-row">
        <div className="filters-row">
          <input
            type="text"
            className="form-control"
            placeholder="Search Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="form-control" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>
          {classFilterOptions && (
            <select className="form-control" value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
              <option value="all">All Classes</option>
              {classFilterOptions.map((c) => (
                <option key={c} value={c}>Class {c}</option>
              ))}
            </select>
          )}
          {designationFilterOptions && (
            <select
              className="form-control designation-filter-chip"
              value={designationFilter}
              onChange={(e) => setDesignationFilter(e.target.value)}
            >
              <option value="all">All Designations</option>
              {designationFilterOptions.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          )}
          {designationFilterOptions && (
            <select
              className="form-control designation-filter-chip"
              value={designationSort}
              onChange={(e) => setDesignationSort(e.target.value)}
            >
              <option value="none">Sort by Designation</option>
              <option value="asc">Designation: A to Z</option>
              <option value="desc">Designation: Z to A</option>
            </select>
          )}
          {sortable && (
            <select className="form-control" value={salarySort} onChange={(e) => setSalarySort(e.target.value)}>
              <option value="none">Sort by Salary</option>
              <option value="asc">Salary: Low to High</option>
              <option value="desc">Salary: High to Low</option>
            </select>
          )}
        </div>
        <ExportButtons title={title} columns={exportColumns} rows={exportRows} filename={title?.toLowerCase().replace(/\s+/g, "-") || "report"} />
      </div>

      <div className="table-wrap">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>{idLabel}</th>
              <th>{nameLabel}</th>
              {showDesignationColumn && <th>{designationLabel}</th>}
              <th>{metaLabel}</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Pending</th>
              <th>Status</th>
              {extraColumn && <th>{extraColumn.label}</th>}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 && (
              <tr>
                <td colSpan={7 + (extraColumn ? 1 : 0) + (showDesignationColumn ? 1 : 0)} style={{ textAlign: "center", padding: 24, color: "var(--text-muted)" }}>
                  No records match your search/filter.
                </td>
              </tr>
            )}
            {sorted.map((r) => (
              <tr key={r.key || r.id}>
                <td>{r.id}</td>
                <td>{r.name}</td>
                {showDesignationColumn && <td>{r.designation}</td>}
                <td>{r.meta}</td>
                <td>{inr(r.total)}</td>
                <td>{inr(r.paid)}</td>
                <td>{inr(r.pending)}</td>
                <td>
                  <span
                    className={r.status === "Paid" ? "badge-paid" : "badge-pending"}
                    onClick={() => setModalRow(r)}
                  >
                    {r.status}
                  </span>
                </td>
                {extraColumn && (
                  <td>
                    {r.status === "Paid" ? (
                      <button className="btn btn-success btn-sm" disabled>Paid</button>
                    ) : (
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => showToast(`Reminder sent to ${r.name}`, "ti-bell")}
                      >
                        {extraColumn.actionLabel || "Notify"}
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalRow && (
        <div className="modal-overlay" onClick={() => setModalRow(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h5>{modalRow.name}</h5>
              <button onClick={() => setModalRow(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <p><b>{idLabel}:</b> {modalRow.id}</p>
              {showDesignationColumn && <p><b>{designationLabel}:</b> {modalRow.designation}</p>}
              <p><b>{metaLabel}:</b> {modalRow.meta}</p>
              <p><b>Total Salary:</b> {inr(modalRow.total)}</p>
              <p><b>Paid:</b> {inr(modalRow.paid)}</p>
              <p><b>Pending:</b> {inr(modalRow.pending)}</p>
              <p><b>Status:</b> {modalRow.status}</p>
            </div>
            <div className="modal-foot">
              <button className="btn btn-dark" onClick={() => setModalRow(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
