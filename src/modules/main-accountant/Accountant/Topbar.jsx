import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { getAccountStats } from "./accountsData";

export default function Topbar({ onHamburger, isDark, onToggleDark, showToast }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [time, setTime] = useState("");
  const notifRef = useRef(null);
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
        <input type="search" placeholder="Search students, teachers, transactions…" />
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
            <div className="notif-item-dd">
              <div className="notif-ico" style={{ background: "var(--green-light)", color: "var(--green)" }}>
                <i className="bi bi-cash-coin"></i>
              </div>
              <div className="notif-txt flex-grow-1">
                <p>{inr(stats.pendingSalary)} in staff salary yet to be paid</p>
                <span>Today</span>
              </div>
            </div>
          </div>
        </div>

        <div className={`icon-btn ${isDark ? "active" : ""}`} title="Toggle dark mode" onClick={onToggleDark}>
          <i className={`ti ${isDark ? "ti-sun" : "ti-moon"}`}></i>
        </div>

        <div className="live-clock" style={{ margin: 0, height: 36, display: "flex", alignItems: "center", padding: "0 12px", fontSize: 13 }}>{time}</div>

        <div className="user-pill" title="Main Accountant">
          <div className="user-avatar">MA</div>
          <div className="d-none d-md-block">
            <div className="user-name">Mr. Sara</div>
            <div className="user-role">Main Accountant</div>
          </div>
        </div>

        <NavLink to="/main-accountant" className="icon-btn" title="Logout">
          <i className="ti ti-logout"></i>
        </NavLink>
      </div>
    </header>
  );
}
