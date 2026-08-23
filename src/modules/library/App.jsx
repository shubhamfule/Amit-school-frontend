import { Routes, Route, Navigate } from 'react-router-dom';
import './library/styles/global.css';
import { ToastProvider } from './library/context/ToastContext';
import Layout from './library/components/Layout';
import Dashboard from './library/pages/Dashboard';
import BookCatalog from './library/pages/BookCatalog';
import Members from './library/pages/Members';
import IssueReturn from './library/pages/IssueReturn';
import FinesFees from './library/pages/FinesFees';
import CalendarPage from './library/pages/CalendarPage';
import Events from './library/pages/Events';
import LeaveApplications from './library/pages/LeaveApplications';
import Settings from './library/pages/Settings';

export default function App() {
  return (
    <ToastProvider>
        <Routes>
          {/* Layout (sidebar + header) stays mounted across all these routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/library/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/catalog" element={<BookCatalog />} />
            <Route path="/members" element={<Members />} />
            <Route path="/circulation" element={<IssueReturn />} />
            <Route path="/fines" element={<FinesFees />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/events" element={<Events />} />
            <Route path="/leave-applications" element={<LeaveApplications />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/library" replace />} />
        </Routes>
    </ToastProvider>
  );
}
