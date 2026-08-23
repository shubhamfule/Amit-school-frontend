import { useMemo, useState } from "react";
import PageHeader from "./PageHeader";
import LiveClock from "./LiveClock";
import StatCard from "./StatCard";
import ChartCard, { palette } from "./ChartCard";
import ExportButtons from "./ExportButtons";
import { getAccountStats, getPersonCategory, monthlySeries, recentTransactions } from "./accountsData";

const inr = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

const txnColumns = [
  { header: "Date", key: "date" },
  { header: "Name", key: "name" },
  { header: "Type", key: "type" },
  { header: "Category", key: "category" },
  { header: "Amount", key: "amountLabel" },
  { header: "Payment Method", key: "method" },
  { header: "Status", key: "status" },
];

export default function AccountantDashboard() {
  const stats = getAccountStats();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filtered = useMemo(() => {
    return recentTransactions.filter((t) => {
      const category = getPersonCategory(t);
      const matchesSearch = t.name.toLowerCase().includes(search.trim().toLowerCase());
      const matchesType = typeFilter === "all" || t.type === typeFilter;
      const matchesStatus = statusFilter === "all" || t.status === statusFilter;
      const matchesCategory = categoryFilter === "all" || category === categoryFilter;
      return matchesSearch && matchesType && matchesStatus && matchesCategory;
    });
  }, [search, typeFilter, statusFilter, categoryFilter]);

  const exportRows = filtered.map((t) => ({ ...t, category: getPersonCategory(t), amountLabel: inr(t.amount) }));

  return (
    <div>
      <PageHeader title="Accountant Dashboard" subtitle="Amit Group of Schools | Financial overview" />
      <LiveClock />

      <div className="row-cards" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
        <StatCard label="Total Income" value={stats.totalIncome} />
        <StatCard label="Total Expenses" value={stats.totalExpenses} />
        <StatCard label="Net Balance" value={stats.netBalance} />
        <StatCard label="Fee Collection" value={stats.feeCollection} />
        <StatCard label="Pending Fees" value={stats.pendingFees} />
        <StatCard label="Salary Paid" value={stats.salaryPaid} />
        <StatCard label="Pending Salary" value={stats.pendingSalary} />
      </div>

      <div className="chart-grid">
        <ChartCard
          title="Monthly Income"
          subtitle="Fee & other income collected per month"
          type="line"
          data={monthlySeries}
          dataKeys={[{ key: "income", label: "Income", color: palette.green }]}
        />
        <ChartCard
          title="Monthly Expenses"
          subtitle="Salaries + operating expenses per month"
          type="line"
          data={monthlySeries}
          dataKeys={[{ key: "expenses", label: "Expenses", color: palette.red || palette.pink }]}
        />
        <ChartCard
          title="Fee Collection"
          subtitle="Student fee collected per month"
          type="bar"
          data={monthlySeries}
          dataKeys={[{ key: "feeCollection", label: "Fee Collection", color: palette.purple }]}
        />
      </div>

      <div className="toolbar-row">
        <div className="filters-row" style={{ maxWidth: 640 }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="form-control" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="all">All Types</option>
            <option value="Fee Collection">Fee Collection</option>
            <option value="Salary Payment">Salary Payment</option>
            <option value="Expense">Expense</option>
          </select>
          <select className="form-control" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
          </select>
          <select className="form-control" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="Teacher">Teacher</option>
            <option value="Student">Student</option>
            <option value="Non-Teaching">Non-Teaching</option>
          </select>
        </div>
        <ExportButtons title="Recent Transactions" columns={txnColumns} rows={exportRows} filename="recent-transactions" />
      </div>

      <div className="table-wrap">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Date</th><th>Name</th><th>Type</th><th>Category</th><th>Amount</th><th>Payment Method</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: "center", padding: 24, color: "var(--text-muted)" }}>No transactions found.</td></tr>
            )}
            {filtered.map((t) => (
              <tr key={t.id}>
                <td>{t.date}</td>
                <td>{t.name}</td>
                <td>{t.type}</td>
                <td>{getPersonCategory(t)}</td>
                <td>{inr(t.amount)}</td>
                <td>{t.method}</td>
                <td>
                  <span className={t.status === "Completed" ? "badge-paid" : "badge-pending"}>{t.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
