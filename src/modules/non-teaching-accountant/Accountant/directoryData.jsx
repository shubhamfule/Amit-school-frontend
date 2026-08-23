export const notices = [
  { id: 1, title: "Half-yearly exam schedule released", date: "2026-07-21", audience: "All Classes" },
  { id: 2, title: "PTA meeting on 28th July", date: "2026-07-20", audience: "Parents" },
  { id: 3, title: "Annual sports day registrations open", date: "2026-07-18", audience: "All Classes" },
];

export const upcomingEvents = [
  { id: 1, title: "Independence Day Celebration", date: "2026-08-15" },
  { id: 2, title: "Parent-Teacher Meeting", date: "2026-07-28" },
  { id: 3, title: "Science Exhibition", date: "2026-08-05" },
];

// Leave applications submitted by Non-Teaching staff — shown on the Dashboard
// directly below Upcoming Events, and cross-checked against Attendance.
export const leaveApplications = [
  { id: "LA-N01", employeeId: "CL002", employeeName: "Meena Sharma", leaveType: "Sick Leave", from: "2026-07-20", to: "2026-07-21", reason: "Fever", status: "Approved" },
  { id: "LA-N02", employeeId: "P002", employeeName: "Ramesh Yadav", leaveType: "Casual Leave", from: "2026-08-09", to: "2026-08-09", reason: "Personal work", status: "Pending" },
  { id: "LA-N03", employeeId: "SG002", employeeName: "Vijay Sharma", leaveType: "Earned Leave", from: "2026-07-15", to: "2026-07-16", reason: "Family function", status: "Rejected" },
];
