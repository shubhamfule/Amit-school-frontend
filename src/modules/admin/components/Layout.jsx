import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useTheme } from './ThemeContext';

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className="shell">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="main">
        <Header
          onOpenMobileSidebar={() => setMobileOpen(true)}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
        />
        <main className="content">
          {/* Only this part changes when the user opens a new page —
              the sidebar and header above stay mounted and stable. */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
