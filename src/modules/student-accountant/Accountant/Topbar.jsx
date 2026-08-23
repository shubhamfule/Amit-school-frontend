import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getAccountStats } from "./accountsData";

export default function Topbar({ onHamburger, isDark, onToggleDark, showToast }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [time, setTime] = useState("");
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const stats = getAccountStats();
  const inr = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

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
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <header className="topbar">
      <button className="hamburger-btn" onClick={onHamburger} aria-label="Open menu">
        <i className="ti ti-menu-2"></i>
      </button>

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
                <i className="bi bi-people-fill"></i>
              </div>
              <div className="notif-txt flex-grow-1">
                <p>New admission request pending</p>
                <span>2 min ago</span>
              </div>
            </div>
            <div className="notif-item-dd">
              <div className="notif-ico" style={{ background: "var(--pink-light)", color: "var(--pink)" }}>
                <i className="bi bi-cash-stack"></i>
              </div>
              <div className="notif-txt flex-grow-1">
                <p>Fee collection pending for 3 students</p>
                <span>15 min ago</span>
              </div>
            </div>
            <div className="notif-item-dd">
              <div className="notif-ico" style={{ background: "var(--amber-light)", color: "var(--amber)" }}>
                <i className="bi bi-wallet2"></i>
              </div>
              <div className="notif-txt flex-grow-1">
                <p>{inr(stats.pendingFees)} in fees still pending</p>
                <span>Today</span>
              </div>
            </div>
          </div>
        </div>

        <div className={`icon-btn ${isDark ? "active" : ""}`} title="Toggle dark mode" onClick={onToggleDark}>
          <i className={`ti ${isDark ? "ti-sun" : "ti-moon"}`}></i>
        </div>

        <div className="live-clock" style={{ margin: 0, padding: "8px 10px", fontSize: 13 }}>{time}</div>

        <div className="profile-wrap" ref={profileRef}>
          <button
            type="button"
            className="user-pill"
            title="View accountant profile"
            onClick={(e) => { e.stopPropagation(); setProfileOpen((o) => !o); }}
          >
            <div className="user-avatar">MS</div>
            <div className="d-none d-md-block">
              <div className="user-name">Mr. Sara</div>
              <div className="user-role">Accountant</div>
            </div>
            <i className={`bi bi-chevron-down profile-chevron ${profileOpen ? "open" : ""}`}></i>
          </button>

          <div className={`profile-dropdown ${profileOpen ? "show" : ""}`}>
            <div className="profile-dropdown-head">
              <div className="profile-large-avatar">MS</div>
              <div>
                <strong>Mr. Sara</strong>
                <span>Accountant</span>
              </div>
            </div>
            <div className="profile-detail"><i className="bi bi-envelope"></i><span>accounts@amitschools.edu</span></div>
            <div className="profile-detail"><i className="bi bi-telephone"></i><span>+91 98765 43210</span></div>
            <div className="profile-detail"><i className="bi bi-person-badge"></i><span>Student Accountant</span></div>
            <button type="button" className="profile-view-btn" onClick={() => { setProfileOpen(false); navigate("/student-accountant/settings"); }}>
              <i className="bi bi-person-circle"></i> View full profile
            </button>
          </div>
        </div>

        <button type="button" className="icon-btn" title="Logout" onClick={() => {
          sessionStorage.setItem("accountantAuthenticated", "false");
          localStorage.removeItem("accountantSession");
          navigate("/student-accountant/login", { replace: true });
        }}>
          <i className="ti ti-logout"></i>
        </button>
      </div>
    </header>
  );
}
