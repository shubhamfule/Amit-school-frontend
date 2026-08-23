import { Routes, Route } from "react-router-dom";
import "./styles/theme.css";
import Layout from "./layout/Layout";
import TeacherDashboard from "./pages/teacher-portal/TeacherDashboard";
import StudentPortal from "./pages/teacher-portal/StudentPortal";
import Schedule from "./pages/teacher-portal/Schedule";
import Attendance from "./pages/teacher-portal/Attendance";
import Marks from "./pages/teacher-portal/Marks";
import LeaveApplications from "./pages/teacher-portal/LeaveApplications";
import Assignments from "./pages/teacher-portal/Assignments";
import Library from "./pages/teacher-portal/Library";

export default function App() {
  return (
    <div className="app-teacher">
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<TeacherDashboard />} />
        <Route path="/students" element={<StudentPortal />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/marks" element={<Marks />} />
        <Route path="/leave-applications" element={<LeaveApplications />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/library" element={<Library />} />
      </Route>
    </Routes>
    </div>
  );
}
