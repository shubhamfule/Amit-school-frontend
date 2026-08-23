// Seed data for the Attendance Management module.
// Teaching staff use an ID pill (T001…); non-teaching staff use the same
// role-based IDs (CL001, C001, P001, SG001, LB001…) as salaryData.jsx so the
// IDs stay consistent with the Non-Teaching Staff records used elsewhere.

export const teachingStaff = [
  { id: "T001", name: "Anjali Deshmukh", role: "Teacher", subject: "Mathematics", section: "9th" },
  { id: "T002", name: "Rohit Kulkarni", role: "Teacher", subject: "Science", section: "8th" },
  { id: "T003", name: "Priya Nair", role: "Teacher", subject: "English", section: "10th" },
  { id: "T004", name: "Suresh Iyer", role: "Teacher", subject: "History", section: "7th" },
  { id: "T005", name: "Meghana Rao", role: "Teacher", subject: "Computer Science", section: "9th" },
  { id: "T006", name: "Vikram Joshi", role: "Teacher", subject: "Physical Education", section: "6th" },
  { id: "T007", name: "Sneha Patil", role: "Senior Teacher", subject: "Marathi", section: "8th" },
  { id: "T008", name: "Arjun Menon", role: "Teacher", subject: "Geography", section: "9th" },
  { id: "T009", name: "Kavita Bhosale", role: "Teacher", subject: "Art & Craft", section: "5th" },
  { id: "T010", name: "Rahul Deshpande", role: "Senior Teacher", subject: "Physics", section: "10th" },
  { id: "T011", name: "Neha Kulkarni", role: "Teacher", subject: "Hindi", section: "7th" },
  { id: "T012", name: "Sandeep Wagh", role: "Teacher", subject: "Sanskrit", section: "6th" },
];

// Note: "id" is the display ID exactly as it appears in the Non-Teaching Staff
// salary records (salaryData.jsx) — role prefixes (CL/C/P/SG/LB) repeat across
// roles there (e.g. Clerk C001 and Driver C001 are different people), so a
// separate unique "key" is kept alongside for React list keys and attendance
// mark storage.
export const nonTeachingStaff = [
  { key: "nt-1", id: "CL001", name: "Sunita Devi", role: "Cleaner", dept: "Main Building" },
  { key: "nt-2", id: "CL002", name: "Meena Sharma", role: "Cleaner", dept: "Classrooms" },
  { key: "nt-3", id: "CL003", name: "Rani Patil", role: "Cleaner", dept: "Library" },
  { key: "nt-4", id: "CL004", name: "Kavita Verma", role: "Cleaner", dept: "Laboratory" },
  { key: "nt-5", id: "C001", name: "Anil Sharama", role: "Clerk", dept: "Accounts" },
  { key: "nt-6", id: "C002", name: "Vijay Singh", role: "Clerk", dept: "Administration" },
  { key: "nt-7", id: "C003", name: "Rakesh Varma", role: "Clerk", dept: "Office" },
  { key: "nt-8", id: "C004", name: "Amrita Sharma", role: "Clerk", dept: "Administration" },
  { key: "nt-9", id: "C005", name: "Sanjay Patel", role: "Clerk", dept: "Accounts" },
  { key: "nt-10", id: "C006", name: "Raman Doge", role: "Clerk", dept: "Office" },
  { key: "nt-11", id: "C007", name: "Vijay Singh", role: "Clerk", dept: "Administration" },
  { key: "nt-12", id: "C001", name: "Anil Sharama", role: "Driver", dept: "Bus No.2" },
  { key: "nt-13", id: "C002", name: "Vijay Singh", role: "Driver", dept: "Bus No.1" },
  { key: "nt-14", id: "P001", name: "Ganesh Rao", role: "Peon", dept: "Office" },
  { key: "nt-15", id: "P002", name: "Ramesh Yadav", role: "Peon", dept: "Administration" },
  { key: "nt-16", id: "P003", name: "Lata Patil", role: "Peon", dept: "Library" },
  { key: "nt-17", id: "P004", name: "Mahesh Verma", role: "Peon", dept: "Examination Hall" },
  { key: "nt-18", id: "SG001", name: "Mahesh Yadav", role: "Security Guard", dept: "Day Shift" },
  { key: "nt-19", id: "SG002", name: "Vijay Sharma", role: "Security Guard", dept: "Night Shift" },
  { key: "nt-20", id: "SG003", name: "Rani Patil", role: "Security Guard", dept: "Day Shift" },
  { key: "nt-21", id: "SG004", name: "Karan Verma", role: "Security Guard", dept: "Night Shift" },
  { key: "nt-22", id: "LB001", name: "Sneha Kulkarni", role: "Librarian", dept: "Main Library" },
  { key: "nt-23", id: "LB002", name: "Arvind Joshi", role: "Librarian", dept: "Junior Section Library" },
];
