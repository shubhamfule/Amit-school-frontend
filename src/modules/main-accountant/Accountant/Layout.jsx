import { useCallback, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "", icon: "ti-check" });
  const toastTimer = useRef(null);

  const showToast = useCallback((msg, icon = "ti-check") => {
    setToast({ show: true, msg, icon });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 2500);
  }, []);

  const toggleDark = () => {
    setIsDark((d) => {
      const next = !d;
      document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
      showToast(next ? "Dark mode on" : "Light mode on", next ? "ti-moon" : "ti-sun");
      return next;
    });
  };

  return (
    <div className="shell">
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="main">
        <Topbar
          onHamburger={() => setMobileOpen(true)}
          isDark={isDark}
          onToggleDark={toggleDark}
          showToast={showToast}
        />

        <main className="content">
          {/* Outlet is where routed pages render — Sidebar/Topbar above never remount */}
          <Outlet context={{ showToast }} />
        </main>
      </div>

      <div className={`ec-toast ${toast.show ? "show" : ""}`}>
        <i className={`ti ${toast.icon}`}></i>
        <span>{toast.msg}</span>
      </div>
    </div>
  );
}
