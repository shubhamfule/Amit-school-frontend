import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

export default function Topbar({ onHamburger, isDark, onToggleDark, showToast }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [time, setTime] = useState("");
  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    function onDocClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <header className="topbar">
      <button className="hamburger-btn" onClick={onHamburger} aria-label="Open menu">
        <i className="ti ti-menu-2"></i>
      </button>

      <div className="search-wrap">
        <i className="ti ti-search"></i>
        <input
          type="search"
          placeholder="Search…"
          onChange={(e) => {
            const q = e.target.value.trim();
            if (q.length > 2) showToast(`Searching for "${q}"…`, "ti-search");
          }}
        />
      </div>

      <div className="topbar-right">
        <div style={{ position: "relative" }} ref={notifRef}>
          <div className="icon-btn" title="Notifications" onClick={(e) => { e.stopPropagation(); setNotifOpen((o) => !o); }}>
            <i className="ti ti-bell"></i>
            <span className="notif-dot"></span>
          </div>
          <div className={`notif-dropdown ${notifOpen ? "show" : ""}`}>
            <div className="notif-head"><h6>Notifications</h6></div>
            <div className="notif-item-dd">
              <div className="notif-ico" style={{ background: "var(--purple-light)", color: "var(--purple)" }}>
                <i className="bi bi-journal-plus"></i>
              </div>
              <div className="notif-txt flex-grow-1">
                <p>3 assignments pending review</p>
                <span>10 min ago</span>
              </div>
            </div>
            <div className="notif-item-dd">
              <div className="notif-ico" style={{ background: "var(--pink-light)", color: "var(--pink)" }}>
                <i className="bi bi-envelope-plus"></i>
              </div>
              <div className="notif-txt flex-grow-1">
                <p>2 leave applications awaiting approval</p>
                <span>25 min ago</span>
              </div>
            </div>
            <div className="notif-item-dd">
              <div className="notif-ico" style={{ background: "var(--amber-light)", color: "var(--amber)" }}>
                <i className="bi bi-clipboard2-check"></i>
              </div>
              <div className="notif-txt flex-grow-1">
                <p>Attendance not marked for 9th A</p>
                <span>Today</span>
              </div>
            </div>
          </div>
        </div>

        <div className={`icon-btn ${isDark ? "active" : ""}`} title="Toggle dark mode" onClick={onToggleDark}>
          <i className={`ti ${isDark ? "ti-sun" : "ti-moon"}`}></i>
        </div>

        <div className="live-clock" style={{ margin: 0, padding: "8px 10px", fontSize: 13 }}>{time}</div>

        <div className="user-menu-wrap" ref={userMenuRef}>
          <div
            className="user-pill"
            title="Teacher"
            onClick={(e) => {
              e.stopPropagation();
              setUserMenuOpen((o) => !o);
            }}
          >
            <div className="user-avatar">RS</div>
            <div className="d-none d-md-block">
              <div className="user-name">Ramesh Sharma</div>
              <div className="user-role">Mathematics Teacher</div>
            </div>
          </div>

          <div className={`user-menu ${userMenuOpen ? "show" : ""}`}>
            <div className="user-menu-header">
              <div className="user-avatar large">RS</div>
              <div>
                <div className="user-menu-name">Ramesh Sharma</div>
                <div className="user-menu-role">Mathematics Teacher</div>
              </div>
            </div>

            <button className="user-menu-item" type="button" onClick={() => setUserMenuOpen(false)}>
              <i className="ti ti-user-circle"></i>
              View Profile
            </button>
            <button className="user-menu-item" type="button" onClick={() => setUserMenuOpen(false)}>
              <i className="ti ti-settings"></i>
              Account Settings
            </button>
            <NavLink to="/teacher" className="user-menu-item danger" onClick={() => setUserMenuOpen(false)}>
              <i className="ti ti-logout"></i>
              Logout
            </NavLink>
          </div>
        </div>

        <NavLink to="/teacher" className="icon-btn" title="Logout">
          <i className="ti ti-logout"></i>
        </NavLink>
      </div>
    </header>
  );
}
