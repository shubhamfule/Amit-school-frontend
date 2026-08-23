import { Routes, Route } from "react-router-dom";
import "./theme.css";
import Layout from "./Layout";
import Dashboard from "./Dashboard";
import AttendanceManagement from "./AttendanceManagement";
import LeaveApplications from "./LeaveApplications";
import Notices from "./Notices";
import TeacherRegistration from "./TeacherRegistration";
import NonTeachingRegistration from "./NonTeachingRegistration";
import StudentAdmission from "./StudentAdmission";
import StaffSalaryPage from "./StaffSalaryPage";
import TeacherSalary from "./TeacherSalary";
import StudentFeeCollection from "./StudentFeeCollection";
import SchoolExpenses from "./SchoolExpenses";
import AccountantDashboard from "./AccountantDashboard";
import Reports from "./Reports";
import Events from "./Events";
import AccountantSettings from "./AccountantSettings";
import BookIssue from "./BookIssue";
import BookReturn from "./BookReturn";
import FineCollection from "./FineCollection";
import LibraryClearance from "./LibraryClearance";
import ComingSoon from "./ComingSoon";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/attendance" element={<AttendanceManagement />} />
        <Route path="/leave-application" element={<LeaveApplications />} />
        <Route path="/notices" element={<Notices />} />

        <Route path="/admission/teaching" element={<TeacherRegistration />} />
        <Route path="/admission/non-teaching" element={<NonTeachingRegistration />} />
        <Route path="/admission/students" element={<StudentAdmission />} />

        <Route path="/accounts/dashboard" element={<AccountantDashboard />} />
        <Route path="/accounts/student-fee" element={<StudentFeeCollection />} />
        <Route path="/accounts/teacher-salary" element={<TeacherSalary />} />
        <Route path="/accounts/staff/non-teaching" element={<StaffSalaryPage />} />
        <Route path="/accounts/expenses" element={<SchoolExpenses />} />
        <Route path="/accounts/reports" element={<Reports />} />

        <Route path="/library/book-issue" element={<BookIssue />} />
        <Route path="/library/book-return" element={<BookReturn />} />
        <Route path="/library/fine-collection" element={<FineCollection />} />
        <Route path="/library/clearance" element={<LibraryClearance />} />

        <Route path="/events" element={<Events />} />
        <Route path="/settings" element={<AccountantSettings />} />

        <Route path="*" element={<ComingSoon title="Page not found" />} />
      </Route>
    </Routes>
  );
}
