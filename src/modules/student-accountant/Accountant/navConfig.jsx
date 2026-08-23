// Central navigation map — single source of truth for the sidebar
// and for which routes exist in the app.
// Student Accountant build — student admission, fee collection & student-only library.
export const navConfig = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: "bi bi-speedometer2",
    path: "/student-accountant",
  },
  {
    key: "admission",
    label: "Admission",
    icon: "bi bi-person-plus-fill",
    path: "/student-accountant/admission",
  },
  {
    key: "accounts",
    label: "Accountants",
    icon: "bi bi-cash-stack",
    children: [
      { label: "Students", icon: "bi bi-mortarboard", path: "/student-accountant/accounts/students" },
      { label: "Student Fee Collection", icon: "bi bi-wallet2", path: "/student-accountant/accounts/student-fee" },
      { label: "Reports", icon: "bi bi-bar-chart-line", path: "/student-accountant/accounts/reports" },
    ],
  },
  {
    key: "library",
    label: "Library",
    icon: "bi bi-book-fill",
    children: [
      { label: "Book Issue", icon: "bi bi-journal-plus", path: "/student-accountant/library/book-issue" },
      { label: "Book Return", icon: "bi bi-journal-check", path: "/student-accountant/library/book-return" },
      { label: "Fine Collection", icon: "bi bi-cash", path: "/student-accountant/library/fine-collection" },
      { label: "Library Clearance", icon: "bi bi-journal-x", path: "/student-accountant/library/clearance" },
    ],
  },
  {
    key: "events",
    label: "Events",
    icon: "bi bi-calendar-event-fill",
    path: "/student-accountant/events",
  },
  {
    key: "notices",
    label: "Notices",
    icon: "bi bi-megaphone-fill",
    path: "/student-accountant/notices",
  },
  {
    key: "settings",
    label: "Settings",
    icon: "bi bi-gear-fill",
    path: "/student-accountant/settings",
  },
];
