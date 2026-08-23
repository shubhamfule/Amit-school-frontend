import { staffRoles, teacherSalaryRows, studentFeeRows, initialExpenses } from "./salaryData";

// ── Monthly time series for the dashboard charts ──
// (Income = fees collected, Expenses = salaries + operating expenses, feeCollection = fees collected that month)
export const monthlySeries = [
  { month: "Jan", income: 182000, expenses: 146000, feeCollection: 168000 },
  { month: "Feb", income: 196000, expenses: 151000, feeCollection: 174000 },
  { month: "Mar", income: 205000, expenses: 158000, feeCollection: 188000 },
  { month: "Apr", income: 178000, expenses: 149000, feeCollection: 162000 },
  { month: "May", income: 168000, expenses: 144000, feeCollection: 150000 },
  { month: "Jun", income: 214000, expenses: 162000, feeCollection: 201000 },
  { month: "Jul", income: 224000, expenses: 167000, feeCollection: 210000 },
];

// ── Unified recent transactions feed (fees + salaries + expenses) ──
export const recentTransactions = [
  { id: "TXN-1001", date: "2026-07-20", name: "Anjali Bhil", type: "Fee Collection", amount: 30000, method: "Online", status: "Completed" },
  { id: "TXN-1002", date: "2026-07-20", name: "Anjali Deshmukh", type: "Salary Payment", amount: 32000, method: "Bank Transfer", status: "Completed" },
  { id: "TXN-1003", date: "2026-07-19", name: "Electricity Bill", type: "Expense", amount: 25000, method: "Bank Transfer", status: "Completed" },
  { id: "TXN-1004", date: "2026-07-19", name: "Khushi Jais", type: "Fee Collection", amount: 14000, method: "Cash", status: "Pending" },
  { id: "TXN-1005", date: "2026-07-18", name: "Rohit Kulkarni", type: "Salary Payment", amount: 18000, method: "Bank Transfer", status: "Pending" },
  { id: "TXN-1006", date: "2026-07-18", name: "Stationery", type: "Expense", amount: 15000, method: "Cash", status: "Pending" },
  { id: "TXN-1007", date: "2026-07-17", name: "Vaidehi Bhimte", type: "Fee Collection", amount: 35000, method: "UPI", status: "Completed" },
  { id: "TXN-1008", date: "2026-07-17", name: "Sunita Devi", type: "Salary Payment", amount: 15000, method: "Cash", status: "Completed" },
  { id: "TXN-1009", date: "2026-07-16", name: "Petrol", type: "Expense", amount: 2000, method: "Cash", status: "Pending" },
  { id: "TXN-1010", date: "2026-07-16", name: "Anuj Nemane", type: "Fee Collection", amount: 14500, method: "Online", status: "Pending" },
  { id: "TXN-1011", date: "2026-07-15", name: "Priya Nair", type: "Salary Payment", amount: 34000, method: "Bank Transfer", status: "Completed" },
  { id: "TXN-1012", date: "2026-07-14", name: "Mahesh Yadav", type: "Salary Payment", amount: 15000, method: "Cash", status: "Completed" },
];

// ── Category lookups (Teacher / Student / Non-Teaching) derived from existing module data ──
// Individual non-teaching roles (Driver, Clerk, Cleaner, Peon, Security Guard, etc.) are kept
// intact in staffRoles for storage/reporting, but are unified into a single "Non-Teaching"
// category everywhere they are shown in the Accountant Dashboard.
const teacherNames = new Set(teacherSalaryRows.map((r) => r.name));
const studentNames = new Set(studentFeeRows.map((r) => r.name));
const nonTeachingNames = new Set(
  Object.values(staffRoles).flatMap((role) => role.rows.map((r) => r.name))
);

export function getPersonCategory(t) {
  if (studentNames.has(t.name)) return "Student";
  if (teacherNames.has(t.name)) return "Teacher";
  if (nonTeachingNames.has(t.name)) return "Non-Teaching";
  if (t.type === "Fee Collection") return "Student";
  if (t.type === "Salary Payment") return "Non-Teaching";
  return "Non-Teaching";
}

// ── Aggregate stats used by the dashboard cards (derived from existing module data) ──
export function getAccountStats() {
  const feeCollected = studentFeeRows.reduce((s, r) => s + r.paid, 0);
  const feePending = studentFeeRows.reduce((s, r) => s + (r.total - r.paid), 0);

  const teacherPaid = teacherSalaryRows.reduce((s, r) => s + r.paid, 0);
  const teacherPending = teacherSalaryRows.reduce((s, r) => s + (r.salary - r.paid), 0);

  const staffPaid = Object.values(staffRoles).reduce(
    (sum, role) => sum + role.rows.reduce((s, r) => s + r.paid, 0),
    0
  );
  const staffPending = Object.values(staffRoles).reduce(
    (sum, role) => sum + role.rows.reduce((s, r) => s + (r.salary - r.paid), 0),
    0
  );

  const expensesTotal = initialExpenses.reduce((s, r) => s + r.amount, 0);

  const salaryPaid = teacherPaid + staffPaid;
  const salaryPending = teacherPending + staffPending;

  const totalIncome = feeCollected;
  const totalExpenses = expensesTotal + salaryPaid;
  const netBalance = totalIncome - totalExpenses;

  return {
    totalIncome,
    totalExpenses,
    netBalance,
    feeCollection: feeCollected,
    pendingFees: feePending,
    salaryPaid,
    pendingSalary: salaryPending,
  };
}
