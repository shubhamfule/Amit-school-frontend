import React, { useState } from 'react';
import BarChart from '../../components/BarChart';
import FinanceStatCard from '../../components/finance/FinanceStatCard';
import FinanceTable from '../../components/finance/FinanceTable';
import { useToast } from '../../components/ToastContext';
import { teacherFinance, formatINR } from '../../data/financeData';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name', type: 'name' },
  { key: 'designation', label: 'Designation' },
  { key: 'dept', label: 'Department / Area' },
  { key: 'total', label: 'Total', type: 'currency' },
  { key: 'paid', label: 'Paid', type: 'currency' },
  { key: 'pending', label: 'Pending', type: 'currency' },
  { key: 'status', label: 'Status', type: 'status' },
];

export default function TeacherSalary() {
  const showToast = useToast();
  const { summary, trend, records } = teacherFinance;
  const [search, setSearch] = useState('');
  const filtered = search
    ? records.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()) || r.designation.toLowerCase().includes(search.toLowerCase()) || r.dept.toLowerCase().includes(search.toLowerCase()))
    : records;

  return (
    <div>
      <div className="d-flex align-center justify-between flex-wrap gap-3 mb-4">
        <div className="fin-tab-note">Salary payments and pending dues for teaching staff</div>
        <div className="d-flex gap-2">
          <button onClick={() => showToast('Preparing teacher salary report (PDF)…', 'ti-file-type-pdf')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', background: 'var(--red-light)', color: 'var(--red)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '8px 16px', fontSize: 13, fontWeight: 600 }}>
            <i className="ti ti-file-type-pdf"></i>PDF
          </button>
          <button onClick={() => showToast('Preparing teacher salary report (Excel)…', 'ti-file-spreadsheet')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', background: 'var(--green-light)', color: 'var(--green)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '8px 16px', fontSize: 13, fontWeight: 600 }}>
            <i className="ti ti-file-spreadsheet"></i>Excel
          </button>
        </div>
      </div>

      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <FinanceStatCard icon="ti-wallet" value={formatINR(summary.salaryPaid)} label="Salary Paid" trend="+2.4%" trendDirection="up" color="green" />
        <FinanceStatCard icon="ti-clock" value={formatINR(summary.pendingSalary)} label="Pending Salary" trend="-1.0%" trendDirection="down" color="amber" />
        <FinanceStatCard icon="ti-receipt" value={formatINR(summary.totalSalary)} label="Total Salary" trend="+1.8%" trendDirection="up" color="blue" />
      </div>

      <div className="ec-card fin-mb">
        <div className="ec-card-head">
          <h2>Monthly salary payout</h2>
          <span className="badge-pill badge-pending">Last 6 months</span>
        </div>
        <div className="chart-wrap" style={{ height: 240 }}>
          <BarChart
            labels={trend.map((d) => d.month)}
            valueFormatter={(v) => `₹${v}k`}
            datasets={[{ label: 'Salary paid', data: trend.map((d) => d.paid / 1000), backgroundColor: '#2a78d6', borderRadius: 5, borderSkipped: false, barPercentage: 0.55, categoryPercentage: 0.65 }]}
          />
        </div>
      </div>

      <div className="ec-card">
        <div className="ec-card-head">
          <div className="toolbar-row" style={{ margin: 0, flex: 1 }}>
            <div className="search-wrap">
              <i className="ti ti-search"></i>
              <input placeholder="Search teachers by name or department…" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
        </div>
        <FinanceTable columns={columns} rows={filtered} emptyMessage="No teachers match your search." />
      </div>
    </div>
  );
}
