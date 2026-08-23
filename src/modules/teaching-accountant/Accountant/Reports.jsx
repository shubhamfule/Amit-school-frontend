import { useMemo, useState } from "react";
import PageHeader from "./PageHeader";
import StatCard from "./StatCard";
import ExportButtons from "./ExportButtons";
import { monthlySeries, recentTransactions } from "./accountsData";

const inr = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const tabs = ["Daily", "Monthly", "Yearly"];

const dailyColumns = [
  { header: "Date", key: "date" },
  { header: "Name", key: "name" },
  { header: "Type", key: "type" },
  { header: "Amount", key: "amountLabel" },
  { header: "Status", key: "status" },
];
const periodColumns = [
  { header: "Period", key: "period" },
  { header: "Income", key: "incomeLabel" },
  { header: "Expenses", key: "expensesLabel" },
  { header: "Net", key: "netLabel" },
];

export default function Reports() {
  const [tab, setTab] = useState("Monthly");

  const dailyRows = recentTransactions;

  const monthlyRows = monthlySeries.map((m) => ({
    period: m.month,
    income: m.income,
    expenses: m.expenses,
    net: m.income - m.expenses,
  }));

  const yearlyRows = useMemo(() => {
    const income = monthlySeries.reduce((s, m) => s + m.income, 0);
    const expenses = monthlySeries.reduce((s, m) => s + m.expenses, 0);
    return [{ period: "2026 (YTD)", income, expenses, net: income - expenses }];
  }, []);

  const totals = useMemo(() => {
    const income = monthlySeries.reduce((s, m) => s + m.income, 0);
    const expenses = monthlySeries.reduce((s, m) => s + m.expenses, 0);
    const todayTxns = recentTransactions.filter((t) => t.date === recentTransactions[0].date);
    const todayTotal = todayTxns.reduce((s, t) => s + t.amount, 0);
    return { income, expenses, net: income - expenses, todayTotal, todayCount: todayTxns.length };
  }, []);

  let rows, columns, filename, title;
  if (tab === "Daily") {
    rows = dailyRows.map((r) => ({ ...r, amountLabel: inr(r.amount) }));
    columns = dailyColumns;
    filename = "daily-report";
    title = "Daily Transactions Report";
  } else {
    const src = tab === "Monthly" ? monthlyRows : yearlyRows;
    rows = src.map((r) => ({ ...r, incomeLabel: inr(r.income), expensesLabel: inr(r.expenses), netLabel: inr(r.net) }));
    columns = periodColumns;
    filename = tab === "Monthly" ? "monthly-report" : "yearly-report";
    title = `${tab} Financial Report`;
  }

  return (
    <div>
      <PageHeader title="Reports" subtitle="Amit Group of Schools | Daily, monthly & yearly financial reports" />

      <div className="row-cards">
        <StatCard label="Total Income (YTD)" value={totals.income} />
        <StatCard label="Total Expenses (YTD)" value={totals.expenses} />
        <StatCard label="Net Balance (YTD)" value={totals.net} />
        <StatCard label="Today's Transactions" value={totals.todayCount} isCurrency={false} />
      </div>

      <div className="tab-row">
        {tabs.map((t) => (
          <button key={t} className={`tab-btn ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>

      <div className="toolbar-row">
        <p style={{ color: "var(--text-muted)", fontSize: 13 }}>{title}</p>
        <ExportButtons title={title} columns={columns} rows={rows} filename={filename} />
      </div>

      <div className="table-wrap">
        <table className="table table-hover">
          <thead>
            <tr>{columns.map((c) => <th key={c.key}>{c.header}</th>)}</tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={columns.length} style={{ textAlign: "center", padding: 24, color: "var(--text-muted)" }}>No data for this period.</td></tr>
            )}
            {rows.map((r, i) => (
              <tr key={i}>
                {columns.map((c) => (
                  <td key={c.key}>
                    {c.key === "status" ? (
                      <span className={r.status === "Completed" ? "badge-paid" : "badge-pending"}>{r.status}</span>
                    ) : (
                      r[c.key]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
