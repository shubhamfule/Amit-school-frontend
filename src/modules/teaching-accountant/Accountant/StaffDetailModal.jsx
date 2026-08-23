import { useMemo, useState } from "react";
import { experienceFor, formatDDMMYYYY } from "./salaryData";
import { loadAllAttendance, monthSummaryFor } from "./attendanceStore";

const inr = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function initialsOf(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

function dayNameFor(isoDate) {
  const d = new Date(`${isoDate}T00:00:00`);
  return d.toLocaleDateString("en-IN", { weekday: "long" });
}

function dayShortLabel(isoDate) {
  const d = new Date(`${isoDate}T00:00:00`);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

// "Anita Desai — Attendance & Salary" style detail modal, reused wherever a
// teaching staff card offers "View attendance & salary" (Staff Directory
// today; any future entry point can reuse it too, reading from the same
// attendance store the Attendance Management page writes to).
export default function StaffDetailModal({ staff, onClose }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const allAttendance = loadAllAttendance();

  const summary = useMemo(
    () => monthSummaryFor(allAttendance, staff.key, year, month),
    [allAttendance, staff.key, year, month]
  );

  const dailySalary = staff.salary > 0 ? staff.salary / 30 : 0;
  const deducted = Math.round(dailySalary * summary.absent);
  const payable = Math.max(0, staff.salary - deducted);

  const yearOptions = [now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1];

  if (!staff) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box modal-box-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h5><i className="bi bi-person-badge"></i> {staff.name} — Attendance &amp; Salary</h5>
          <button onClick={onClose} aria-label="Close">&times;</button>
        </div>

        <div className="modal-body">
          <div className="staff-modal-identity">
            <span className="staff-avatar-circle">{initialsOf(staff.name)}</span>
            <div>
              <div className="staff-modal-name">{staff.name}</div>
              <div className="staff-modal-role">Teaching Staff</div>
            </div>
          </div>

          <div className="staff-modal-box">
            <h6>Staff Details</h6>
            <div className="staff-modal-detail-grid">
              <div><span className="detail-label">Staff ID</span><span className="detail-value">{staff.id}</span></div>
              <div><span className="detail-label">Full Name</span><span className="detail-value">{staff.name}</span></div>
              <div><span className="detail-label">Mobile Number</span><span className="detail-value">{staff.mobile}</span></div>
              <div><span className="detail-label">Date of Joining</span><span className="detail-value">{formatDDMMYYYY(staff.joiningDate)}</span></div>
              <div><span className="detail-label">Experience</span><span className="detail-value">{experienceFor(staff.joiningDate)}</span></div>
              <div><span className="detail-label">Academic Year</span><span className="detail-value">{staff.academicYear}</span></div>
              <div><span className="detail-label">Monthly Salary</span><span className="detail-value">{inr(staff.salary)}</span></div>
              <div><span className="detail-label">Designation</span><span className="detail-value">{staff.designation} · {staff.meta}</span></div>
            </div>
          </div>

          <h6 className="staff-modal-section-title">Attendance &amp; Salary</h6>
          <div className="staff-modal-period-row">
            <select className="form-control" value={year} onChange={(e) => setYear(Number(e.target.value))}>
              {yearOptions.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <select className="form-control" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
              {MONTH_NAMES.map((m, i) => (
                <option key={m} value={i + 1}>{m}</option>
              ))}
            </select>
          </div>

          <div className="staff-modal-stats-row">
            <div className="staff-modal-stat">
              <span className="stat-num">{summary.workingDays}</span>
              <span className="stat-label">Working Days</span>
            </div>
            <div className="staff-modal-stat stat-present">
              <span className="stat-num">{summary.present}</span>
              <span className="stat-label">Present</span>
            </div>
            <div className="staff-modal-stat stat-absent">
              <span className="stat-num">{summary.absent}</span>
              <span className="stat-label">Absent</span>
            </div>
            <div className="staff-modal-stat">
              <span className="stat-num">{summary.attendancePct}%</span>
              <span className="stat-label">Attendance</span>
            </div>
          </div>

          <div className="staff-modal-box staff-modal-salary-box">
            <div className="staff-modal-detail-grid">
              <div><span className="detail-label">Monthly Salary</span><span className="detail-value">{inr(staff.salary)}</span></div>
              <div><span className="detail-label">Daily Salary</span><span className="detail-value">{inr(Math.round(dailySalary))}</span></div>
              <div><span className="detail-label">Payable Salary</span><span className="detail-value">{inr(payable)}</span></div>
              <div><span className="detail-label">Deducted (Absences)</span><span className="detail-value">{inr(deducted)}</span></div>
            </div>
          </div>

          <div className="staff-modal-history-wrap">
            <div className="staff-modal-history-head">
              <span>DATE</span><span>DAY</span><span>ATTENDANCE</span>
            </div>
            <div className="staff-modal-history-list">
              {summary.days.length === 0 && (
                <div className="widget-empty">No attendance recorded yet for {MONTH_NAMES[month - 1]} {year}.</div>
              )}
              {summary.days.map((d) => (
                <div className="staff-modal-history-row" key={d.date}>
                  <span>{dayShortLabel(d.date)}</span>
                  <span>{dayNameFor(d.date)}</span>
                  <span className={`status-badge ${d.status === "Present" ? "active" : d.status === "Absent" ? "leave" : "status-upcoming"}`}>
                    {d.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-foot">
          <button className="btn btn-dark" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
