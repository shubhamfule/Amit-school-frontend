import { useEffect, useMemo, useState } from "react";
import PageHeader from "./PageHeader";
import { apiGet } from "../../teacher/utils/api";

const tabs = ["All", "Approved", "Pending", "Rejected"];

const statusClass = {
  Approved: "active",
  Pending: "pending",
  Rejected: "leave",
};

function formatLabel(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function withDays(row) {
  const start = new Date(row.from);
  const end = new Date(row.to);
  const days = Math.max(1, Math.round((end - start) / 86400000) + 1);
  return { ...row, days };
}

export default function LeaveApplications() {
  const [staffType, setStaffType] = useState("teaching");
  const [tab, setTab] = useState("All");
  const [teachingLeaves, setTeachingLeaves] = useState([]);
  const [nonTeachingLeaves, setNonTeachingLeaves] = useState([]);

  useEffect(() => {
    let cancelled = false;
    apiGet("/leave")
      .then((res) => {
        if (cancelled) return;
        const accountantRows = (res.data ?? []).filter((r) => r.employeeId || r.employeeName);
        const mapped = accountantRows.map((r) =>
          withDays({
            staffId: r.employeeId || r._id,
            name: r.employeeName,
            reason: r.reason,
            from: r.from,
            to: r.to,
            startLabel: formatLabel(r.from),
            endLabel: formatLabel(r.to),
            status: r.status,
            staffType: r.staffType,
          })
        );
        setTeachingLeaves(mapped.filter((r) => r.staffType !== "other"));
        setNonTeachingLeaves(mapped.filter((r) => r.staffType === "other"));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const rows = staffType === "teaching" ? teachingLeaves : nonTeachingLeaves;

  const filtered = useMemo(
    () => (tab === "All" ? rows : rows.filter((r) => r.status === tab)),
    [rows, tab]
  );

  const totalCount = rows.length;
  const approvedCount = rows.filter((r) => r.status === "Approved").length;
  const pendingCount = rows.filter((r) => r.status === "Pending").length;
  const rejectedCount = rows.filter((r) => r.status === "Rejected").length;

  return (
    <div>
      <div className="toolbar-row">
        <PageHeader
          title="Leave Applications"
          subtitle={`Leave requests submitted by ${staffType === "teaching" ? "Teaching" : "Non-Teaching"} staff`}
        />
        <select
          className="form-control attn-type-select"
          value={staffType}
          onChange={(e) => {
            setStaffType(e.target.value);
            setTab("All");
          }}
        >
          <option value="teaching">Teaching Staff</option>
          <option value="non-teaching">Non-Teaching Staff</option>
        </select>
      </div>

      <div className="row-cards">
        <div className="card stat-card">
          <div className="card-body"><h3 className="counter">{totalCount}</h3><p>Total Applications</p></div>
        </div>
        <div className="card stat-card">
          <div className="card-body"><h3 className="counter">{approvedCount}</h3><p>Approved</p></div>
        </div>
        <div className="card stat-card">
          <div className="card-body"><h3 className="counter">{pendingCount}</h3><p>Pending</p></div>
        </div>
        <div className="card stat-card">
          <div className="card-body"><h3 className="counter">{rejectedCount}</h3><p>Rejected</p></div>
        </div>
      </div>

      <div className="tab-row">
        {tabs.map((t) => (
          <button key={t} className={`tab-btn ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>

      <div className="table-wrap">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Staff ID</th>
              <th>Name</th>
              <th>Leave Reason</th>
              <th>Leave Start Date</th>
              <th>Leave End Date</th>
              <th>Total Leave Days</th>
              <th>Leave Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: 24, color: "var(--text-muted)" }}>
                  No leave applications in this category.
                </td>
              </tr>
            )}
            {filtered.map((r) => (
              <tr key={r.staffId + r.from}>
                <td>{r.staffId}</td>
                <td>{r.name}</td>
                <td>{r.reason}</td>
                <td>{r.startLabel}</td>
                <td>{r.endLabel}</td>
                <td>{r.days}</td>
                <td>
                  <span className={`status-badge ${statusClass[r.status]}`}>{r.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
