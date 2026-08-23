import { useMemo, useState } from "react";
import { studentFeeRows } from "./salaryData";
import { students } from "./directoryData";
import LiveClock from "./LiveClock";

const inr = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

export default function StudentFeeCollection() {
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All Classes");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sentMessage, setSentMessage] = useState(null);
  const [notifiedRows, setNotifiedRows] = useState(() => new Set());

  const stats = useMemo(() => {
    const totalIncome = studentFeeRows.reduce((sum, row) => sum + Number(row.paid || 0), 0);
    const pending = studentFeeRows.reduce((sum, row) => sum + Math.max(0, Number(row.total || 0) - Number(row.paid || 0)), 0);
    return { totalIncome, pending };
  }, []);

  const classOptions = useMemo(() => [
    "All Classes",
    ...Array.from(new Set(studentFeeRows.map((row) => row.cls).filter(Boolean))),
  ], []);

  const studentLookup = useMemo(() => {
    return new Map(students.map((student) => [student.roll.replace(/^R-/, ""), student]));
  }, []);

  const notifyStudent = (row) => {
    const pending = Math.max(0, Number(row.total || 0) - Number(row.paid || 0));
    // Notifications are only available for students with pending fees.
    if (pending <= 0) return;
    const recipient = studentLookup.get(String(row.roll));
    const messageText = `Dear Parent/Guardian of ${row.name}, your student fee pending amount is ${inr(pending)}. Please clear the pending fee at the earliest. - Amit Group of Schools`;

    // Clicking Notify immediately sends the in-app notification without requiring another button.
    setNotifiedRows((previous) => {
      const next = new Set(previous);
      next.add(row.roll);
      return next;
    });
    const sentTime = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    setSentMessage({
      name: row.name,
      time: sentTime,
      phone: recipient?.contact || "Parent/Guardian",
      message: messageText,
    });
    window.alert(`Message sent to ${row.name}:\n\n${messageText}`);
  };

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return studentFeeRows.filter((row) => {
      const text = [row.roll, row.name, row.cls].filter(Boolean).join(" ").toLowerCase();
      const status = Number(row.paid || 0) >= Number(row.total || 0) ? "Paid" : "Pending";
      return (!q || text.includes(q))
        && (classFilter === "All Classes" || row.cls === classFilter)
        && (statusFilter === "All Status" || status === statusFilter);
    });
  }, [search, classFilter, statusFilter]);

  return (
    <div className="fee-collection-page">
      <div className="fee-page-title">
        <h1>Student Accountant Dashboard</h1>
        <p>Amit Group of Schools | Student fee overview</p>
      </div>

      <LiveClock />

      <div className="fee-summary-grid">
        <div className="fee-summary-card">
          <strong>{inr(stats.totalIncome)}</strong>
          <span>Total Fee Income</span>
        </div>
        <div className="fee-summary-card">
          <strong>{inr(stats.totalIncome)}</strong>
          <span>Fee Collection</span>
        </div>
        <div className="fee-summary-card">
          <strong>{inr(stats.pending)}</strong>
          <span>Pending Fees</span>
        </div>
      </div>

      <section className="fee-data-section">
        <div className="fee-data-head">
          <div>
            <h2>Student Fee Collection</h2>
            <p>All existing fee records are retained below.</p>
          </div>
        </div>

        <div className="fee-data-filters">
          <div className="fee-data-search">
            <i className="bi bi-search"></i>
            <input
              className="form-control"
              placeholder="Search by roll no., student name or class..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="form-control" value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
            {classOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
          <select className="form-control" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option>All Status</option>
            <option>Paid</option>
            <option>Pending</option>
          </select>
        </div>

        <div className="fee-table-wrap">
          <table className="fee-table">
            <thead>
              <tr>
                <th>Roll No.</th>
                <th>Student Name</th>
                <th>Class</th>
                <th>Total Fee</th>
                <th>Paid</th>
                <th>Pending</th>
                <th>Status</th>
                <th>Notify</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => {
                const pending = Math.max(0, Number(row.total || 0) - Number(row.paid || 0));
                const status = pending === 0 ? "Paid" : "Pending";
                return (
                  <tr key={`${row.roll}-${row.name}`}>
                    <td>{row.roll}</td>
                    <td className="fee-student-name">{row.name}</td>
                    <td>{row.cls}</td>
                    <td>{inr(row.total)}</td>
                    <td>{inr(row.paid)}</td>
                    <td>{inr(pending)}</td>
                    <td><span className={`fee-status ${status.toLowerCase()}`}>{status}</span></td>
                    <td>
                      <button
                        type="button"
                        className={`fee-notify-btn ${status === "Paid" ? "disabled" : ""}`}
                        onClick={() => notifyStudent(row)}
                        disabled={status === "Paid"}
                        title={status === "Paid" ? "No notification needed because the fee is fully paid" : "Send fee payment reminder"}
                      >
                        <i className={`bi ${status === "Paid" ? "bi-check-circle" : (notifiedRows.has(row.roll) ? "bi-check-circle" : "bi-bell")}`}></i> {status === "Paid" ? "Paid" : (notifiedRows.has(row.roll) ? "Sent" : "Notify")}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredRows.length === 0 && (
                <tr>
                  <td colSpan="8" className="fee-empty">No fee records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {sentMessage && (
          <section className="fee-message-section" id="fee-message-box">
            <div className="fee-message-head">
              <div>
                <h3><i className="bi bi-chat-dots"></i> Message Sent</h3>
                <p>The notification was sent immediately when Notify was clicked.</p>
              </div>
              <span className="fee-message-sent"><i className="bi bi-check-circle"></i> Sent to {sentMessage.name} at {sentMessage.time}</span>
            </div>
          </section>
        )}
      </section>
    </div>
  );
}
