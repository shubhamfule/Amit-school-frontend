// Central navigation map — single source of truth for the sidebar
// and for which routes exist in the app.
// Teaching Accountant build — teaching staff admission, salary & expenses.
export const navConfig = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: "bi bi-speedometer2",
    path: "/teaching-accountant",
  },
  {
    key: "admission",
    label: "Admission",
    icon: "bi bi-people-fill",
    path: "/teaching-accountant/admission/teaching",
  },
  {
    key: "accounts",
    label: "Accounts",
    icon: "bi bi-cash-stack",
    children: [
      { label: "Teaching Staff", icon: "bi bi-person-lines-fill", path: "/teaching-accountant/accounts/staff/directory" },
      { label: "Teaching Staff Salary", icon: "bi bi-cash-coin", path: "/teaching-accountant/accounts/staff/teaching" },
      { label: "Teaching Expenses", icon: "bi bi-receipt", path: "/teaching-accountant/accounts/expenses" },
      { label: "Reports", icon: "bi bi-bar-chart-line", path: "/teaching-accountant/accounts/reports" },
    ],
  },
  {
    key: "library",
    label: "Library",
    icon: "bi bi-journal-bookmark-fill",
    children: [
      { label: "Book Issue", icon: "bi bi-journal-plus", path: "/teaching-accountant/library/book-issue" },
      { label: "Book Return", icon: "bi bi-journal-check", path: "/teaching-accountant/library/book-return" },
      { label: "Fine Collection", icon: "bi bi-cash-coin", path: "/teaching-accountant/library/fine-collection" },
      { label: "Library Clearance", icon: "bi bi-clipboard2-check", path: "/teaching-accountant/library/clearance" },
    ],
  },
  {
    key: "attendance",
    label: "Attendance",
    icon: "bi bi-calendar2-check",
    path: "/teaching-accountant/attendance",
  },
  {
    key: "leave-applications",
    label: "Leave Application",
    icon: "bi bi-file-earmark-text-fill",
    path: "/teaching-accountant/leave-applications",
  },
  {
    key: "events",
    label: "Events",
    icon: "bi bi-calendar-event-fill",
    path: "/teaching-accountant/events",
  },
  {
    key: "notices",
    label: "Notices",
    icon: "bi bi-megaphone-fill",
    path: "/teaching-accountant/notices",
  },
  {
    key: "settings",
    label: "Settings",
    icon: "bi bi-gear-fill",
    path: "/teaching-accountant/settings",
  },
];
