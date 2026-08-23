// Central navigation map — single source of truth for the sidebar
// and for which routes exist in the app.
// Non-Teaching Accountant build — non-teaching staff admission, salary & expenses.
export const navConfig = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: "bi bi-speedometer2",
    path: "/non-teaching-accountant",
  },
  {
    key: "admission",
    label: "Admission",
    icon: "bi bi-people-fill",
    path: "/non-teaching-accountant/admission/non-teaching",
  },
  {
    key: "accounts",
    label: "Accounts",
    icon: "bi bi-cash-stack",
    children: [
      { label: "Non-Teaching Staff", icon: "bi bi-person-lines-fill", path: "/non-teaching-accountant/accounts/staff/directory" },
      { label: "Non-Teaching Staff Salary", icon: "bi bi-cash-coin", path: "/non-teaching-accountant/accounts/staff/non-teaching" },
      { label: "Non-Teaching Expenses", icon: "bi bi-receipt", path: "/non-teaching-accountant/accounts/expenses" },
      { label: "Reports", icon: "bi bi-bar-chart-line", path: "/non-teaching-accountant/accounts/reports" },
    ],
  },
  {
    key: "attendance",
    label: "Attendance",
    icon: "bi bi-calendar2-check",
    path: "/non-teaching-accountant/attendance",
  },
  {
    key: "leave-applications",
    label: "Leave Application",
    icon: "bi bi-file-earmark-text-fill",
    path: "/non-teaching-accountant/leave-applications",
  },
  {
    key: "events",
    label: "Events",
    icon: "bi bi-calendar-event-fill",
    path: "/non-teaching-accountant/events",
  },
  {
    key: "notices",
    label: "Notices",
    icon: "bi bi-megaphone-fill",
    path: "/non-teaching-accountant/notices",
  },
  {
    key: "settings",
    label: "Settings",
    icon: "bi bi-gear-fill",
    path: "/non-teaching-accountant/settings",
  },
];
