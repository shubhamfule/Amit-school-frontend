export const admissionTrend = [
  { month: "Jan", admissions: 12 },
  { month: "Feb", admissions: 18 },
  { month: "Mar", admissions: 22 },
  { month: "Apr", admissions: 15 },
  { month: "May", admissions: 10 },
  { month: "Jun", admissions: 26 },
  { month: "Jul", admissions: 31 },
];

export const attendanceToday = { present: 812, absent: 58, onLeave: 24 };

export const students = [
  { id: "STU-101", name: "Anjali Bhil", class: "9th", admissionDate: "2026-06-02", status: "Active", gender: "Female" },
  { id: "STU-102", name: "Khushi Jais", class: "8th", admissionDate: "2026-06-05", status: "Active", gender: "Female" },
  { id: "STU-103", name: "Vaidehi Bhimte", class: "10th", admissionDate: "2026-06-10", status: "Active", gender: "Female" },
  { id: "STU-104", name: "Anuj Nemane", class: "6th", admissionDate: "2026-06-14", status: "Pending", gender: "Male" },
  { id: "STU-105", name: "Khushi Harne", class: "9th", admissionDate: "2026-06-18", status: "Active", gender: "Female" },
  { id: "STU-106", name: "Pranay Doye", class: "7th", admissionDate: "2026-07-01", status: "Active", gender: "Male" },
  { id: "STU-107", name: "Vinit Singh", class: "8th", admissionDate: "2026-07-08", status: "Pending", gender: "Male" },
  { id: "STU-108", name: "Ishaan Rao", class: "10th", admissionDate: "2026-07-15", status: "Active", gender: "Male" },
];

export const teachers = [
  { id: "T001", name: "Anjali Deshmukh", subject: "Mathematics", classAssigned: "9th", status: "Active", email: "anjali.deshmukh@amitschools.edu" },
  { id: "T002", name: "Rohit Kulkarni", subject: "Science", classAssigned: "8th", status: "On Leave", email: "rohit.kulkarni@amitschools.edu" },
  { id: "T003", name: "Priya Nair", subject: "English", classAssigned: "10th", status: "Active", email: "priya.nair@amitschools.edu" },
  { id: "T004", name: "Suresh Iyer", subject: "History", classAssigned: "7th", status: "Active", email: "suresh.iyer@amitschools.edu" },
  { id: "T005", name: "Meghana Rao", subject: "Computer Science", classAssigned: "9th", status: "Active", email: "meghana.rao@amitschools.edu" },
];

export const classes = [
  { id: "CLS-1", name: "Class 6th", sections: "A, B", classTeacher: "Suresh Iyer", students: 42 },
  { id: "CLS-2", name: "Class 7th", sections: "A, B", classTeacher: "Suresh Iyer", students: 39 },
  { id: "CLS-3", name: "Class 8th", sections: "A, B, C", classTeacher: "Rohit Kulkarni", students: 58 },
  { id: "CLS-4", name: "Class 9th", sections: "A, B", classTeacher: "Anjali Deshmukh", students: 45 },
  { id: "CLS-5", name: "Class 10th", sections: "A, B", classTeacher: "Priya Nair", students: 40 },
];

export const notices = [
  { id: 1, title: "Half-yearly exam schedule released", date: "2026-07-21", audience: "All Classes" },
  { id: 2, title: "PTA meeting on 28th July", date: "2026-07-20", audience: "Parents" },
  { id: 3, title: "Annual sports day registrations open", date: "2026-07-18", audience: "All Classes" },
  { id: 4, title: "Library books due for return", date: "2026-07-17", audience: "9th & 10th" },
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
  { id: "STU-105", name: "Khushi Harne", role: "Student · 9th" },
  { id: "T004", name: "Suresh Iyer", role: "Teacher · History" },
];
