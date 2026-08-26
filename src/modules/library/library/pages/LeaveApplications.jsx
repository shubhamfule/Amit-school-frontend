import { useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import { useToast } from '../context/ToastContext';
import { exportToExcel, exportToPDF } from '../utils/exportHelpers';

const STATUS_OPTIONS = ['Approved', 'Pending', 'Rejected'];
const badgeClass = { Approved: 'badge-available', Pending: 'badge-pending2', Rejected: 'badge-overdue' };

const EMPTY_LEAVE = { studentName: '', startDate: '', endDate: '', reason: '', status: 'Pending' };

function withDays(row) {
  const start = new Date(row.startDate);
  const end = new Date(row.endDate);
  const days = Math.max(1, Math.round((end - start) / 86400000) + 1);
  return { ...row, days };
}

export default function LeaveApplications() {
  const showToast = useToast();
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showApply, setShowApply] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_LEAVE);

  const filtered = useMemo(() => rows.filter((r) => {
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || r.studentName.toLowerCase().includes(q);
    const matchesStatus = !statusFilter || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  }), [rows, search, statusFilter]);

  function openApply() {
    setEditingId(null);
    setForm(EMPTY_LEAVE);
    setShowApply(true);
  }

  function openEdit(row) {
    setEditingId(row.id);
    setForm({ studentName: row.studentName, startDate: row.startDate, endDate: row.endDate, reason: row.reason, status: row.status });
    setShowApply(true);
  }

  function saveLeave() {
    if (!form.studentName.trim() || !form.startDate || !form.endDate) {
      showToast('Please fill in required fields', 'ti-alert-circle');
      return;
    }
    if (editingId) {
      setRows((list) => list.map((r) => (r.id === editingId ? withDays({ ...r, ...form }) : r)));
      showToast('Leave application updated', 'ti-check');
    } else {
      setRows((list) => [withDays({ id: Date.now(), ...form }), ...list]);
      showToast('Leave application submitted!', 'ti-calendar-plus');
    }
    setShowApply(false);
    setForm(EMPTY_LEAVE);
    setEditingId(null);
  }

  function removeLeave(id) {
    setRows((list) => list.filter((r) => r.id !== id));
    showToast('Leave application removed', 'ti-trash');
  }

  const columns = [
    { key: 'studentName', label: 'Student Name' },
    { key: 'startDate', label: 'Start Date' },
    { key: 'endDate', label: 'End Date' },
    { key: 'reason', label: 'Reason' },
    { key: 'status', label: 'Status' },
  ];

  const exportExcel = () => exportToExcel('leave-applications', columns, filtered);
  const exportPDF = () => exportToPDF('Leave Applications', columns, filtered);

  return (
    <>
      <PageHeader
        title="Leave Applications"
        subtitle="Amit Group of Schools | Apply and track leave requests"
        actions={<button className="btn-purple" onClick={openApply}><i className="ti ti-mail-plus"></i>Apply Leave</button>}
      />

      <div className="ec-card mb-3">
        <div className="p-3 d-flex flex-wrap gap-2 align-items-center">
          <div className="flex-grow-1" style={{ minWidth: 220 }}>
            <input type="search" className="form-control" placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="form-select" style={{ maxWidth: 170 }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
          </select>
          <button className="export-btn pdf" onClick={exportPDF}><i className="ti ti-file-type-pdf"></i>PDF</button>
          <button className="export-btn excel" onClick={exportExcel}><i className="ti ti-file-spreadsheet"></i>Excel</button>
        </div>
      </div>

      <div className="ec-card">
        <div className="lib-table-wrap">
          <table className="ec-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 500, color: 'var(--purple)' }}>{r.studentName}</td>
                  <td>{r.startDate}</td>
                  <td>{r.endDate}</td>
                  <td>{r.reason}</td>
                  <td><span className={`badge-status ${badgeClass[r.status]}`}>{r.status}</span></td>
                  <td>
                    <div className="table-actions">
                      <div className="tbl-icon-btn" title="Edit" onClick={() => openEdit(r)}><i className="ti ti-pencil"></i></div>
                      <div className="tbl-icon-btn danger" title="Remove" onClick={() => removeLeave(r.id)}><i className="ti ti-trash"></i></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center py-4 mb-0" style={{ color: 'var(--text-muted)', fontSize: 13 }}>No records found.</p>
          )}
        </div>
      </div>

      <div className="thought-banner"><i className="ti ti-books me-2"></i>A Reader Today, A Leader Tomorrow.</div>

      <Modal
        open={showApply} onClose={() => setShowApply(false)} title={editingId ? 'Edit Leave Application' : 'Apply Leave'} icon="ti-mail-plus"
        footer={<>
          <button className="btn-ghost-purple" onClick={() => setShowApply(false)}>Cancel</button>
          <button className="btn-purple ms-2" onClick={saveLeave}><i className="ti ti-check"></i>{editingId ? 'Save' : 'Submit'}</button>
        </>}
      >
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label">Student Name</label>
            <input className="form-control" value={form.studentName} onChange={(e) => setForm({ ...form, studentName: e.target.value })} placeholder="e.g. Arjun S" />
          </div>
          <div className="col-6">
            <label className="form-label">Start Date</label>
            <input type="date" className="form-control" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
          </div>
          <div className="col-6">
            <label className="form-label">End Date</label>
            <input type="date" className="form-control" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
          </div>
          <div className="col-12">
            <label className="form-label">Reason for Leave</label>
            <textarea className="form-control" rows={3} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Reason for leave" />
          </div>
          <div className="col-12">
            <label className="form-label">Status</label>
            <select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </Modal>
    </>
  );
}
