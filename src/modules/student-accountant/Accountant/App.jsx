import { Routes, Route, Navigate } from "react-router-dom";
import "./theme.css";
import Layout from "./Layout";
import Dashboard from "./Dashboard";
import Notices from "./Notices";
import StudentAdmission from "./StudentAdmission";
import StudentFeeCollection from "./StudentFeeCollection";
import StudentManagement from "./StudentManagement";
import Reports from "./Reports";
import Events from "./Events";
import AccountantSettings from "./AccountantSettings";
import BookIssue from "./BookIssue";
import BookReturn from "./BookReturn";
import FineCollection from "./FineCollection";
import LibraryClearance from "./LibraryClearance";
import ComingSoon from "./ComingSoon";
import Login from "./Login";

function ProtectedLayout() {
  const authenticated = sessionStorage.getItem("accountantAuthenticated");
  if (authenticated === "false") return <Navigate to="/student-accountant/login" replace />;
  if (!authenticated) sessionStorage.setItem("accountantAuthenticated", "true");
  return <Layout />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/notices" element={<Notices />} />
        <Route path="/admission" element={<StudentAdmission />} />

        <Route path="/accounts/student-fee" element={<StudentFeeCollection />} />
        <Route path="/accounts/students" element={<StudentManagement />} />
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
