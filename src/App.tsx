import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import LogoutButton from "./components/LogoutButton";
import { getCurrentUser, logout } from "./lib/auth";

import AdminApp from "./modules/admin/App.jsx";
import AdminLogin from "./modules/admin/pages/Login.jsx";
import LibraryApp from "./modules/library/App.jsx";
import MainAccountantApp from "./modules/main-accountant/Accountant/App.jsx";
import NonTeachingAccountantApp from "./modules/non-teaching-accountant/Accountant/App.jsx";
import StudentAccountantApp from "./modules/student-accountant/Accountant/App.jsx";
import StudentApp from "./modules/student/App.jsx";
import TeacherApp from "./modules/teacher/App.jsx";
import TeachingAccountantApp from "./modules/teaching-accountant/Accountant/App.jsx";

// Several modules' own "Logout" buttons link back to the app root ("/").
// Treat visiting the true root as an explicit logout + return to the login page.
function RootRedirect() {
  if (getCurrentUser()) {
    logout();
  }
  return <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <LogoutButton />
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<Navigate to="/admin/login" replace />} />

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin/*"
          element={
            <ProtectedRoute role="admin">
              <AdminApp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/library/*"
          element={
            <ProtectedRoute role="library">
              <LibraryApp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/main-accountant/*"
          element={
            <ProtectedRoute role="main-accountant">
              <MainAccountantApp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/non-teaching-accountant/*"
          element={
            <ProtectedRoute role="non-teaching-accountant">
              <NonTeachingAccountantApp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student-accountant/*"
          element={
            <ProtectedRoute role="student-accountant">
              <StudentAccountantApp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/*"
          element={
            <ProtectedRoute role="student">
              <StudentApp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/*"
          element={
            <ProtectedRoute role="teacher">
              <TeacherApp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teaching-accountant/*"
          element={
            <ProtectedRoute role="teaching-accountant">
              <TeachingAccountantApp />
            </ProtectedRoute>
          }
        />

        {/* Unknown URL: send to login (auto-redirects onward if already signed in) */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
