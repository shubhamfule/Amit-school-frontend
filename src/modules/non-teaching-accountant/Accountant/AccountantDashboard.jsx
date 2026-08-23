import PageHeader from "./PageHeader";
import LiveClock from "./LiveClock";
import StatCard from "./StatCard";
import ChartCard, { palette } from "./ChartCard";
import { getAccountStats, monthlySeries } from "./accountsData";

export default function AccountantDashboard() {
  const stats = getAccountStats();

  return (
    <div>
      <PageHeader title="Non-Teaching Accountant Dashboard" subtitle="Amit Group of Schools | Non-teaching staff financial overview" />
      <LiveClock />

      <div className="row-cards" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
        <StatCard label="Total Expenses" value={stats.totalExpenses} />
        <StatCard label="Salary Paid" value={stats.salaryPaid} />
        <StatCard label="Pending Salary" value={stats.pendingSalary} />
      </div>

      <div className="chart-grid">
        <ChartCard
          title="Monthly Salary"
          subtitle="Non-teaching staff salary paid per month"
          type="line"
          data={monthlySeries}
          dataKeys={[{ key: "salary", label: "Salary Paid", color: palette.amber }]}
        />
        <ChartCard
          title="Monthly Expenses"
          subtitle="Salary + operating expenses per month"
          type="bar"
          data={monthlySeries}
          dataKeys={[{ key: "expenses", label: "Expenses", color: palette.red || palette.pink }]}
        />
      </div>
    </div>
  );
}
