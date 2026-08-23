import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/admin/dashboard', icon: 'ti-layout-dashboard', label: 'Dashboard' },
  { to: '/admin/students', icon: 'ti-users', label: 'Students' },
  {
    key: 'teachers',
    icon: 'ti-user-check',
    label: 'Teachers',
    base: '/teachers',
    children: [
      { to: '/admin/teachers/teaching', icon: 'ti-user-check', label: 'Teacher' },
      { to: '/admin/teachers/non-teaching', icon: 'ti-users', label: 'Non-Teaching' },
      { to: '/admin/teachers/leave', icon: 'ti-calendar-off', label: 'Leave Applications' },
    ],
  },
  { to: '/admin/events', icon: 'ti-calendar-event', label: 'Events' },
  { to: '/admin/library', icon: 'ti-books', label: 'Library' },
  {
    key: 'finance',
    icon: 'ti-report-money',
    label: 'Finance',
    base: '/finance',
    children: [
      { to: '/admin/finance/overview', icon: 'ti-layout-dashboard', label: 'Finance Dashboard' },
      { to: '/admin/finance/students', icon: 'ti-cash', label: 'Student Fees' },
      { to: '/admin/finance/teachers', icon: 'ti-user-check', label: 'Teacher Salary' },
      { to: '/admin/finance/nonteaching', icon: 'ti-users', label: 'Non-Teaching Staff' },
      { to: '/admin/finance/expenses', icon: 'ti-receipt', label: 'School Expenses' },
      { to: '/admin/finance/reports', icon: 'ti-chart-bar', label: 'Reports' },
    ],
  },
  { to: '/admin/notices', icon: 'ti-speakerphone', label: 'Notices' },
  { to: '/admin/settings', icon: 'ti-settings', label: 'Settings' },
];

export default function Sidebar({ collapsed, onToggle, mobileOpen, onCloseMobile }) {
  const location = useLocation();
  const activeGroup = NAV_ITEMS.find((item) => item.base && location.pathname.startsWith(item.base));
  const [openMenu, setOpenMenu] = useState(activeGroup ? activeGroup.key : null);

  // Keep whichever group (Teachers, Finance, …) expanded while one of its routes is active
  useEffect(() => {
    if (activeGroup) {
      setOpenMenu(activeGroup.key);
    }
  }, [location.pathname]);

  const toggleMenu = (key) => {
    setOpenMenu((prev) => (prev === key ? null : key));
  };

  return (
    <>
      <div className={`sidebar-overlay ${mobileOpen ? 'show' : ''}`} onClick={onCloseMobile} />
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <button className="sidebar-toggle" onClick={onToggle} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          <i className="ti ti-chevron-left"></i>
        </button>

        <div className="sidebar-brand">
          <div className="brand-logo">
            <div className="brand-icon"><i className="ti ti-school"></i></div>
            <div className="brand-text">
              <div className="brand-text-name">Amit School</div>
              <div className="brand-text-sub">School Dashboard</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Main Menu</div>
          {NAV_ITEMS.map((item) => {
            if (item.children) {
              const isGroupActive = location.pathname.startsWith(item.base);
              const isOpen = openMenu === item.key;
              return (
                <div className="nav-group" key={item.key}>
                  <div
                    className={`nav-item nav-parent ${isGroupActive ? 'active' : ''}`}
                    onClick={() => toggleMenu(item.key)}
                  >
                    <i className={`ti ${item.icon}`}></i>
                    <span className="nav-label-text">{item.label}</span>
                    <i className={`ti ti-chevron-down nav-caret ${isOpen ? 'open' : ''}`}></i>
                  </div>
                  <div className={`nav-submenu ${isOpen ? 'open' : ''}`}>
                    {item.children.map((child) => (
                      <NavLink
                        key={child.to}
                        to={child.to}
                        onClick={onCloseMobile}
                        className={({ isActive }) => `nav-subitem ${isActive ? 'active' : ''}`}
                      >
                        <i className={`ti ${child.icon}`}></i>
                        <span className="nav-label-text">{child.label}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              );
            }
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <i className={`ti ${item.icon}`}></i>
                <span className="nav-label-text">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="help-box">
            <i className="ti ti-help-circle"></i>
            <p>Need help with Amit School?</p>
            <button className="help-btn">Go to help center</button>
          </div>
          <p className="sidebar-copy">©2026 All rights reserved</p>
        </div>
      </aside>
    </>
  );
}
