import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/student/dashboard", icon: "bi-speedometer2", label: "Dashboard" },
  { to: "/student/dashboard/profile", icon: "bi-person-circle", label: "Profile" },
  { to: "/student/dashboard/parent-info", icon: "bi-people-fill", label: "Parents Info" },
  { to: "/student/dashboard/fees", icon: "bi-cash-stack", label: "Fees Payment" },
  { to: "/student/dashboard/attendance", icon: "bi-calendar-check", label: "Attendance" },
  { to: "/student/dashboard/notice", icon: "bi-megaphone-fill", label: "Notice" },
  { to: "/student/dashboard/result", icon: "bi-bar-chart-fill", label: "Result" },
  { to: "/student/dashboard/exam", icon: "bi-journal-text", label: "Exam" },
  { to: "/student/dashboard/library", icon: "bi-book-fill", label: "Library" },
  { to: "/student/dashboard/certificate", icon: "bi-award-fill", label: "Certificate" },
  { to: "/student/dashboard/events", icon: "bi-calendar-event-fill", label: "Events" },
  { to: "/student/dashboard/leave", icon: "bi-envelope-paper-fill", label: "Leave Application" }
];

export default function Layout() {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  function toggleDarkMode() {
    setDarkMode((prev) => {
      const next = !prev;
      document.body.classList.toggle("dark-mode", next);
      return next;
    });
  }

  function handleLogout() {
    setSidebarOpen(false);
    navigate("/student/logout");
  }

  return (
    <div className="layout">
      <button
        className="sidebar-overlay"
        aria-label="Close navigation menu"
        onClick={() => setSidebarOpen(false)}
        hidden={!sidebarOpen}
      ></button>

      <aside className={`sidebar${sidebarOpen ? " open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-icon"><i className="bi bi-mortarboard-fill"></i></div>
          <div className="brand-text">
            <div className="name">Amit School</div>
            <div className="sub">Student Dashboard</div>
          </div>
        </div>

        <div className="nav-label">Main Menu</div>

        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/dashboard"}
            className={({ isActive }) => "profile-btn" + (isActive ? " active" : "")}
            onClick={() => setSidebarOpen(false)}
          >
            <i className={`bi ${item.icon}`}></i> {item.label}
          </NavLink>
        ))}

        <div style={{ flex: 1 }}></div>

        <div className="sidebar-help">
          <i className="bi bi-question-circle"></i>
          Need help with Edu-Care?
          <button className="help-btn">Go to help center</button>
        </div>
        <button className="profile-btn logout" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right"></i> Logout
        </button>
        <div className="sidebar-copy">©2024 All rights reserved</div>
      </aside>

      <div className="main">
        <div className="topbar">
          <button
            className="mobile-menu-btn"
            aria-label={sidebarOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={sidebarOpen}
            onClick={() => setSidebarOpen((prev) => !prev)}
          >
            <i className={`bi ${sidebarOpen ? "bi-x-lg" : "bi-list"}`}></i>
          </button>
          <div className="topbar-actions">
            <div className="icon-btn"><i className="bi bi-bell"></i></div>
            <div className="icon-btn"><i className="bi bi-chat-dots"></i></div>
            <button className="icon-btn" onClick={toggleDarkMode}>
              <i className={`bi ${darkMode ? "bi-sun-fill" : "bi-moon-fill"}`}></i>
            </button>
            <div className="avatar-wrap">
              <div className="avatar">MR</div>
              <div className="avatar-info">
                <div className="uname">Mr. Sham</div>
                <div className="urole">Student</div>
              </div>
              <i className="bi bi-chevron-down" style={{ fontSize: 11, color: "#9090a8" }}></i>
            </div>
            <div className="icon-btn" onClick={handleLogout} style={{ cursor: "pointer" }}>
              <i className="bi bi-box-arrow-right"></i>
            </div>
          </div>
        </div>

        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
