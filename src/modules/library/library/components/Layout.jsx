import { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

const NAV_ITEMS = [
  { to: '/library/dashboard', icon: 'ti-layout-dashboard', label: 'Dashboard' },
  { to: '/library/catalog', icon: 'ti-books', label: 'Book Catalog' },
  { to: '/library/members', icon: 'ti-users', label: 'Members' },
  { to: '/library/circulation', icon: 'ti-transfer-in', label: 'Issue / Return' },
  { to: '/library/fines', icon: 'ti-report-money', label: 'Fines & Fees' },
  { to: '/library/calendar', icon: 'ti-calendar', label: 'Calendar' },
  { to: '/library/events', icon: 'ti-calendar-event', label: 'Events' },
  { to: '/library/leave-applications', icon: 'ti-calendar-stats', label: 'Leave Application' },
  { to: '/library/settings', icon: 'ti-settings', label: 'Settings' },
];

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [unread, setUnread] = useState(true);
  const [dark, setDark] = useState(false);
  const navigate = useNavigate();
  const showToast = useToast();
  const rootRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    function onDocClick(e) {
      if (!rootRef.current) return;
      if (!e.target.closest('.notif-wrap')) setNotifOpen(false);
      if (!e.target.closest('.user-wrap')) setUserOpen(false);
      if (!e.target.closest('.lang-wrap')) setLangOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const handleLogout = () => {
    showToast('Logging out…', 'ti-logout');
    setTimeout(() => navigate('/library'), 500);
  };

  return (
    <div ref={rootRef}>
      <div className={`sidebar-overlay${mobileOpen ? ' show' : ''}`} onClick={() => setMobileOpen(false)} />

      <div className="shell">
        {/* Sidebar — static, stable width, always mounted */}
        <aside className={`sidebar${collapsed ? ' collapsed' : ''}${mobileOpen ? ' mobile-open' : ''}`}>
          <button className="sidebar-toggle" title="Collapse sidebar" onClick={() => setCollapsed((c) => !c)}>
            <i className={`ti ${collapsed ? 'ti-chevron-right' : 'ti-chevron-left'}`}></i>
          </button>

          <div className="sidebar-brand">
            <div className="brand-logo">
              <div className="brand-icon"><i className="ti ti-books"></i></div>
              <div className="brand-text">
                <div className="brand-text-name">Amit School</div>
                <div className="brand-text-sub">Librarian Portal</div>
              </div>
            </div>
          </div>

          <nav className="sidebar-nav">
            <div className="nav-section-label">Main Menu</div>
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <i className={`ti ${item.icon}`}></i>
                <span className="nav-label-text">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="sidebar-footer">
            <div className="help-box">
              <i className="ti ti-help-circle"></i>
              <p>Need help with Amit School?</p>
              <button className="help-btn" onClick={() => showToast('Opening help center…', 'ti-help-circle')}>
                Go to help center
              </button>
            </div>
            <p className="sidebar-copy">©2024 All rights reserved</p>
          </div>
        </aside>

        {/* Main column */}
        <div className="main">
          {/* Topbar — static height, always mounted */}
          <header className="topbar">
            <button className="hamburger-btn" aria-label="Open menu" onClick={() => setMobileOpen(true)}>
              <i className="ti ti-menu-2"></i>
            </button>

            <div className="search-wrap">
              <i className="ti ti-search"></i>
              <input type="search" placeholder="Search books, members, ISBN…" />
            </div>

            <div className="topbar-right">
              <div className="notif-wrap" style={{ position: 'relative' }}>
                <div className="icon-btn" title="Notifications" onClick={() => setNotifOpen((o) => !o)}>
                  <i className="ti ti-bell"></i>
                  {unread && <span className="notif-dot"></span>}
                </div>
                <div className={`notif-dropdown${notifOpen ? ' show' : ''}`}>
                  <div className="notif-head">
                    <h6>Notifications</h6>
                    <span className="notif-mark" onClick={() => { setUnread(false); showToast('All notifications marked as read', 'ti-check'); }}>
                      Mark all read
                    </span>
                  </div>
                  <div className="notif-item-dd unread">
                    <div className="notif-ico" style={{ background: 'var(--purple-light)', color: 'var(--purple)' }}><i className="ti ti-user-plus"></i></div>
                    <div className="notif-txt flex-grow-1"><p>New book request from <strong>Arjun S, Class 8A</strong></p><span>2 min ago</span></div>
                    <div className="unread-dot"></div>
                  </div>
                  <div className="notif-item-dd unread">
                    <div className="notif-ico" style={{ background: 'var(--pink-light)', color: 'var(--pink)' }}><i className="ti ti-report-money"></i></div>
                    <div className="notif-txt flex-grow-1"><p>Overdue fine pending for <strong>3 students</strong></p><span>15 min ago</span></div>
                    <div className="unread-dot"></div>
                  </div>
                  <div className="notif-item-dd">
                    <div className="notif-ico" style={{ background: 'var(--blue-light)', color: 'var(--blue)' }}><i className="ti ti-calendar-event"></i></div>
                    <div className="notif-txt flex-grow-1"><p>Book fair meeting scheduled on <strong>12 Jul</strong></p><span>1 hour ago</span></div>
                  </div>
                  <div className="notif-item-dd">
                    <div className="notif-ico" style={{ background: 'var(--amber-light)', color: 'var(--amber)' }}><i className="ti ti-alert-triangle"></i></div>
                    <div className="notif-txt flex-grow-1"><p>Stock of <strong>Science textbooks</strong> running low</p><span>3 hours ago</span></div>
                  </div>
                </div>
              </div>

              <div className="icon-btn" title="Messages"><i className="ti ti-message-circle"></i></div>

              <div className="icon-btn" title="Toggle dark mode" onClick={() => setDark((d) => !d)}>
                <i className={`ti ${dark ? 'ti-sun' : 'ti-moon'}`}></i>
              </div>

              <div className="lang-wrap" style={{ position: 'relative' }}>
                <button className="lang-btn" onClick={() => setLangOpen((o) => !o)}>
                  EN <i className="ti ti-chevron-down" style={{ fontSize: 12 }}></i>
                </button>
                {langOpen && (
                  <ul className="dropdown-menu show" style={{ position: 'absolute', right: 0 }}>
                    <li><a className="dropdown-item" href="#" onClick={(e) => e.preventDefault()}><i className="ti ti-circle-check me-2" style={{ color: 'var(--purple)' }}></i>English</a></li>
                    <li><a className="dropdown-item" href="#" onClick={(e) => e.preventDefault()}>Tamil</a></li>
                    <li><a className="dropdown-item" href="#" onClick={(e) => e.preventDefault()}>Hindi</a></li>
                  </ul>
                )}
              </div>

              <div className="user-wrap" style={{ position: 'relative' }}>
                <div className="user-pill" role="button" onClick={() => setUserOpen((o) => !o)}>
                  <div className="user-avatar">MR</div>
                  <div className="d-none d-md-block">
                    <div className="user-name">Ms. Meera Rao</div>
                    <div className="user-role">Head Librarian</div>
                  </div>
                  <i className="ti ti-chevron-down" style={{ fontSize: 13, color: 'var(--text-muted)' }}></i>
                </div>
                {userOpen && (
                  <ul className="dropdown-menu show" style={{ position: 'absolute', right: 0 }}>
                    <li><a className="dropdown-item" href="#" onClick={(e) => e.preventDefault()}><i className="ti ti-user me-2"></i>Profile</a></li>
                    <li><NavLink className="dropdown-item" to="/library/settings"><i className="ti ti-settings me-2"></i>Settings</NavLink></li>
                    <li><hr className="dropdown-divider" style={{ borderColor: 'var(--border)' }} /></li>
                    <li><a className="dropdown-item" href="#" style={{ color: 'var(--red)' }} onClick={(e) => { e.preventDefault(); handleLogout(); }}><i className="ti ti-logout me-2"></i>Logout</a></li>
                  </ul>
                )}
              </div>

              <div className="icon-btn" title="Logout" onClick={handleLogout}><i className="ti ti-logout"></i></div>
            </div>
          </header>

          {/* Only this area changes when navigating between pages */}
          <main className="content">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
