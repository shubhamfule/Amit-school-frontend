import React, { useMemo, useState } from 'react';
import { useToast } from '../../components/ToastContext';
import { financeOverview, revenueVsExpense, recentTransactions, formatINR } from '../../data/financeData';

// Reuses existing global classes only (stat-grid/tab-row/tab-btn/table-wrap/
// data-table/badge-pill from styles/global.css) — no other file is touched.
// The dark stat-card look from the reference screenshot is applied with
// inline styles, scoped to this file, on top of the app's --purple token.

const TABS = ['Daily', 'Monthly', 'Yearly'];

const STATUS_LABEL = { Paid: 'Completed', Pending: 'Pending', Overdue: 'Overdue' };
const STATUS_CLASS = { Paid: 'badge-paid', Pending: 'badge-pending', Overdue: 'badge-unpaid' };

const dailyColumns = [
  { header: 'Date', key: 'date' },
  { header: 'Name', key: 'name' },
  { header: 'Type', key: 'type' },
  { header: 'Amount', key: 'amountLabel' },
  { header: 'Status', key: 'status' },
];
const periodColumns = [
  { header: 'Period', key: 'period' },
  { header: 'Income', key: 'incomeLabel' },
  { header: 'Expenses', key: 'expensesLabel' },
  { header: 'Net', key: 'netLabel' },
];

function StatCard({ value, label }) {
  return (
    <div style={{
      background: 'var(--purple)', borderRadius: 'var(--radius-lg)', padding: '26px 20px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', color: '#fff', boxShadow: '0 4px 14px rgba(77,0,17,0.25)',
    }}>
      <div style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.15 }}>{value}</div>
      <div style={{ fontSize: 13, opacity: 0.85, marginTop: 6 }}>{label}</div>
    </div>
  );
}

export default function Reports() {
  const showToast = useToast();
  const [tab, setTab] = useState('Daily');

  const monthlyRows = revenueVsExpense.map((m) => ({
    period: m.month,
    income: m.revenue,
    expenses: m.expense,
    net: m.revenue - m.expense,
  }));

  const yearlyRows = useMemo(() => {
    const income = revenueVsExpense.reduce((s, m) => s + m.revenue, 0);
    const expenses = revenueVsExpense.reduce((s, m) => s + m.expense, 0);
    return [{ period: '2026 (YTD)', income, expenses, net: income - expenses }];
  }, []);

  const todayCount = useMemo(() => {
    const latestDate = recentTransactions[0]?.date;
    return recentTransactions.filter((t) => t.date === latestDate).length;
  }, []);

  let rows, columns, title;
  if (tab === 'Daily') {
    rows = recentTransactions.map((r) => ({ ...r, amountLabel: formatINR(r.amount) }));
    columns = dailyColumns;
    title = 'Daily Transactions Report';
  } else {
    const src = tab === 'Monthly' ? monthlyRows : yearlyRows;
    rows = src.map((r) => ({
      ...r,
      incomeLabel: formatINR(r.income),
      expensesLabel: formatINR(r.expenses),
      netLabel: formatINR(r.net),
    }));
    columns = periodColumns;
    title = `${tab} Financial Report`;
  }

  const handleExport = (type) => showToast(
    `Preparing ${title} (${type})…`,
    type === 'PDF' ? 'ti-file-type-pdf' : 'ti-file-spreadsheet'
  );

  return (
    <div>
      <div className="stat-grid">
        <StatCard value={formatINR(financeOverview.totalRevenue)} label="Total Income (YTD)" />
        <StatCard value={formatINR(financeOverview.totalExpense)} label="Total Expenses (YTD)" />
        <StatCard value={formatINR(financeOverview.netBalance)} label="Net Balance (YTD)" />
        <StatCard value={todayCount} label="Today's Transactions" />
      </div>

      <div className="tab-row mb-4">
        {TABS.map((t) => (
          <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>

      <div className="toolbar-row">
        <p className="fin-tab-note">{title}</p>
        <div className="d-flex gap-2">
          <button
            onClick={() => handleExport('PDF')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer',
              background: 'var(--red-light)', color: 'var(--red)', border: 'none',
              borderRadius: 'var(--radius-sm)', padding: '8px 16px', fontSize: 13, fontWeight: 600,
            }}
          >
            <i className="ti ti-file-type-pdf"></i>PDF
          </button>
          <button
            onClick={() => handleExport('Excel')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer',
              background: 'var(--green-light)', color: 'var(--green)', border: 'none',
              borderRadius: 'var(--radius-sm)', padding: '8px 16px', fontSize: 13, fontWeight: 600,
            }}
          >
            <i className="ti ti-file-spreadsheet"></i>Excel
          </button>
        </div>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>{columns.map((c) => <th key={c.key}>{c.header}</th>)}</tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>
                  No data for this period.
                </td>
              </tr>
            )}
            {rows.map((r, i) => (
              <tr key={i}>
                {columns.map((c) => (
                  <td key={c.key}>
                    {c.key === 'status' ? (
                      <span className={`badge-pill ${STATUS_CLASS[r.status] || 'badge-pending'}`}>
                        {STATUS_LABEL[r.status] || r.status}
                      </span>
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
