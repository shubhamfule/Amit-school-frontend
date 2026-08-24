import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './styles/global.css';
import Layout from './components/Layout';
import { ToastProvider } from './components/ToastContext';
import { ThemeProvider } from './components/ThemeContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Events from './pages/Events';
import Finance from './pages/Finance';
import Library from './pages/Library';
import Notices from './pages/Notices';
import CalendarPage from './pages/CalendarPage';
import Settings from './pages/Settings';

export default function App() {
  return (
    <div className="app-admin">
    <ThemeProvider>
      <ToastProvider>
          <Routes>
            {/* Standalone page — no sidebar / header */}
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="login" element={<Login />} />

            <Route element={<Layout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="students" element={<Students />} />
              <Route path="teachers" element={<Navigate to="/admin/teachers/teaching" replace />} />
              <Route path="teachers/:section" element={<Teachers />} />
              <Route path="events" element={<Events />} />
              <Route path="library" element={<Library />} />
              <Route path="finance" element={<Navigate to="/admin/finance/overview" replace />} />
              <Route path="finance/:section" element={<Finance />} />
              <Route path="notices" element={<Notices />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </Route>
          </Routes>
      </ToastProvider>
    </ThemeProvider>
    </div>
  );
}
