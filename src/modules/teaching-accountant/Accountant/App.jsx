import { Routes, Route } from "react-router-dom";
import "./theme.css";
import Layout from "./Layout";
import Dashboard from "./Dashboard";
import Notices from "./Notices";
import TeacherRegistration from "./TeacherRegistration";
import MarkAttendance from "./MarkAttendance";
import StaffSalaryPage from "./StaffSalaryPage";
import StaffDirectory from "./StaffDirectory";
import SchoolExpenses from "./SchoolExpenses";
import AccountantDashboard from "./AccountantDashboard";
import Reports from "./Reports";
import Events from "./Events";
import LeaveApplications from "./LeaveApplications";
import AccountantSettings from "./AccountantSettings";
import Library from "./Library";
import ComingSoon from "./ComingSoon";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/notices" element={<Notices />} />

        <Route path="/admission/teaching" element={<TeacherRegistration />} />
        <Route path="/attendance" element={<MarkAttendance />} />

        <Route path="/accounts/dashboard" element={<AccountantDashboard />} />
        <Route path="/accounts/staff/directory" element={<StaffDirectory />} />
        <Route path="/accounts/staff/teaching" element={<StaffSalaryPage />} />
        <Route path="/accounts/expenses" element={<SchoolExpenses />} />
        <Route path="/accounts/reports" element={<Reports />} />

        <Route path="/library/book-issue" element={<Library section="issue" />} />
        <Route path="/library/book-return" element={<Library section="return" />} />
        <Route path="/library/fine-collection" element={<Library section="fine" />} />
        <Route path="/library/clearance" element={<Library section="clearance" />} />

        <Route path="/events" element={<Events />} />
        <Route path="/leave-applications" element={<LeaveApplications />} />
        <Route path="/settings" element={<AccountantSettings />} />

        <Route path="*" element={<ComingSoon title="Page not found" />} />
      </Route>
    </Routes>
  );
}
