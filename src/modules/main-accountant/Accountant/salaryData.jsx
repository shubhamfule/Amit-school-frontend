// Seed data reproduced from the original static HTML tables.
// Each role config drives the generic <SalaryDashboard/> page.

export const staffRoles = {
  cleaner: {
    title: "Cleaner Salary Management",
    subtitle: "Amit Group of Schools | Non-teaching staff payroll",
    nameCol: "Cleaner Name",
    metaCol: "Area",
    paidLabel: "Paid Cleaners",
    rows: [
      { id: "CL001", name: "Sunita Devi", meta: "Main Building", salary: 15000, paid: 15000 },
      { id: "CL002", name: "Meena Sharma", meta: "Classrooms", salary: 16000, paid: 10000 },
      { id: "CL003", name: "Rani Patil", meta: "Library", salary: 14500, paid: 14500 },
      { id: "CL004", name: "Kavita Verma", meta: "Laboratory", salary: 15500, paid: 8000 },
    ],
  },
  clerk: {
    title: "Clerk Salary Management",
    subtitle: "Amit Group of Schools | Non-teaching staff payroll",
    nameCol: "Name",
    metaCol: "Department",
    paidLabel: "Paid Payment",
    rows: [
      { id: "C001", name: "Anil Sharama", meta: "Accounts", salary: 25000, paid: 25000 },
      { id: "C002", name: "Vijay Singh", meta: "Administration", salary: 22000, paid: 15000 },
      { id: "C003", name: "Rakesh Varma", meta: "Office", salary: 24000, paid: 24000 },
      { id: "C004", name: "Amrita Sharma", meta: "Administration", salary: 22000, paid: 15000 },
      { id: "C005", name: "Sanjay Patel", meta: "Accounts", salary: 23000, paid: 23000 },
      { id: "C006", name: "Raman Doge", meta: "Office", salary: 20000, paid: 14000 },
      { id: "C007", name: "Vijay Singh", meta: "Administration", salary: 22000, paid: 15000 },
    ],
  },
  driver: {
    title: "Drivers Salary Management",
    subtitle: "Amit Group of Schools | Non-teaching staff payroll",
    nameCol: "Driver Name",
    metaCol: "Vehicle",
    paidLabel: "Paid Payment",
    rows: [
      { id: "C001", name: "Anil Sharama", meta: "Bus No.2", salary: 18000, paid: 18000 },
      { id: "C002", name: "Vijay Singh", meta: "Bus No.1", salary: 18000, paid: 15000 },
    ],
  },
  peon: {
    title: "Peons Salary Management",
    subtitle: "Amit Group of Schools | Non-teaching staff payroll",
    nameCol: "Name",
    metaCol: "Department",
    paidLabel: "Paid Peons",
    rows: [
      { id: "P001", name: "Ganesh Rao", meta: "Office", salary: 16000, paid: 16000 },
      { id: "P002", name: "Ramesh Yadav", meta: "Administration", salary: 16000, paid: 10000 },
      { id: "P003", name: "Lata Patil", meta: "Library", salary: 14500, paid: 14500 },
      { id: "P004", name: "Mahesh Verma", meta: "Examination Hall", salary: 15500, paid: 8000 },
    ],
  },
  security: {
    title: "Security Guard Salary Management",
    subtitle: "Amit Group of Schools | Non-teaching staff payroll",
    nameCol: "Name",
    metaCol: "Department",
    paidLabel: "Paid Security Guards",
    rows: [
      { id: "SG001", name: "Mahesh Yadav", meta: "Day Shift", salary: 15000, paid: 15000 },
      { id: "SG002", name: "Vijay Sharma", meta: "Night Shift", salary: 15000, paid: 10000 },
      { id: "SG003", name: "Rani Patil", meta: "Day Shift", salary: 15000, paid: 15000 },
      { id: "SG004", name: "Karan Verma", meta: "Night Shift", salary: 15000, paid: 8000 },
    ],
  },
  librarian: {
    title: "Librarian Salary Management",
    subtitle: "Amit Group of Schools | Non-teaching staff payroll",
    nameCol: "Name",
    metaCol: "Department",
    paidLabel: "Paid Librarians",
    rows: [
      { id: "LB001", name: "Sneha Kulkarni", meta: "Main Library", salary: 20000, paid: 20000 },
      { id: "LB002", name: "Arvind Joshi", meta: "Junior Section Library", salary: 18000, paid: 12000 },
    ],
  },
};

// Human-readable designation label for each individual non-teaching role.
// The underlying role data above stays intact (per-role rows are still stored),
// but the UI only ever surfaces the unified "Non-Teaching" category — this label
// is shown as a plain data column, not as a separate tab/filter/page.
const nonTeachingDesignationLabels = {
  cleaner: "Cleaner",
  clerk: "Clerk",
  driver: "Driver",
  peon: "Peon",
  security: "Security Guard",
  librarian: "Librarian",
};

// ── Unified Non-Teaching staff list ──
// Merges every individual non-teaching role (Driver, Clerk, Cleaner, Peon, Security Guard, etc.)
// from staffRoles into a single flat list so the Non-Teaching module can show them all
// under one "Non-Teaching" category instead of separate role tabs/pages.
export const nonTeachingRows = Object.entries(staffRoles).flatMap(([roleKey, role]) =>
  role.rows.map((r) => ({
    id: r.id,
    key: `${roleKey}-${r.id}`,
    name: r.name,
    designation: nonTeachingDesignationLabels[roleKey] || roleKey,
    meta: r.meta,
    salary: r.salary,
    paid: r.paid,
  }))
);

export const teacherSalaryRows = [
  { id: "T001", name: "Anjali Deshmukh", designation: "Teacher", meta: "Mathematics · 9th", salary: 32000, paid: 32000 },
  { id: "T002", name: "Rohit Kulkarni", designation: "Teacher", meta: "Science · 8th", salary: 30000, paid: 18000 },
  { id: "T003", name: "Priya Nair", designation: "Teacher", meta: "English · 10th", salary: 34000, paid: 34000 },
  { id: "T004", name: "Suresh Iyer", designation: "Teacher", meta: "History · 7th", salary: 28000, paid: 14000 },
  { id: "T005", name: "Meghana Rao", designation: "Teacher", meta: "Computer Science · 9th", salary: 33000, paid: 33000 },
  { id: "T006", name: "Vikram Joshi", designation: "Teacher", meta: "Physical Education · 6th", salary: 27000, paid: 27000 },
  { id: "T007", name: "Sneha Patil", designation: "Senior Teacher", meta: "Marathi · 8th", salary: 29000, paid: 15000 },
  { id: "T008", name: "Arjun Menon", designation: "Teacher", meta: "Geography · 9th", salary: 30500, paid: 30500 },
  { id: "T009", name: "Kavita Bhosale", designation: "Teacher", meta: "Art & Craft · 5th", salary: 26000, paid: 13000 },
  { id: "T010", name: "Rahul Deshpande", designation: "Senior Teacher", meta: "Physics · 10th", salary: 35000, paid: 35000 },
  { id: "T011", name: "Neha Kulkarni", designation: "Teacher", meta: "Hindi · 7th", salary: 28500, paid: 28500 },
  { id: "T012", name: "Sandeep Wagh", designation: "Teacher", meta: "Sanskrit · 6th", salary: 27500, paid: 0 },
];

export const studentFeeRows = [
  { roll: "101", name: "Anjali Bhil", cls: "9th", total: 30000, paid: 30000 },
  { roll: "102", name: "Khushi Jais", cls: "8th", total: 28000, paid: 14000 },
  { roll: "103", name: "Vaidehi Bhimte", cls: "10th", total: 35000, paid: 35000 },
  { roll: "104", name: "Anuj Nemane", cls: "6th", total: 25000, paid: 14500 },
  { roll: "105", name: "Khushi Harne", cls: "9th", total: 30000, paid: 30000 },
  { roll: "106", name: "Pranay Doye", cls: "7th", total: 25000, paid: 14500 },
  { roll: "107", name: "Vinit Singh", cls: "8th", total: 30000, paid: 15000 },
];

// paymentStatus is intentionally not stored — it is always derived from whether
// paymentProof has been uploaded (see SchoolExpenses.jsx): Paid only once a
// receipt/proof file exists, otherwise Pending.
export const initialExpenses = [
  { date: "2026-06-18", expense: "Teacher Training Workshop", category: "Office", amount: 12000, mode: "Bank", paymentProof: null },
  { date: "2026-06-22", expense: "Staffroom Supplies", category: "Office", amount: 4000, mode: "Cash", paymentProof: null },
  { date: "2026-06-25", expense: "Teacher Conveyance Reimbursement", category: "Transport", amount: 3000, mode: "Cash", paymentProof: null },
  { date: "2026-06-21", expense: "Electricity Bill", category: "Utility", amount: 25000, mode: "Bank", paymentProof: null },
  { date: "2026-06-20", expense: "Cleaning Supplies", category: "Maintenance", amount: 6000, mode: "Cash", paymentProof: null },
  { date: "2026-06-24", expense: "Vehicle Fuel & Maintenance", category: "Transport", amount: 5000, mode: "Cash", paymentProof: null },
];
