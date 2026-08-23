// Central navigation map — single source of truth for the sidebar
// and for which routes exist in the app.
export const navConfig = [
  { key: "dashboard", label: "Dashboard", icon: "bi bi-speedometer2", path: "/teacher" },
  { key: "students", label: "Students", icon: "bi bi-people-fill", path: "/teacher/students" },
  { key: "schedule", label: "Schedule", icon: "bi bi-calendar2-week", path: "/teacher/schedule" },
  { key: "attendance", label: "Attendance", icon: "bi bi-clipboard2-check", path: "/teacher/attendance" },
  { key: "marks", label: "Marks", icon: "bi bi-graph-up", path: "/teacher/marks" },
  { key: "leave-applications", label: "Leave Applications", icon: "bi bi-envelope-plus", path: "/teacher/leave-applications" },
  { key: "assignments", label: "Assignments", icon: "bi bi-journal-plus", path: "/teacher/assignments" },
  { key: "library", label: "Library", icon: "bi bi-journal-bookmark-fill", path: "/teacher/library" },
];
