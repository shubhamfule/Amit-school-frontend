import React from 'react';
import BarChart from '../../components/BarChart';
import FinanceTable from '../../components/finance/FinanceTable';
import { useToast } from '../../components/ToastContext';
import { expensesData, formatINR, formatCompactINR } from '../../data/financeData';

const columns = [
  { key: 'id', label: 'Expense ID' },
  { key: 'category', label: 'Category' },
  { key: 'vendor', label: 'Vendor / Reference' },
  { key: 'date', label: 'Date' },
  { key: 'amount', label: 'Amount', type: 'currency' },
  { key: 'status', label: 'Status', type: 'status' },
];

const BAR_COLORS = ['#4d0011', '#2a78d6', '#d4af37', '#d4537e', '#3b6d11'];

export default function Expenses() {
  const showToast = useToast();
  const { breakdown, records } = expensesData;
  const total = breakdown.reduce((s, b) => s + b.value, 0);

  return (
    <div>
      <div className="d-flex align-center justify-between flex-wrap gap-3 mb-4">
        <div className="fin-tab-note">Total expenses this period: <strong>{formatINR(total)}</strong></div>
        <div className="d-flex gap-2">
          <button onClick={() => showToast('Preparing expenses report (PDF)…', 'ti-file-type-pdf')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', background: 'var(--red-light)', color: 'var(--red)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '8px 16px', fontSize: 13, fontWeight: 600 }}>
            <i className="ti ti-file-type-pdf"></i>PDF
          </button>
          <button onClick={() => showToast('Preparing expenses report (Excel)…', 'ti-file-spreadsheet')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', background: 'var(--green-light)', color: 'var(--green)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '8px 16px', fontSize: 13, fontWeight: 600 }}>
            <i className="ti ti-file-spreadsheet"></i>Excel
          </button>
        </div>
      </div>

      <div className="ec-card fin-mb">
        <div className="ec-card-head">
          <h2>Expense breakdown by category</h2>
          <span className="badge-pill badge-pending">This month</span>
        </div>
        <div className="chart-wrap" style={{ height: 260 }}>
          <BarChart
            horizontal
            labels={breakdown.map((b) => b.name)}
            valueFormatter={formatCompactINR}
            datasets={[{
              data: breakdown.map((b) => b.value),
              backgroundColor: BAR_COLORS,
              borderRadius: 6, borderSkipped: false, barPercentage: 0.6, categoryPercentage: 0.7,
            }]}
          />
        </div>
      </div>

      <div className="ec-card">
        <div className="ec-card-head">
          <h2>Expense records</h2>
          <span className="badge-pill badge-pending">{records.length} entries</span>
        </div>
        <FinanceTable columns={columns} rows={records} />
      </div>
    </div>
  );
}
