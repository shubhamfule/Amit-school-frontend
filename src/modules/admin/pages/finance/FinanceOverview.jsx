import React from 'react';
import BarChart from '../../components/BarChart';
import LineChart from '../../components/LineChart';
import FinanceStatCard from '../../components/finance/FinanceStatCard';
import FinanceTable from '../../components/finance/FinanceTable';
import { useToast } from '../../components/ToastContext';
import {
  financeOverview, revenueVsExpense, monthlyFinanceTrend, recentTransactions,
  formatINR, formatCompactINR,
} from '../../data/financeData';

const txnColumns = [
  { key: 'id', label: 'Txn ID' },
  { key: 'name', label: 'Name', type: 'name' },
  { key: 'type', label: 'Type' },
  { key: 'date', label: 'Date' },
  { key: 'amount', label: 'Amount', type: 'currency' },
  { key: 'status', label: 'Status', type: 'status' },
];

const BREAKDOWN_ROWS = (f) => [
  { label: 'Student Fees', value: f.studentFees, icon: 'ti-cash', color: 'purple' },
  { label: 'Teacher Salary', value: f.teacherSalary, icon: 'ti-user-check', color: 'blue' },
  { label: 'Non-Teaching Salary', value: f.nonTeachingSalary, icon: 'ti-users', color: 'pink' },
  { label: 'Library Expense', value: f.libraryExpense, icon: 'ti-books', color: 'teal' },
  { label: 'Library Dues', value: f.libraryDues, icon: 'ti-alert-circle', color: 'amber' },
];

export default function FinanceOverview() {
  const showToast = useToast();
  const f = financeOverview;

  const revLabels = revenueVsExpense.map((d) => d.month);
  const revData = revenueVsExpense.map((d) => d.revenue / 100000);
  const expData = revenueVsExpense.map((d) => d.expense / 100000);
  const netLabels = monthlyFinanceTrend.map((d) => d.month);
  const netData = monthlyFinanceTrend.map((d) => d.net / 1000);

  return (
    <div>
      <div className="d-flex align-center justify-between flex-wrap gap-3 mb-4">
        <div className="page-subtitle">School financial snapshot</div>
        <div className="d-flex gap-2">
          <button onClick={() => showToast('Preparing finance overview (PDF)…', 'ti-file-type-pdf')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', background: 'var(--red-light)', color: 'var(--red)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '8px 16px', fontSize: 13, fontWeight: 600 }}>
            <i className="ti ti-file-type-pdf"></i>PDF
          </button>
          <button onClick={() => showToast('Preparing finance overview (Excel)…', 'ti-file-spreadsheet')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', background: 'var(--green-light)', color: 'var(--green)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '8px 16px', fontSize: 13, fontWeight: 600 }}>
            <i className="ti ti-file-spreadsheet"></i>Excel
          </button>
        </div>
      </div>

      <div className="stat-grid">
        <FinanceStatCard icon="ti-trending-up" value={formatINR(f.totalRevenue)} label="Total Revenue" trend="+8.4% vs last period" trendDirection="up" color="green" />
        <FinanceStatCard icon="ti-trending-down" value={formatINR(f.totalExpense)} label="Total Expense" trend="+3.1% vs last period" trendDirection="up" color="red" />
        <FinanceStatCard icon="ti-pig-money" value={formatINR(f.netBalance)} label="Net Balance" trend="+11.5% vs last period" trendDirection="up" color="purple" />
        <FinanceStatCard icon="ti-alert-triangle" value={formatINR(f.totalPending)} label="Total Pending" trend="-3.6% vs last period" trendDirection="down" color="amber" />
      </div>

      <div className="fin-two-col">
        <div className="ec-card">
          <div className="ec-card-head">
            <h2>Revenue vs expense</h2>
            <span className="badge-pill badge-pending">Last 6 months</span>
          </div>
          <div className="chart-wrap" style={{ height: 260 }}>
            <BarChart
              labels={revLabels}
              showLegend
              datasets={[
                { label: 'Revenue', data: revData, backgroundColor: '#3b6d11', borderRadius: 5, borderSkipped: false, barPercentage: 0.55, categoryPercentage: 0.65 },
                { label: 'Expense', data: expData, backgroundColor: '#a32d2d', borderRadius: 5, borderSkipped: false, barPercentage: 0.55, categoryPercentage: 0.65 },
              ]}
            />
          </div>
        </div>

        <div className="ec-card">
          <div className="ec-card-head">
            <h2>Monthly net balance</h2>
            <span className="badge-pill badge-paid">Trend</span>
          </div>
          <div className="chart-wrap" style={{ height: 260 }}>
            <LineChart
              labels={netLabels}
              valueFormatter={(v) => `₹${v}k`}
              datasets={[
                { label: 'Net balance', data: netData, borderColor: '#4d0011', backgroundColor: 'rgba(77,0,17,0.08)', fill: true, tension: 0.35, pointRadius: 3, pointBackgroundColor: '#4d0011', borderWidth: 2.5 },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="ec-card fin-mb">
        <div className="ec-card-head">
          <h2>Revenue &amp; expense breakdown</h2>
        </div>
        <div className="fin-breakdown-list">
          {BREAKDOWN_ROWS(f).map((r) => (
            <div className="fin-breakdown-row" key={r.label}>
              <div className={`stat-icon-wrap si-${r.color}`} style={{ width: 34, height: 34, fontSize: 15 }}>
                <i className={`ti ${r.icon}`}></i>
              </div>
              <div>
                <div className="fin-breakdown-val">{formatCompactINR(r.value)}</div>
                <div className="fin-breakdown-label">{r.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="ec-card">
        <div className="ec-card-head">
          <h2>Recent transactions</h2>
        </div>
        <FinanceTable columns={txnColumns} rows={recentTransactions} />
      </div>
    </div>
  );
}
