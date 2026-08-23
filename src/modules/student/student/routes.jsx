/**
 * Portable route table for the `student` feature folder.
 *
 * This folder does NOT create its own <BrowserRouter> and does NOT touch
 * the host project's App.jsx/main.jsx. Instead it exports a plain
 * react-router-dom v6 route-object array that the host project spreads
 * into its own <Routes> (or createBrowserRouter config):
 *
 *   import { useRoutes } from "react-router-dom";
 *   import { studentRoutes } from "./student/routes.jsx";
 *
 *   function App() {
 *     const element = useRoutes([
 *       ...otherRoutes,
 *       ...studentRoutes,
 *     ]);
 *     return element;
 *   }
 *
 * or, with <Routes>/<Route> JSX instead of useRoutes — see the
 * <StudentRoutes /> component exported below for that style.
 *
 * Paths match Layout.jsx's NAV_ITEMS exactly, so the sidebar links keep
 * working unmodified no matter where this gets mounted, as long as the
 * host app doesn't rewrite the /dashboard and /login base paths.
 */
import { Route } from "react-router-dom";

import Layout from "./Layout.jsx";
import Login from "./Login.jsx";
import Logout from "./Logout.jsx";
import Dashboard from "./Dashboard.jsx";
import ProfileInfo from "./ProfileInfo.jsx";
import ParentInfo from "./ParentInfo.jsx";
import Fees from "./Fees.jsx";
import Attendance from "./Attendance.jsx";
import Notice from "./Notice.jsx";
import Result from "./Result.jsx";
import Exam from "./Exam.jsx";
import Library from "./Library.jsx";
import Certificate from "./Certificate.jsx";
import Leave from "./Leave.jsx";
import Events from "./Event.jsx";

/** Plain route-object array, for useRoutes() or createBrowserRouter(). */
export const studentRoutes = [
  { path: "/login", element: <Login /> },
  { path: "/logout", element: <Logout /> },
  {
    path: "/dashboard",
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "profile", element: <ProfileInfo /> },
      { path: "parent-info", element: <ParentInfo /> },
      { path: "fees", element: <Fees /> },
      { path: "attendance", element: <Attendance /> },
      { path: "notice", element: <Notice /> },
      { path: "result", element: <Result /> },
      { path: "exam", element: <Exam /> },
      { path: "library", element: <Library /> },
      { path: "certificate", element: <Certificate /> },
      { path: "leave", element: <Leave /> },
      { path: "events", element: <Events /> }
    ]
  }
];

/**
 * JSX <Route> tree, for hosts that nest this inside their own <Routes>
 * instead of using useRoutes(). Usage:
 *
 *   import { Routes } from "react-router-dom";
 *   import { StudentRoutes } from "./student/routes.jsx";
 *
 *   <Routes>
 *     {StudentRoutes()}
 *     ...other <Route> elements
 *   </Routes>
 */
export function StudentRoutes() {
  return (
    <>
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/dashboard" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<ProfileInfo />} />
        <Route path="parent-info" element={<ParentInfo />} />
        <Route path="fees" element={<Fees />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="notice" element={<Notice />} />
        <Route path="result" element={<Result />} />
        <Route path="exam" element={<Exam />} />
        <Route path="library" element={<Library />} />
        <Route path="certificate" element={<Certificate />} />
        <Route path="leave" element={<Leave />} />
        <Route path="events" element={<Events />} />
      </Route>
    </>
  );
}

export default studentRoutes;
