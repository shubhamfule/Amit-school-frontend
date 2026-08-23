import React from 'react';
import FinanceStatCard from '../../components/finance/FinanceStatCard';
import FinanceTable from '../../components/finance/FinanceTable';
import { useToast } from '../../components/ToastContext';
import { libraryFinance, formatINR } from '../../data/financeData';

const columns = [
  { key: 'id', label: 'Record ID' },
  { key: 'name', label: 'Description' },
  { key: 'category', label: 'Category' },
  { key: 'amount', label: 'Amount', type: 'currency' },
  { key: 'status', label: 'Status', type: 'status' },
];

export default function LibraryFinance() {
  const showToast = useToast();
  const { summary, records } = libraryFinance;

  return (
    <div>
      <div className="d-flex align-center justify-between flex-wrap gap-3 mb-4">
        <div className="fin-tab-note">Library spending, book purchases and fine collection</div>
        <div className="d-flex gap-2">
          <button onClick={() => showToast('Preparing library report (PDF)…', 'ti-file-type-pdf')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', background: 'var(--red-light)', color: 'var(--red)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '8px 16px', fontSize: 13, fontWeight: 600 }}>
            <i className="ti ti-file-type-pdf"></i>PDF
          </button>
          <button onClick={() => showToast('Preparing library report (Excel)…', 'ti-file-spreadsheet')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', background: 'var(--green-light)', color: 'var(--green)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '8px 16px', fontSize: 13, fontWeight: 600 }}>
            <i className="ti ti-file-spreadsheet"></i>Excel
          </button>
        </div>
      </div>

      <div className="stat-grid">
        <FinanceStatCard icon="ti-books" value={formatINR(summary.libraryExpense)} label="Library Expense" trend="-1.4%" trendDirection="down" color="teal" />
        <FinanceStatCard icon="ti-shopping-bag" value={formatINR(summary.bookPurchaseExpense)} label="Book Purchase Expense" trend="+3.2%" trendDirection="up" color="blue" />
        <FinanceStatCard icon="ti-coin" value={formatINR(summary.duesCollected)} label="Dues Collected" trend="+5.0%" trendDirection="up" color="green" />
        <FinanceStatCard icon="ti-alert-circle" value={formatINR(summary.pendingDues)} label="Pending Dues" trend="-0.6%" trendDirection="down" color="amber" />
      </div>

      <div className="ec-card">
        <div className="ec-card-head">
          <h2>Library transaction records</h2>
          <span className="badge-pill badge-pending">{records.length} entries</span>
        </div>
        <FinanceTable columns={columns} rows={records} />
      </div>
    </div>
  );
}
