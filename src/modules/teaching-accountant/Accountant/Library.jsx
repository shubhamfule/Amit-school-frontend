import { NavLink } from "react-router-dom";
import PageHeader from "./PageHeader";
import {
  bookIssueRecords,
  bookReturnRecords,
  fineCollectionRecords,
  libraryClearanceRecords,
} from "./libraryData";

const sectionTabs = [
  { key: "issue", label: "Book Issue", icon: "bi bi-journal-plus", path: "/teaching-accountant/library/book-issue" },
  { key: "return", label: "Book Return", icon: "bi bi-journal-check", path: "/teaching-accountant/library/book-return" },
  { key: "fine", label: "Fine Collection", icon: "bi bi-cash-coin", path: "/teaching-accountant/library/fine-collection" },
  { key: "clearance", label: "Clearance", icon: "bi bi-clipboard2-check", path: "/teaching-accountant/library/clearance" },
];

const avatarPalette = ["lib-avatar-amber", "lib-avatar-blue", "lib-avatar-green", "lib-avatar-pink"];

function initialsOf(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

function formatDateLabel(iso) {
  if (!iso) return "-";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function inr(n) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

function statusPillClass(status) {
  switch (status) {
    case "Issued":
      return "lib-status-issued";
    case "Overdue":
      return "lib-status-overdue";
    case "Returned":
    case "Cleared":
    case "Paid":
      return "lib-status-good";
    case "Pending":
    default:
      return "lib-status-pending";
  }
}

function NameCell({ name, index }) {
  return (
    <div className="lib-name-cell">
      <span className={`lib-avatar ${avatarPalette[index % avatarPalette.length]}`}>
        {initialsOf(name)}
      </span>
      <span>{name}</span>
    </div>
  );
}

function StatusPill({ status }) {
  return <span className={`lib-status-pill ${statusPillClass(status)}`}>{status}</span>;
}

const sectionMeta = {
  issue: {
    icon: "bi bi-journal-plus",
    title: "Book issue records",
    rows: bookIssueRecords,
  },
  return: {
    icon: "bi bi-journal-check",
    title: "Book return records",
    rows: bookReturnRecords,
  },
  fine: {
    icon: "bi bi-cash-coin",
    title: "Fine collection records",
    rows: fineCollectionRecords,
  },
  clearance: {
    icon: "bi bi-clipboard2-check",
    title: "Library clearance records",
    rows: libraryClearanceRecords,
  },
};

export default function Library({ section = "issue" }) {
  const meta = sectionMeta[section] || sectionMeta.issue;

  return (
    <div>
      <PageHeader title="Library" subtitle="Book issues, returns, fines and clearance records" />

      <div className="lib-tab-row">
        {sectionTabs.map((t) => (
          <NavLink
            key={t.key}
            to={t.path}
            className={({ isActive }) => `lib-tab-btn ${isActive ? "active" : ""}`}
          >
            <i className={t.icon}></i>
            {t.label}
          </NavLink>
        ))}
      </div>

      <div className="lib-panel">
        <div className="lib-panel-head">
          <div className="lib-panel-head-left">
            <i className={meta.icon}></i>
            <h4>{meta.title}</h4>
          </div>
          <span className="lib-count-badge">{meta.rows.length}</span>
        </div>

        <div className="table-wrap lib-table-wrap">
          {section === "issue" && (
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>User Type</th>
                  <th>Book ID</th>
                  <th>Book Name</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookIssueRecords.map((r, i) => (
                  <tr key={r.id}>
                    <td><strong>{r.id}</strong></td>
                    <td><NameCell name={r.name} index={i} /></td>
                    <td>{r.userType}</td>
                    <td>{r.bookId}</td>
                    <td>{r.bookName}</td>
                    <td>{formatDateLabel(r.issueDate)}</td>
                    <td>{formatDateLabel(r.dueDate)}</td>
                    <td><StatusPill status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {section === "return" && (
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>User Type</th>
                  <th>Book ID</th>
                  <th>Book Name</th>
                  <th>Issue Date</th>
                  <th>Return Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookReturnRecords.map((r, i) => (
                  <tr key={r.id}>
                    <td><strong>{r.id}</strong></td>
                    <td><NameCell name={r.name} index={i} /></td>
                    <td>{r.userType}</td>
                    <td>{r.bookId}</td>
                    <td>{r.bookName}</td>
                    <td>{formatDateLabel(r.issueDate)}</td>
                    <td>{formatDateLabel(r.returnDate)}</td>
                    <td><StatusPill status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {section === "fine" && (
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>User Type</th>
                  <th>Book ID</th>
                  <th>Book Name</th>
                  <th>Fine Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {fineCollectionRecords.map((r, i) => (
                  <tr key={r.id}>
                    <td><strong>{r.id}</strong></td>
                    <td><NameCell name={r.name} index={i} /></td>
                    <td>{r.userType}</td>
                    <td>{r.bookId}</td>
                    <td>{r.bookName}</td>
                    <td>{inr(r.fineAmount)}</td>
                    <td><StatusPill status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {section === "clearance" && (
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>User Type</th>
                  <th>Books Issued</th>
                  <th>Pending Fine</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {libraryClearanceRecords.map((r, i) => (
                  <tr key={r.id}>
                    <td><strong>{r.id}</strong></td>
                    <td><NameCell name={r.name} index={i} /></td>
                    <td>{r.userType}</td>
                    <td>{r.booksIssued}</td>
                    <td>{inr(r.pendingFine)}</td>
                    <td><StatusPill status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="lib-quote-bar">
        <i className="bi bi-book-half"></i>
        A Reader Today, A Leader Tomorrow.
      </div>
    </div>
  );
}
