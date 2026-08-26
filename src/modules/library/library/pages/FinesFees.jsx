import { useEffect, useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import { useToast } from '../context/ToastContext';
import { exportToExcel, printClearanceReceipt } from '../utils/exportHelpers';
import { apiGet, apiPost } from '../utils/api';

const AVATAR_COLORS = [
  { bg: 'var(--purple-light)', fg: 'var(--purple)' }, { bg: 'var(--blue-light)', fg: 'var(--blue)' },
  { bg: 'var(--pink-light)', fg: 'var(--pink)' }, { bg: 'var(--amber-light)', fg: 'var(--amber)' },
  { bg: 'var(--teal-light)', fg: 'var(--teal)' },
];

const EMPTY_FORM = {
  id: '', name: '', userType: '', bookId: '', bookName: '', issueDate: '', returnDate: '',
  overdueDays: '', damageType: 'No Damage', overdueFine: '', damageFine: '', status: 'Pending', remarks: '',
};

export default function FinesFees() {
  const showToast = useToast();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    let cancelled = false;
    apiGet('/library-clearances')
      .then((res) => {
        if (cancelled) return;
        setRecords((res.data ?? []).map((r) => ({
          id: r.clearanceId || r._id, name: r.name, type: r.userType, bookId: r.bookId || '—', bookName: r.bookName || '—',
          overdueFine: r.overdueFine ?? 0, damageFine: r.damageFine ?? 0, status: r.status,
        })));
      })
      .catch(() => { if (!cancelled) showToast('Could not load clearance records', 'ti-alert-circle'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const totalFine = (Number(form.overdueFine) || 0) + (Number(form.damageFine) || 0);

  const filtered = useMemo(() => records.filter((r) => {
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || `${r.id} ${r.name} ${r.bookName}`.toLowerCase().includes(q);
    const matchesType = !userTypeFilter || r.type === userTypeFilter;
    const matchesStatus = !statusFilter || r.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  }), [records, search, userTypeFilter, statusFilter]);

  const stats = {
    total: records.length,
    cleared: records.filter((r) => r.status === 'Cleared').length,
    pending: records.filter((r) => r.status === 'Pending').length,
    outstanding: records.filter((r) => r.status === 'Pending').reduce((s, r) => s + r.overdueFine + r.damageFine, 0),
  };

  const submitClearance = async () => {
    if (!form.name || !form.userType) { showToast('Please fill in required fields', 'ti-alert-circle'); return; }
    const newId = form.id || 'CLR-' + String(records.length + 1).padStart(3, '0');
    try {
      const res = await apiPost('/library-clearances', {
        clearanceId: newId, name: form.name, userType: form.userType, bookId: form.bookId || '—', bookName: form.bookName || '—',
        overdueFine: Number(form.overdueFine) || 0, damageFine: Number(form.damageFine) || 0, status: form.status,
      });
      setRecords((prev) => [...prev, {
        id: res.data.clearanceId || res.data._id, name: res.data.name, type: res.data.userType, bookId: res.data.bookId || '—', bookName: res.data.bookName || '—',
        overdueFine: res.data.overdueFine ?? 0, damageFine: res.data.damageFine ?? 0, status: res.data.status,
      }]);
      setForm(EMPTY_FORM);
      showToast('Clearance record submitted!', 'ti-circle-check');
    } catch (err) {
      showToast(err.message || 'Could not submit clearance record', 'ti-alert-circle');
    }
  };

  const downloadClearanceReceipt = () => {
    if (!form.name || !form.userType) { showToast('Please fill in the form before generating a receipt', 'ti-alert-circle'); return; }
    printClearanceReceipt([
      { label: 'Clearance ID', value: form.id || '(auto-generated)' },
      { label: 'Name', value: form.name },
      { label: 'User Type', value: form.userType },
      { label: 'Book ID', value: form.bookId },
      { label: 'Book Name', value: form.bookName },
      { label: 'Issue Date', value: form.issueDate },
      { label: 'Return Date', value: form.returnDate },
      { label: 'Overdue Days', value: form.overdueDays },
      { label: 'Damage Type', value: form.damageType },
      { label: 'Overdue Fine', value: `₹${form.overdueFine || 0}` },
      { label: 'Damage Fine', value: `₹${form.damageFine || 0}` },
      { label: 'Clearance Status', value: form.status },
      { label: 'Remarks', value: form.remarks },
    ], totalFine);
  };

  const exportClearanceRecords = () => exportToExcel('clearance-records', [
    { key: 'id', label: 'ID' }, { key: 'name', label: 'Name' }, { key: 'type', label: 'User Type' },
    { key: 'bookId', label: 'Book ID' }, { key: 'bookName', label: 'Book Name' }, { key: 'overdueFine', label: 'Overdue Fine' },
    { key: 'damageFine', label: 'Damage Fine' }, { key: 'status', label: 'Status' },
  ], filtered);

  return (
    <>
      <PageHeader title="Fines & Clearance" subtitle="Record overdue fines, book damage charges, and clearance status" />

      <div className="row row-cols-2 row-cols-md-4 g-3 mb-4">
        <StatCard icon="ti-report-money" color="purple" num={stats.total} label="Total records" />
        <StatCard icon="ti-circle-check" color="green" num={stats.cleared} label="Cleared" />
        <StatCard icon="ti-alert-circle" color="red" num={stats.pending} label="Pending" />
        <StatCard icon="ti-currency-rupee" color="amber" num={`₹${stats.outstanding}`} label="Outstanding amount" />
      </div>

      <div className="ec-card mb-3">
        <div className="ec-card-head">
          <h2><i className="ti ti-clipboard-text me-1" style={{ color: 'var(--purple)' }}></i>Clearance Form</h2>
          <button className="export-btn pdf" onClick={downloadClearanceReceipt}><i className="ti ti-file-type-pdf"></i>PDF Receipt</button>
        </div>
        <div className="p-3">
          <div className="mb-3 p-3" style={{ background: 'var(--pink-light)', borderLeft: '4px solid var(--purple)', borderRadius: 6, fontSize: 12.5, color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--purple)' }}>Note:</strong> Overdue Fine and Damage Fine are added automatically as the Total Fine below. Fill in fines as ₹0 if not applicable.
          </div>
          <div className="row g-3">
            <div className="col-md-4"><label className="form-label">Clearance ID</label><input className="form-control" placeholder="e.g. CLR-006 (auto if left blank)" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} /></div>
            <div className="col-md-4"><label className="form-label">Name</label><input className="form-control" placeholder="Student / teacher name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="col-md-4">
              <label className="form-label">User Type</label>
              <select className="form-select" value={form.userType} onChange={(e) => setForm({ ...form, userType: e.target.value })}>
                <option value="">Select type</option><option>Student</option><option>Teacher</option>
              </select>
            </div>
            <div className="col-md-4"><label className="form-label">Book ID</label><input className="form-control" placeholder="e.g. BK-1002" value={form.bookId} onChange={(e) => setForm({ ...form, bookId: e.target.value })} /></div>
            <div className="col-md-8"><label className="form-label">Book Name</label><input className="form-control" placeholder="e.g. NCERT Science — Class 9" value={form.bookName} onChange={(e) => setForm({ ...form, bookName: e.target.value })} /></div>
            <div className="col-md-3"><label className="form-label">Issue Date</label><input type="date" className="form-control" value={form.issueDate} onChange={(e) => setForm({ ...form, issueDate: e.target.value })} /></div>
            <div className="col-md-3"><label className="form-label">Return Date</label><input type="date" className="form-control" value={form.returnDate} onChange={(e) => setForm({ ...form, returnDate: e.target.value })} /></div>
            <div className="col-md-3"><label className="form-label">Overdue Days</label><input type="number" min="0" className="form-control" placeholder="0" value={form.overdueDays} onChange={(e) => setForm({ ...form, overdueDays: e.target.value })} /></div>
            <div className="col-md-3">
              <label className="form-label">Damage Type</label>
              <select className="form-select" value={form.damageType} onChange={(e) => setForm({ ...form, damageType: e.target.value })}>
                <option>No Damage</option><option>Torn Pages</option><option>Missing Pages</option><option>Water Damage</option><option>Lost Book</option>
              </select>
            </div>
            <div className="col-md-4"><label className="form-label">Overdue Fine (₹)</label><input type="number" min="0" className="form-control" placeholder="0" value={form.overdueFine} onChange={(e) => setForm({ ...form, overdueFine: e.target.value })} /></div>
            <div className="col-md-4"><label className="form-label">Damage Fine (₹)</label><input type="number" min="0" className="form-control" placeholder="0" value={form.damageFine} onChange={(e) => setForm({ ...form, damageFine: e.target.value })} /></div>
            <div className="col-md-4">
              <label className="form-label">Clearance Status</label>
              <select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option>Pending</option><option>Cleared</option>
              </select>
            </div>
            <div className="col-12"><label className="form-label">Remarks</label><textarea className="form-control" placeholder="Any additional notes about the clearance…" value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })}></textarea></div>
            <div className="col-12">
              <div className="total-fine-box">
                <span className="label">Total Fine</span>
                <span className="amount">₹{totalFine}</span>
              </div>
            </div>
          </div>
          <div className="text-end mt-3">
            <button className="btn-purple" onClick={submitClearance}><i className="ti ti-check"></i>Submit Clearance</button>
          </div>
        </div>
      </div>

      <div className="ec-card mb-3">
        <div className="p-3 d-flex flex-wrap gap-2 align-items-center">
          <div className="flex-grow-1" style={{ minWidth: 220 }}>
            <input type="search" className="form-control" placeholder="Search by ID, name, or book…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="form-select" style={{ maxWidth: 170 }} value={userTypeFilter} onChange={(e) => setUserTypeFilter(e.target.value)}>
            <option value="">All user types</option><option>Student</option><option>Teacher</option>
          </select>
          <select className="form-select" style={{ maxWidth: 170 }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All status</option><option>Cleared</option><option>Pending</option>
          </select>
          <button className="export-btn excel" onClick={exportClearanceRecords}><i className="ti ti-file-spreadsheet"></i>Excel Sheet</button>
        </div>
      </div>

      <div className="ec-card">
        <div className="ec-card-head">
          <h2><i className="ti ti-list-details me-1" style={{ color: 'var(--purple)' }}></i>Clearance records <span className="att-badge" style={{ background: 'var(--purple-light)', color: 'var(--purple)', marginLeft: 6 }}>{filtered.length}</span></h2>
        </div>
        <div className="lib-table-wrap">
          <table className="lib-table">
            <thead><tr><th className="text-start">ID</th><th className="text-start">Name</th><th>User Type</th><th>Book ID</th><th className="text-start">Book Name</th><th>Overdue Fine</th><th>Damage Fine</th><th>Total Fine</th><th>Status</th></tr></thead>
            <tbody>
              {filtered.map((r, i) => {
                const c = AVATAR_COLORS[i % AVATAR_COLORS.length];
                return (
                  <tr key={r.id}>
                    <td className="text-start">{r.id}</td>
                    <td className="text-start"><span className="member-avatar" style={{ background: c.bg, color: c.fg }}>{r.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}</span>{r.name}</td>
                    <td>{r.type}</td><td>{r.bookId}</td><td className="text-start">{r.bookName}</td>
                    <td>₹{r.overdueFine}</td><td>₹{r.damageFine}</td><td>₹{r.overdueFine + r.damageFine}</td>
                    <td><span className={`badge-status ${r.status === 'Cleared' ? 'badge-available' : 'badge-overdue'}`}>{r.status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {loading && <p className="text-center py-3 mb-0" style={{ color: 'var(--text-muted)', fontSize: 13 }}>Loading…</p>}
          {!loading && filtered.length === 0 && <p className="text-center py-3 mb-0" style={{ color: 'var(--text-muted)', fontSize: 13 }}>No clearance records match your search/filter.</p>}
        </div>
      </div>

      <div className="thought-banner"><i className="ti ti-books me-2"></i>A Reader Today, A Leader Tomorrow.</div>
    </>
  );
}
