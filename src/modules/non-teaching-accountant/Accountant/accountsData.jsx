import { staffRoles, initialExpenses } from "./salaryData";

// ── Monthly time series for the dashboard charts ──
// (Non-Teaching Accountant build — expenses here are non-teaching staff salaries + expenses.)
export const monthlySeries = [
  { month: "Jan", income: 0, expenses: 55000, salary: 50000 },
  { month: "Feb", income: 0, expenses: 57000, salary: 52000 },
  { month: "Mar", income: 0, expenses: 59000, salary: 54000 },
  { month: "Apr", income: 0, expenses: 56000, salary: 51000 },
  { month: "May", income: 0, expenses: 54000, salary: 49000 },
  { month: "Jun", income: 0, expenses: 61000, salary: 56000 },
  { month: "Jul", income: 0, expenses: 63000, salary: 58000 },
];

// ── Recent transactions feed — non-teaching staff salary payments only ──
export const recentTransactions = [
  { id: "TXN-1008", date: "2026-07-17", name: "Sunita Devi", type: "Salary Payment", amount: 15000, method: "Cash", status: "Completed" },
  { id: "TXN-1012", date: "2026-07-14", name: "Mahesh Yadav", type: "Salary Payment", amount: 15000, method: "Cash", status: "Completed" },
];

export function getPersonCategory() {
  return "Non-Teaching";
}

// ── Aggregate stats used by the dashboard cards (derived from non-teaching salary + expense data) ──
export function getAccountStats() {
  const staffPaid = Object.values(staffRoles).reduce(
    (sum, role) => sum + role.rows.reduce((s, r) => s + r.paid, 0),
    0
  );
  const staffPending = Object.values(staffRoles).reduce(
    (sum, role) => sum + role.rows.reduce((s, r) => s + (r.salary - r.paid), 0),
    0
  );
  const expensesTotal = initialExpenses.reduce((s, r) => s + r.amount, 0);

  const totalExpenses = expensesTotal + staffPaid;

  return {
    totalIncome: 0,
    totalExpenses,
    netBalance: -totalExpenses,
    feeCollection: 0,
    pendingFees: 0,
    salaryPaid: staffPaid,
    pendingSalary: staffPending,
  };
}
