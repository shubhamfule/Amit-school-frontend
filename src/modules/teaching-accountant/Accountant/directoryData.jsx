export const teachers = [
  { id: "T001", name: "Anjali Deshmukh", subject: "Mathematics", classAssigned: "9th", status: "Active", email: "anjali.deshmukh@amitschools.edu" },
  { id: "T002", name: "Rohit Kulkarni", subject: "Science", classAssigned: "8th", status: "On Leave", email: "rohit.kulkarni@amitschools.edu" },
  { id: "T003", name: "Priya Nair", subject: "English", classAssigned: "10th", status: "Active", email: "priya.nair@amitschools.edu" },
  { id: "T004", name: "Suresh Iyer", subject: "History", classAssigned: "7th", status: "Active", email: "suresh.iyer@amitschools.edu" },
  { id: "T005", name: "Meghana Rao", subject: "Computer Science", classAssigned: "9th", status: "Active", email: "meghana.rao@amitschools.edu" },
  { id: "T006", name: "Vikram Joshi", subject: "Physical Education", classAssigned: "6th", status: "Active", email: "vikram.joshi@amitschools.edu" },
  { id: "T007", name: "Sneha Patil", subject: "Marathi", classAssigned: "8th", status: "Active", email: "sneha.patil@amitschools.edu" },
  { id: "T008", name: "Arjun Menon", subject: "Geography", classAssigned: "9th", status: "Active", email: "arjun.menon@amitschools.edu" },
  { id: "T009", name: "Kavita Bhosale", subject: "Art & Craft", classAssigned: "5th", status: "On Leave", email: "kavita.bhosale@amitschools.edu" },
  { id: "T010", name: "Rahul Deshpande", subject: "Physics", classAssigned: "10th", status: "Active", email: "rahul.deshpande@amitschools.edu" },
  { id: "T011", name: "Neha Kulkarni", subject: "Hindi", classAssigned: "7th", status: "Active", email: "neha.kulkarni@amitschools.edu" },
  { id: "T012", name: "Sandeep Wagh", subject: "Sanskrit", classAssigned: "6th", status: "Active", email: "sandeep.wagh@amitschools.edu" },
];

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

export const teachersOnLeave = [
  { id: "T002", name: "Rohit Kulkarni", subject: "Science", from: "2026-07-22", to: "2026-07-24" },
];

export const birthdaysToday = [
  { id: "T004", name: "Suresh Iyer", role: "Teacher · History" },
];

// Leave applications submitted by Teaching staff — shown on the Dashboard
// directly below Upcoming Events, and cross-checked against Attendance.
export const leaveApplications = [
  { id: "LA-T01", employeeId: "T002", employeeName: "Rohit Kulkarni", leaveType: "Sick Leave", from: "2026-07-22", to: "2026-07-24", reason: "Fever and viral infection", status: "Approved" },
  { id: "LA-T02", employeeId: "T004", employeeName: "Suresh Iyer", leaveType: "Casual Leave", from: "2026-08-10", to: "2026-08-11", reason: "Family function", status: "Pending" },
  { id: "LA-T03", employeeId: "T001", employeeName: "Anjali Deshmukh", leaveType: "Earned Leave", from: "2026-07-05", to: "2026-07-06", reason: "Personal work", status: "Rejected" },
];
