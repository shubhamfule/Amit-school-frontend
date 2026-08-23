import { Navigate, useRoutes } from "react-router-dom";
import { studentRoutes } from "./student/routes.jsx";
import "./student/student.css";

export default function App() {
  const element = useRoutes([
    { path: "/", element: <Navigate to="/student/dashboard" replace /> },
    ...studentRoutes
  ]);

  return <div className="app-student">{element}</div>;
}
