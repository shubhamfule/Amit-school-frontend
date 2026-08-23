import { useMemo, useState } from "react";
import PageHeader from "./PageHeader";
import StatCard from "./StatCard";
import { leaveApplications } from "./directoryData";

const tabs = ["All", "Approved", "Pending", "Rejected"];

function formatDateLabel(iso) {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function calcLeaveDays(fromISO, toISO) {
  const start = new Date(`${fromISO}T00:00:00`);
  const end = new Date(`${toISO}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "-";
  const diff = Math.round((end - start) / 86400000) + 1;
  return diff > 0 ? diff : 1;
}

function statusClass(status) {
  if (status === "Approved") return "approved";
  if (status === "Rejected") return "rejected";
  return "pending";
}

// Leave applications submitted by Teaching staff only — kept separate
// from the Teacher Module's Leave Applications section.
export default function LeaveApplications() {
  const [tab, setTab] = useState("All");

  const rows = useMemo(
    () => (tab === "All" ? leaveApplications : leaveApplications.filter((l) => l.status === tab)),
    [tab]
  );

  const counts = useMemo(
    () => ({
      total: leaveApplications.length,
      approved: leaveApplications.filter((l) => l.status === "Approved").length,
      pending: leaveApplications.filter((l) => l.status === "Pending").length,
      rejected: leaveApplications.filter((l) => l.status === "Rejected").length,
    }),
    []
  );

  return (
    <div>
      <PageHeader title="Leave Applications" subtitle="Leave requests submitted by Teaching staff" />

      <div className="row-cards">
        <StatCard label="Total Applications" value={counts.total} isCurrency={false} />
        <StatCard label="Approved" value={counts.approved} isCurrency={false} />
        <StatCard label="Pending" value={counts.pending} isCurrency={false} />
        <StatCard label="Rejected" value={counts.rejected} isCurrency={false} />
      </div>

      <div className="tab-row">
        {tabs.map((t) => (
          <button
            key={t}
            className={`tab-btn ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="table-wrap">
        <table className="table table-hover leave-apps-table">
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
            {rows.map((l) => (
              <tr key={l.id}>
                <td>{l.employeeId}</td>
                <td>{l.employeeName}</td>
                <td>
                  <span className="leave-apps-reason" title={l.reason}>{l.reason}</span>
                </td>
                <td>{formatDateLabel(l.from)}</td>
                <td>{formatDateLabel(l.to)}</td>
                <td>{calcLeaveDays(l.from, l.to)}</td>
                <td>
                  <span className={`status-badge ${statusClass(l.status)}`}>{l.status}</span>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="widget-empty">No leave applications in this category.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
