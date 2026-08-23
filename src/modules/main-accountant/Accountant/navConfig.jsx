// Central navigation map — single source of truth for the sidebar
// and for which routes exist in the app.
export const navConfig = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: "bi bi-speedometer2",
    path: "/main-accountant",
  },
  {
    key: "admission",
    label: "Admission",
    icon: "bi bi-people-fill",
    children: [
      { label: "Teaching Staff", icon: "bi bi-person-badge", path: "/main-accountant/admission/teaching" },
      { label: "Non-Teaching Staff", icon: "bi bi-person-workspace", path: "/main-accountant/admission/non-teaching" },
      { label: "Students", icon: "bi bi-mortarboard", path: "/main-accountant/admission/students" },
    ],
  },
  {
    key: "accounts",
    label: "Accounts",
    icon: "bi bi-cash-stack",
    children: [
      { label: "Accountant Dashboard", icon: "bi bi-graph-up-arrow", path: "/main-accountant/accounts/dashboard" },
      { label: "Student Fee Collection", icon: "bi bi-wallet2", path: "/main-accountant/accounts/student-fee" },
      { label: "Teacher Salary", icon: "bi bi-cash-coin", path: "/main-accountant/accounts/teacher-salary" },
      { label: "Non-Teaching Staff", icon: "bi bi-person-lines-fill", path: "/main-accountant/accounts/staff/non-teaching" },
      { label: "School Expenses", icon: "bi bi-receipt", path: "/main-accountant/accounts/expenses" },
      { label: "Reports", icon: "bi bi-bar-chart-line", path: "/main-accountant/accounts/reports" },
    ],
  },
  {
    key: "attendance",
    label: "Attendance",
    icon: "bi bi-clipboard2-check",
    path: "/main-accountant/attendance",
  },
  {
    key: "leave-application",
    label: "Leave Application",
    icon: "bi bi-file-earmark-text",
    path: "/main-accountant/leave-application",
  },
  {
    key: "library",
    label: "Library",
    icon: "bi bi-book-fill",
    children: [
      { label: "Book Issue", icon: "bi bi-journal-plus", path: "/main-accountant/library/book-issue" },
      { label: "Book Return", icon: "bi bi-journal-check", path: "/main-accountant/library/book-return" },
      { label: "Fine Collection", icon: "bi bi-cash", path: "/main-accountant/library/fine-collection" },
      { label: "Library Clearance", icon: "bi bi-journal-x", path: "/main-accountant/library/clearance" },
    ],
  },
  {
    key: "events",
    label: "Events",
    icon: "bi bi-calendar-event-fill",
    path: "/main-accountant/events",
  },
  {
    key: "notices",
    label: "Notices",
    icon: "bi bi-megaphone-fill",
    path: "/main-accountant/notices",
  },
  {
    key: "settings",
    label: "Settings",
    icon: "bi bi-gear-fill",
    path: "/main-accountant/settings",
  },
];
