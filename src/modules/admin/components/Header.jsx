import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from './ToastContext';

const NOTIFICATIONS = [
  { icon: 'ti-user-plus', bg: 'var(--purple-light)', color: 'var(--purple)', text: 'New admission request from <b>Arjun S</b>', time: '2 min ago', unread: true },
  { icon: 'ti-report-money', bg: 'var(--pink-light)', color: 'var(--pink)', text: 'Fee pending for <b>3 students</b>', time: '15 min ago', unread: true },
  { icon: 'ti-calendar-event', bg: 'var(--blue-light)', color: 'var(--blue)', text: 'Parent-teacher conference on <b>12 Jul</b>', time: '1 hour ago', unread: false },
  { icon: 'ti-alert-triangle', bg: 'var(--amber-light)', color: 'var(--amber)', text: 'Staff attendance below 80% today', time: '3 hours ago', unread: false },
];

export default function Header({ onOpenMobileSidebar, darkMode, onToggleDarkMode, title }) {
  const [openDD, setOpenDD] = useState(null); // 'notif' | 'lang' | 'user' | null
  const [unread, setUnread] = useState(2);
  const [lang, setLang] = useState('EN');
  const wrapRef = useRef(null);
  const navigate = useNavigate();
  const showToast = useToast();

  useEffect(() => {
    function onDocClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpenDD(null);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  function handleLogout() {
    showToast('Logging out…', 'ti-logout');
    setOpenDD(null);
    navigate('/admin/login');
  }

  return (
    <header className="topbar" ref={wrapRef}>
      <button className="hamburger-btn" onClick={onOpenMobileSidebar} aria-label="Open menu">
        <i className="ti ti-menu-2"></i>
      </button>

      <div className="topbar-right">
        <div className="dropdown-wrap">
          <div
            className={`icon-btn ${openDD === 'notif' ? 'active' : ''}`}
            title="Notifications"
            onClick={() => setOpenDD(openDD === 'notif' ? null : 'notif')}
          >
            <i className="ti ti-bell"></i>
            {unread > 0 && <span className="notif-dot"></span>}
          </div>
          {openDD === 'notif' && (
            <div className="notif-dropdown">
              <div className="notif-head">
                <h6>Notifications</h6>
                <button className="notif-mark" onClick={() => { setUnread(0); showToast('All notifications marked as read', 'ti-check'); }}>
                  Mark all read
                </button>
              </div>
              {NOTIFICATIONS.map((n, i) => (
                <div className={`notif-item-dd ${n.unread && unread > 0 ? 'unread' : ''}`} key={i}>
                  <div className="notif-ico" style={{ background: n.bg, color: n.color }}>
                    <i className={`ti ${n.icon}`}></i>
                  </div>
                  <div className="notif-txt flex-grow-1">
                    <p dangerouslySetInnerHTML={{ __html: n.text }} />
                    <span>{n.time}</span>
                  </div>
                  {n.unread && unread > 0 && <div className="unread-dot"></div>}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="icon-btn" title="Messages" onClick={() => showToast('You have no new messages', 'ti-message-circle')}>
          <i className="ti ti-message-circle"></i>
        </div>

        <div className="icon-btn" title="Toggle dark mode" onClick={onToggleDarkMode}>
          <i className={`ti ${darkMode ? 'ti-sun' : 'ti-moon'}`}></i>
        </div>

        <div className="dropdown-wrap">
          <button className="lang-btn" onClick={() => setOpenDD(openDD === 'lang' ? null : 'lang')}>
            {lang} <i className="ti ti-chevron-down" style={{ fontSize: 12 }}></i>
          </button>
          {openDD === 'lang' && (
            <div className="notif-dropdown lang-dropdown">
              {['EN', 'TA', 'HI'].map((l) => (
                <div key={l} className="dd-item" onClick={() => { setLang(l); setOpenDD(null); }}>
                  {l === 'EN' && <i className="ti ti-circle-check me-2" style={{ color: 'var(--purple)', marginRight: 8 }}></i>}
                  {l === 'EN' ? 'English' : l === 'TA' ? 'Tamil' : 'Hindi'}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dropdown-wrap">
          <div className="user-pill" onClick={() => setOpenDD(openDD === 'user' ? null : 'user')}>
            <div className="user-avatar">MS</div>
            <div>
              <div className="user-name">Mr. Sara</div>
              <div className="user-role">Super Admin</div>
            </div>
            <i className="ti ti-chevron-down" style={{ fontSize: 13, color: 'var(--text-muted)' }}></i>
          </div>
          {openDD === 'user' && (
            <div className="notif-dropdown user-dropdown">
              <div className="dd-item" onClick={() => { setOpenDD(null); showToast('Opening profile…', 'ti-user'); }}>
                <i className="ti ti-user"></i>Profile
              </div>
              <div className="dd-item" onClick={() => { setOpenDD(null); navigate('/admin/settings'); }}>
                <i className="ti ti-settings"></i>Settings
              </div>
              <hr />
              <div className="dd-item danger" onClick={handleLogout}>
                <i className="ti ti-logout"></i>Logout
              </div>
            </div>
          )}
        </div>

        <div className="icon-btn" title="Logout" onClick={handleLogout}>
          <i className="ti ti-logout"></i>
        </div>
      </div>
    </header>
  );
}
