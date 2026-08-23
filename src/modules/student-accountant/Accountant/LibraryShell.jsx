import { NavLink } from "react-router-dom";
import PageHeader from "./PageHeader";

const libraryTabs = [
  { label: "Book Issue", icon: "bi bi-journal-plus", path: "/student-accountant/library/book-issue" },
  { label: "Book Return", icon: "bi bi-journal-check", path: "/student-accountant/library/book-return" },
  { label: "Fine Collection", icon: "bi bi-cash", path: "/student-accountant/library/fine-collection" },
  { label: "Clearance", icon: "bi bi-journal-x", path: "/student-accountant/library/clearance" },
];

export default function LibraryShell({ icon, title, count, children }) {
  return (
    <div>
      <PageHeader title="Library" subtitle="Book issues, returns, fines and clearance records" />

      <div className="tab-row">
        {libraryTabs.map((t) => (
          <NavLink
            key={t.path}
            to={t.path}
            className={({ isActive }) => `tab-btn ${isActive ? "active" : ""}`}
          >
            <i className={t.icon}></i> {t.label}
          </NavLink>
        ))}
      </div>

      <div className="lib-card">
        <div className="lib-card-head">
          <i className={icon}></i>
          <h4>{title}</h4>
          {typeof count === "number" && <span className="lib-count">{count}</span>}
        </div>
        {children}
      </div>

      <div className="lib-banner">
        <i className="bi bi-book-half"></i> A Reader Today, A Leader Tomorrow.
      </div>
    </div>
  );
}

export function LibAvatar({ initials, avatar }) {
  return (
    <span className="lib-avatar" style={{ background: avatar.bg, color: avatar.fg }}>
      {initials}
    </span>
  );
}
