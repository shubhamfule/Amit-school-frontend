import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { navConfig } from "./navConfig";

function pathIsActive(path, pathname) {
  if (path === "/") return pathname === "/";
  return pathname.startsWith(path);
}

function containsActivePath(item, pathname) {
  if (item.path) return pathIsActive(item.path, pathname);
  if (item.children) return item.children.some((c) => containsActivePath(c, pathname));
  return false;
}

function SubLink({ item, pathname, level }) {
  const [open, setOpen] = useState(containsActivePath(item, pathname));

  useEffect(() => {
    if (containsActivePath(item, pathname)) setOpen(true);
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  if (item.children) {
    const active = containsActivePath(item, pathname);
    return (
      <li>
        <div
          className={`sub-link has-children nav-toggle ${open ? "open" : ""}`}
          onClick={() => setOpen((o) => !o)}
        >
          <span>
            <i className={item.icon}></i>
            {item.label}
          </span>
          <i className={`ti ti-chevron-right nav-chevron ${open ? "open" : ""}`}
             style={{ transform: open ? "rotate(90deg)" : "none" }}></i>
        </div>
        <ul className={`nav-submenu-3 ${open ? "open" : ""}`}>
          {item.children.map((c) => (
            <li key={c.path}>
              <NavLink
                to={c.path}
                className={({ isActive }) => `sub-link-3 ${isActive ? "active-link" : ""}`}
              >
                <i className={c.icon}></i>
                {c.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </li>
    );
  }

  return (
    <li>
      <NavLink
        to={item.path}
        className={({ isActive }) => `sub-link ${isActive ? "active-link" : ""}`}
      >
        <i className={item.icon}></i>
        {item.label}
      </NavLink>
    </li>
  );
}

export default function Sidebar({ collapsed, onToggleCollapse, mobileOpen, onCloseMobile }) {
  const { pathname } = useLocation();

  return (
    <>
      <div className={`sidebar-overlay ${mobileOpen ? "show" : ""}`} onClick={onCloseMobile}></div>

      <aside className={`sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>
        <button className="sidebar-toggle" onClick={onToggleCollapse} title="Collapse sidebar">
          <i className={`ti ${collapsed ? "ti-chevron-right" : "ti-chevron-left"}`}></i>
        </button>

        <div className="sidebar-brand">
          <div className="brand-logo">
            <div className="brand-icon"><i className="bi bi-bank"></i></div>
            <div className="brand-text">
              <div className="brand-text-name">Teaching Accountant</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Main Menu</div>

          {navConfig.map((item) => {
            if (item.path) {
              return (
                <NavLink
                  key={item.key}
                  to={item.path}
                  end
                  className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
                >
                  <i className={`${item.icon} nav-icon`}></i>
                  <span className="nav-label-text">{item.label}</span>
                </NavLink>
              );
            }

            return <TopMenu key={item.key} item={item} pathname={pathname} />;
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="help-box">
            <i className="ti ti-help-circle"></i>
            <p>Need help with SMS?</p>
            <button className="help-btn" onClick={() => alert("Opening help center…")}>Go to help center</button>
          </div>
          <NavLink to="/teaching-accountant" className="logout-btn">
            <i className="bi bi-box-arrow-right"></i>
            Log Out
          </NavLink>
          <p className="sidebar-copy">©2026 All rights reserved</p>
        </div>
      </aside>
    </>
  );
}

function TopMenu({ item, pathname }) {
  const [open, setOpen] = useState(containsActivePath(item, pathname));

  useEffect(() => {
    if (containsActivePath(item, pathname)) setOpen(true);
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const active = containsActivePath(item, pathname);

  return (
    <div>
      <div
        className={`nav-item nav-toggle ${open ? "open" : ""} ${active ? "active" : ""}`}
        onClick={() => setOpen((o) => !o)}
      >
        <i className={`${item.icon} nav-icon`}></i>
        <span className="nav-label-text">{item.label}</span>
        <i className="ti ti-chevron-right nav-chevron" style={{ transform: open ? "rotate(90deg)" : "none" }}></i>
      </div>
      <ul className={`nav-submenu ${open ? "open" : ""}`}>
        {item.children.map((c) => (
          <SubLink key={c.path || c.label} item={c} pathname={pathname} level={2} />
        ))}
      </ul>
    </div>
  );
}
