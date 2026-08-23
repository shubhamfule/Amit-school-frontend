// ============================================================
// Finance data source — migrated from amit-school-admin-finance.
// Swap these arrays/objects for real API calls when wiring up a backend.
// Figures are the same values the finance module already used;
// nothing here has been invented for the UI migration.
// ============================================================

export const financeOverview = {
  totalRevenue: 4820000,
  totalExpense: 3145000,
  studentFees: 3920000,
  teacherSalary: 1860000,
  nonTeachingSalary: 640000,
  libraryExpense: 128000,
  libraryDues: 42000,
  totalPending: 517000,
  netBalance: 1675000,
};

export const revenueVsExpense = [
  { month: 'Mar', revenue: 380000, expense: 260000 },
  { month: 'Apr', revenue: 410000, expense: 275000 },
  { month: 'May', revenue: 395000, expense: 268000 },
  { month: 'Jun', revenue: 452000, expense: 290000 },
  { month: 'Jul', revenue: 468000, expense: 305000 },
  { month: 'Aug', revenue: 512000, expense: 318000 },
];

export const monthlyFinanceTrend = [
  { month: 'Mar', net: 120000 },
  { month: 'Apr', net: 135000 },
  { month: 'May', net: 127000 },
  { month: 'Jun', net: 162000 },
  { month: 'Jul', net: 163000 },
  { month: 'Aug', net: 194000 },
];

export const recentTransactions = [
  { id: 'TXN-3021', name: 'Aarav Sharma', type: 'Student Fee', date: '07 Aug 2026', amount: 24000, status: 'Paid' },
  { id: 'TXN-3020', name: 'Priya Nair (Teacher)', type: 'Salary', date: '06 Aug 2026', amount: 48500, status: 'Paid' },
  { id: 'TXN-3019', name: 'City Power Co.', type: 'Electricity', date: '05 Aug 2026', amount: 32000, status: 'Paid' },
  { id: 'TXN-3018', name: 'Kavya Reddy', type: 'Student Fee', date: '05 Aug 2026', amount: 18000, status: 'Pending' },
  { id: 'TXN-3017', name: 'Library Vendor', type: 'Book Purchase', date: '04 Aug 2026', amount: 21500, status: 'Paid' },
  { id: 'TXN-3016', name: 'Rohan Housekeeping', type: 'Non-Teaching Salary', date: '03 Aug 2026', amount: 19500, status: 'Overdue' },
];

export const studentFinance = {
  summary: {
    feesCollected: 3920000,
    pendingFees: 385000,
    totalFeesDue: 4305000,
  },
  trend: [
    { month: 'Mar', collected: 610000 },
    { month: 'Apr', collected: 640000 },
    { month: 'May', collected: 598000 },
    { month: 'Jun', collected: 705000 },
    { month: 'Jul', collected: 690000 },
    { month: 'Aug', collected: 677000 },
  ],
  records: [
    { id: 'STU-2201', name: 'Aarav Sharma', grade: 'Grade 8-A', due: 24000, paid: 24000, status: 'Paid' },
    { id: 'STU-2202', name: 'Kavya Reddy', grade: 'Grade 6-C', due: 22000, paid: 4000, status: 'Pending' },
    { id: 'STU-2203', name: 'Ishaan Verma', grade: 'Grade 10-B', due: 26000, paid: 26000, status: 'Paid' },
    { id: 'STU-2204', name: 'Diya Kapoor', grade: 'Grade 4-A', due: 19000, paid: 0, status: 'Overdue' },
    { id: 'STU-2205', name: 'Vihaan Mehta', grade: 'Grade 9-D', due: 25000, paid: 25000, status: 'Paid' },
  ],
};

export const teacherFinance = {
  summary: {
    salaryPaid: 1860000,
    pendingSalary: 62000,
    totalSalary: 1922000,
  },
  trend: [
    { month: 'Mar', paid: 298000 },
    { month: 'Apr', paid: 302000 },
    { month: 'May', paid: 305000 },
    { month: 'Jun', paid: 310000 },
    { month: 'Jul', paid: 312000 },
    { month: 'Aug', paid: 315000 },
  ],
  records: [
    { id: 'TCH-101', name: 'Priya Nair', designation: 'Senior Teacher', dept: 'Mathematics', total: 48500, paid: 48500, pending: 0, status: 'Paid' },
    { id: 'TCH-102', name: 'Arjun Rao', designation: 'Teacher', dept: 'Science', total: 46200, paid: 46200, pending: 0, status: 'Paid' },
    { id: 'TCH-103', name: 'Sneha Iyer', designation: 'Teacher', dept: 'English', total: 44000, paid: 0, pending: 44000, status: 'Pending' },
    { id: 'TCH-104', name: 'Karan Malhotra', designation: 'Head of Department', dept: 'Social Studies', total: 45500, paid: 45500, pending: 0, status: 'Paid' },
    { id: 'TCH-105', name: 'Meera Joshi', designation: 'Senior Teacher', dept: 'Computer Science', total: 47800, paid: 47800, pending: 0, status: 'Paid' },
  ],
};

export const nonTeachingFinance = {
  summary: {
    salaryPaid: 640000,
    pendingSalary: 28000,
    totalSalary: 668000,
  },
  records: [
    { id: 'NTS-201', name: 'Rohan Gupta', role: 'Cleaner', salary: 19500, status: 'Overdue' },
    { id: 'NTS-202', name: 'Sunita Devi', role: 'Clerk', salary: 26500, status: 'Paid' },
    { id: 'NTS-203', name: 'Manoj Kumar', role: 'Security Guard', salary: 22000, status: 'Paid' },
    { id: 'NTS-204', name: 'Geeta Singh', role: 'Librarian', salary: 18500, status: 'Pending' },
    { id: 'NTS-205', name: 'Vikas Yadav', role: 'Driver', salary: 24000, status: 'Paid' },
  ],
};

export const libraryFinance = {
  summary: {
    libraryExpense: 128000,
    bookPurchaseExpense: 86000,
    duesCollected: 34500,
    pendingDues: 7500,
  },
  records: [
    { id: 'LIB-301', name: 'Reference Books Bundle', category: 'Book Purchase', amount: 32000, status: 'Paid' },
    { id: 'LIB-302', name: 'Ananya Singh — Fine', category: 'Dues Collected', amount: 300, status: 'Paid' },
    { id: 'LIB-303', name: 'Journal Subscriptions', category: 'Book Purchase', amount: 18500, status: 'Paid' },
    { id: 'LIB-304', name: 'Rehan Ali — Fine', category: 'Pending Dues', amount: 450, status: 'Pending' },
    { id: 'LIB-305', name: 'Shelving & Maintenance', category: 'Library Expense', amount: 12000, status: 'Paid' },
  ],
};

export const expensesData = {
  breakdown: [
    { name: 'Staff Salary', value: 2500000 },
    { name: 'Library Expense', value: 128000 },
    { name: 'Electricity / Utilities', value: 186000 },
    { name: 'Maintenance', value: 142000 },
    { name: 'Other Expenses', value: 189000 },
  ],
  records: [
    { id: 'EXP-501', category: 'Staff Salary', vendor: 'Payroll Batch #8', date: '01 Aug 2026', amount: 2500000, status: 'Paid' },
    { id: 'EXP-502', category: 'Electricity / Utilities', vendor: 'City Power Co.', date: '05 Aug 2026', amount: 32000, status: 'Paid' },
    { id: 'EXP-503', category: 'Maintenance', vendor: 'Campus Facilities Ltd', date: '06 Aug 2026', amount: 24500, status: 'Paid' },
    { id: 'EXP-504', category: 'Library Expense', vendor: 'Library Vendor', date: '04 Aug 2026', amount: 21500, status: 'Paid' },
    { id: 'EXP-505', category: 'Other Expenses', vendor: 'Sports Day Supplies', date: '08 Aug 2026', amount: 15800, status: 'Pending' },
  ],
};

export const reportsData = {
  revenueReport: [
    { source: 'Student Fees', amount: 3920000, share: '81%' },
    { source: 'Library Dues', amount: 42000, share: '1%' },
    { source: 'Other Income', amount: 858000, share: '18%' },
  ],
  expenseReport: [
    { source: 'Staff Salary', amount: 2500000, share: '79%' },
    { source: 'Utilities & Maintenance', amount: 328000, share: '10%' },
    { source: 'Library & Other', amount: 317000, share: '11%' },
  ],
  collectionSummary: [
    { period: 'Week 1', collected: 452000, pending: 38000 },
    { period: 'Week 2', collected: 468000, pending: 41000 },
    { period: 'Week 3', collected: 431000, pending: 52000 },
    { period: 'Week 4', collected: 512000, pending: 29000 },
  ],
};

export const formatINR = (value) => '₹' + value.toLocaleString('en-IN');

// Compact ₹ formatter for chart axes/tooltips, e.g. ₹4.8L / ₹42k
export const formatCompactINR = (value) => {
  if (Math.abs(value) >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (Math.abs(value) >= 1000) return `₹${(value / 1000).toFixed(0)}k`;
  return `₹${value}`;
};
