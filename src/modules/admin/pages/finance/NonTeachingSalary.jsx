import React, { useState } from 'react';
import DonutChart from '../../components/DonutChart';
import FinanceStatCard from '../../components/finance/FinanceStatCard';
import FinanceTable from '../../components/finance/FinanceTable';
import { useToast } from '../../components/ToastContext';
import { nonTeachingFinance, formatINR } from '../../data/financeData';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name', type: 'name' },
  { key: 'designation', label: 'Designation' },
  { key: 'area', label: 'Department / Area' },
  { key: 'total', label: 'Total', type: 'currency' },
  { key: 'paid', label: 'Paid', type: 'currency' },
  { key: 'pending', label: 'Pending', type: 'currency' },
  { key: 'status', label: 'Status', type: 'status' },
];

const AREA_BY_ROLE = {
  Housekeeping: 'Campus Facilities',
  Administration: 'Admin Office',
  Security: 'Security Gate',
  Canteen: 'Cafeteria',
  Transport: 'School Transport',
};

const ROLE_COLORS = ['#4d0011', '#d4af37', '#2a78d6', '#d4537e', '#3b6d11'];
const DESIGNATIONS = ['Cleaner', 'Clerk', 'Driver', 'Librarian', 'Peon', 'Security Guard'];

export default function NonTeachingSalary() {
  const showToast = useToast();
  const [designationFilter, setDesignationFilter] = useState('All');
  const { summary } = nonTeachingFinance;
  const records = nonTeachingFinance.records.map((record) => {
    const total = record.salary;
    const paid = record.status === 'Paid' ? total : 0;
    return {
      ...record,
      designation: record.role,
      area: AREA_BY_ROLE[record.role] || record.role,
      total,
      paid,
      pending: total - paid,
    
    };
  });
  const byRole = records.map((r) => ({ name: r.designation, value: r.total }));
  const filteredRecords = designationFilter === 'All'
    ? records
    : records.filter((record) => record.designation === designationFilter);

  return (
    <div>
      <div className="d-flex align-center justify-between flex-wrap gap-3 mb-4">
        <div className="fin-tab-note">Salary payments for administrative and support staff</div>
        <div className="d-flex gap-2">
          <button onClick={() => showToast('Preparing non-teaching salary report (PDF)…', 'ti-file-type-pdf')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', background: 'var(--red-light)', color: 'var(--red)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '8px 16px', fontSize: 13, fontWeight: 600 }}>
            <i className="ti ti-file-type-pdf"></i>PDF
          </button>
          <button onClick={() => showToast('Preparing non-teaching salary report (Excel)…', 'ti-file-spreadsheet')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', background: 'var(--green-light)', color: 'var(--green)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '8px 16px', fontSize: 13, fontWeight: 600 }}>
            <i className="ti ti-file-spreadsheet"></i>Excel
          </button>
        </div>
      </div>

      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <FinanceStatCard icon="ti-wallet" value={formatINR(summary.salaryPaid)} label="Salary Paid" trend="+1.6%" trendDirection="up" color="green" />
        <FinanceStatCard icon="ti-clock" value={formatINR(summary.pendingSalary)} label="Pending Salary" trend="-0.9%" trendDirection="down" color="amber" />
        <FinanceStatCard icon="ti-receipt" value={formatINR(summary.totalSalary)} label="Total Salary" trend="+1.2%" trendDirection="up" color="pink" />
      </div>

      <div className="fin-col">
        <div className="ec-card">
          <div className="ec-card-head">
            {/* <h2>Salary by role</h2> */}
            {/* <span className="badge-pill badge-pending">This month</span> */}
          </div>
          {/* <div className="chart-wrap" style={{ height: 260 }}> */}
            {/* <DonutChart labels={byRole.map((r) => r.name)} data={byRole.map((r) => r.value)} colors={ROLE_COLORS} /> */}
          {/* </div> */}
        </div>

        <div className="ec-card">
          <div className="ec-card-head">
            <h2>Non-teaching staff records</h2>
            <div className="d-flex align-center gap-2">
              <select className="form-select" value={designationFilter} onChange={(e) => setDesignationFilter(e.target.value)} aria-label="Filter by designation">
                <option value="All">All Designations</option>
                {DESIGNATIONS.map((designation) => <option key={designation} value={designation}>{designation}</option>)}
              </select>
              <span className="badge-pill badge-paid">{filteredRecords.length} staff</span>
            </div>
          </div>
          <FinanceTable columns={columns} rows={filteredRecords} />
        </div>
      </div>
    </div>
  );
}
