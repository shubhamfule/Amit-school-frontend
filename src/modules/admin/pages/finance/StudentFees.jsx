import React, { useMemo, useState } from 'react';
import LineChart from '../../components/LineChart';
import Modal from '../../components/Modal';
import FinanceStatCard from '../../components/finance/FinanceStatCard';
import FinanceTable from '../../components/finance/FinanceTable';
import { useToast } from '../../components/ToastContext';
import { studentFinance, formatINR } from '../../data/financeData';

const columns = [
  { key: 'id', label: 'Admission no' },
  { key: 'name', label: 'Name', type: 'name' },
  { key: 'due', label: 'Total', type: 'currency' },
  { key: 'paid', label: 'Paid', type: 'currency' },
  { key: 'pending', label: 'Pending', type: 'currency' },
  { key: 'status', label: 'Status', type: 'status' },
];

export default function StudentFees() {
  const showToast = useToast();
  const [records, setRecords] = useState(() => studentFinance.records.map((record) => ({
    ...record,
    pending: Math.max(record.due - record.paid, 0),
  })));
  const [search, setSearch] = useState('');
  const [showRecord, setShowRecord] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [form, setForm] = useState({ id: '', amount: '' });

  const filtered = useMemo(() => (
    !search ? records : records.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase()))
  ), [records, search]);

  const feesCollected = records.reduce((s, r) => s + r.paid, 0);
  const totalFeesDue = records.reduce((s, r) => s + r.due, 0);
  const pendingFees = totalFeesDue - feesCollected;

  function markPaid(id) {
    setRecords((list) => list.map((r) => r.id === id ? { ...r, paid: r.due, pending: 0, status: 'Paid' } : r));
    showToast('Marked as fully paid', 'ti-circle-check');
  }

  function recordPayment() {
    const record = records.find((r) => r.id === form.id);
    const amount = Number(form.amount);
    if (!record || !amount) { showToast('Select a student and enter an amount', 'ti-alert-circle'); return; }
    setRecords((list) => list.map((r) => {
      if (r.id !== form.id) return r;
      const paid = Math.min(r.due, r.paid + amount);
      return { ...r, paid, pending: r.due - paid, status: paid >= r.due ? 'Paid' : 'Pending' };
    }));
    setShowRecord(false);
    setForm({ id: '', amount: '' });
    showToast('Payment recorded successfully!', 'ti-circle-check');
  }

  return (
    <div>
      <div className="d-flex align-center justify-between flex-wrap gap-3 mb-4">
        <div className="fin-tab-note">Fee collection and outstanding dues across all students</div>
        <div className="d-flex gap-2">
          <button onClick={() => showToast('Preparing student fees report (PDF)…', 'ti-file-type-pdf')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', background: 'var(--red-light)', color: 'var(--red)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '8px 16px', fontSize: 13, fontWeight: 600 }}>
            <i className="ti ti-file-type-pdf"></i>PDF
          </button>
          <button onClick={() => showToast('Preparing student fees report (Excel)…', 'ti-file-spreadsheet')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', background: 'var(--green-light)', color: 'var(--green)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '8px 16px', fontSize: 13, fontWeight: 600 }}>
            <i className="ti ti-file-spreadsheet"></i>Excel
          </button>
        </div>
      </div>

      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <FinanceStatCard icon="ti-cash" value={formatINR(feesCollected)} label="Fees Collected" trend="+6.8%" trendDirection="up" color="green" />
        <FinanceStatCard icon="ti-clock" value={formatINR(pendingFees)} label="Pending Fees" trend="-2.3%" trendDirection="down" color="amber" />
        <FinanceStatCard icon="ti-receipt" value={formatINR(totalFeesDue)} label="Total Fees Due" trend="+1.1%" trendDirection="up" color="purple" />
      </div>

      <div className="ec-card fin-mb">
        <div className="ec-card-head">
          <h2>Fee collection trend</h2>
          <span className="badge-pill badge-pending">Last 6 months</span>
        </div>
        <div className="chart-wrap" style={{ height: 240 }}>
          <LineChart
            labels={studentFinance.trend.map((d) => d.month)}
            valueFormatter={(v) => `₹${v}k`}
            datasets={[{
              label: 'Collected', data: studentFinance.trend.map((d) => d.collected / 1000),
              borderColor: '#4d0011', backgroundColor: 'rgba(77,0,17,0.10)', fill: true, tension: 0.35,
              pointRadius: 3, pointBackgroundColor: '#4d0011', borderWidth: 2.5,
            }]}
          />
        </div>
      </div>

      <div className="ec-card">
        <div className="ec-card-head">
          <div className="toolbar-row" style={{ margin: 0, flex: 1 }}>
            <div className="search-wrap">
              <i className="ti ti-search"></i>
              <input placeholder="Search students by name or ID…" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
        </div>
        <FinanceTable
          columns={columns}
          rows={filtered}
          emptyMessage="No students match your search."
          actionsLabel="Action"
          actions={(r) => (
            <>
              <div className="icon-action" title="View details" onClick={() => setViewing(r)}><i className="ti ti-eye"></i></div>
              {r.status !== 'Paid' && (
                <div className="icon-action" title="Mark paid" onClick={() => markPaid(r.id)}><i className="ti ti-check"></i></div>
              )}
            </>
          )}
        />
      </div>

      <Modal
        open={showRecord} onClose={() => setShowRecord(false)} title="Record Payment" icon="ti-report-money" filled
        footer={<>
          <button className="btn-sm-light" onClick={() => setShowRecord(false)}>Cancel</button>
          <button className="btn-purple" onClick={recordPayment}>Save payment</button>
        </>}
      >
        <div className="form-group">
          <label className="form-label">Student</label>
          <select className="form-select" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })}>
            <option value="">Select a student…</option>
            {records.filter((r) => r.status !== 'Paid').map((r) => <option key={r.id} value={r.id}>{r.name} — {r.grade}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Amount (₹)</label>
          <input type="number" className="form-control" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="e.g. 12000" />
        </div>
      </Modal>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title={viewing?.name || ''} icon="ti-id-badge">
        {viewing && (
          <div>
            <div className="form-row mb-3">
              <div><div className="form-label">Admission No</div><div>{viewing.id}</div></div>
            
            </div>
            <div className="form-row mb-3">
              <div><div className="form-label">Total Due</div><div>{formatINR(viewing.due)}</div></div>
              <div><div className="form-label">Paid</div><div>{formatINR(viewing.paid)}</div></div>
            </div>
            <div className="form-row">
              <div><div className="form-label">Balance</div><div>{formatINR(viewing.due - viewing.paid)}</div></div>
              <div><div className="form-label">Status</div><span className={`badge-pill ${viewing.status === 'Paid' ? 'badge-paid' : viewing.status === 'Pending' ? 'badge-pending' : 'badge-unpaid'}`}>{viewing.status}</span></div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
