import { studentFeeRows } from "./salaryData";

// ── Monthly time series for the dashboard charts ──
// (Student Accountant build — income here is student fee collection only.)
export const monthlySeries = [
  { month: "Jan", income: 168000, expenses: 0, feeCollection: 168000 },
  { month: "Feb", income: 174000, expenses: 0, feeCollection: 174000 },
  { month: "Mar", income: 188000, expenses: 0, feeCollection: 188000 },
  { month: "Apr", income: 162000, expenses: 0, feeCollection: 162000 },
  { month: "May", income: 150000, expenses: 0, feeCollection: 150000 },
  { month: "Jun", income: 201000, expenses: 0, feeCollection: 201000 },
  { month: "Jul", income: 210000, expenses: 0, feeCollection: 210000 },
];

// ── Recent transactions feed — student fee collections only ──
export const recentTransactions = [
  { id: "TXN-1001", date: "2026-07-20", name: "Anjali Bhil", cls: "9th", type: "Fee Collection", amount: 30000, method: "Online", status: "Completed" },
  { id: "TXN-1004", date: "2026-07-19", name: "Khushi Jais", cls: "8th", type: "Fee Collection", amount: 14000, method: "", status: "Pending" },
  { id: "TXN-1007", date: "2026-07-17", name: "Vaidehi Bhimte", cls: "10th", type: "Fee Collection", amount: 35000, method: "UPI", status: "Completed" },
  { id: "TXN-1010", date: "2026-07-16", name: "Anuj Nemane", cls: "6th", type: "Fee Collection", amount: 14500, method: "", status: "Pending" },
  { id: "TXN-1013", date: "2026-07-15", name: "Riya Solanke", cls: "Nursery", type: "Fee Collection", amount: 12000, method: "Cash", status: "Completed" },
  { id: "TXN-1014", date: "2026-07-15", name: "Aarav Kadam", cls: "LKG", type: "Fee Collection", amount: 13000, method: "", status: "Pending" },
  { id: "TXN-1015", date: "2026-07-14", name: "Sanika Pawar", cls: "UKG", type: "Fee Collection", amount: 13500, method: "UPI", status: "Completed" },
  { id: "TXN-1016", date: "2026-07-14", name: "Om Deshmukh", cls: "1st", type: "Fee Collection", amount: 15000, method: "", status: "Pending" },
  { id: "TXN-1017", date: "2026-07-13", name: "Sakshi Rathod", cls: "2nd", type: "Fee Collection", amount: 15500, method: "Online", status: "Completed" },
  { id: "TXN-1018", date: "2026-07-13", name: "Yash Chavhan", cls: "3rd", type: "Fee Collection", amount: 16000, method: "", status: "Pending" },
  { id: "TXN-1019", date: "2026-07-12", name: "Prisha Mane", cls: "4th", type: "Fee Collection", amount: 17000, method: "Cash", status: "Completed" },
  { id: "TXN-1020", date: "2026-07-12", name: "Aditya Shelke", cls: "5th", type: "Fee Collection", amount: 18000, method: "", status: "Pending" },
  { id: "TXN-1021", date: "2026-07-11", name: "Ishita Gaikwad", cls: "7th", type: "Fee Collection", amount: 26000, method: "UPI", status: "Completed" },
  { id: "TXN-1022", date: "2026-07-11", name: "Kartik Jadhav", cls: "9th", type: "Fee Collection", amount: 29000, method: "", status: "Pending" },
];

export function getPersonCategory() {
  return "Student";
}

// ── Aggregate stats used by the dashboard cards (derived from student fee data) ──
export function getAccountStats() {
  const feeCollected = studentFeeRows.reduce((s, r) => s + r.paid, 0);
  const feePending = studentFeeRows.reduce((s, r) => s + (r.total - r.paid), 0);

  return {
    totalIncome: feeCollected,
    totalExpenses: 0,
    netBalance: feeCollected,
    feeCollection: feeCollected,
    pendingFees: feePending,
    salaryPaid: 0,
    pendingSalary: 0,
  };
}
