import { useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import Modal from '../components/Modal';
import { useToast } from '../context/ToastContext';
import { exportToExcel } from '../utils/exportHelpers';
import { LEAVE_TYPES, formatDateDMY, makeAllStaff, makeLeaveApplications } from '../data/staffData';

const EMPTY_LEAVE = { staffId: '', leaveType: LEAVE_TYPES[0], from: '', to: '', reason: '' };
const badgeClass = { Approved: 'badge-available', Pending: 'badge-pending2', Rejected: 'badge-overdue' };

export default function LeaveApplications() {
  const showToast = useToast();
  const [staff] = useState(makeAllStaff);
  const [leaveApps, setLeaveApps] = useState(() => makeLeaveApplications(staff));
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [staffTypeFilter, setStaffTypeFilter] = useState('');
  const [showApplyLeave, setShowApplyLeave] = useState(false);
  const [newLeave, setNewLeave] = useState(EMPTY_LEAVE);

  const roles = useMemo(() => Array.from(new Set(staff.map((s) => s.role))), [staff]);

  const filtered = useMemo(() => leaveApps.filter((l) => {
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || `${l.name} ${l.staffId} ${l.leaveType}`.toLowerCase().includes(q);
    const matchesStatus = !statusFilter || l.status === statusFilter;
    const matchesRole = !staffTypeFilter || l.role === staffTypeFilter;
    return matchesSearch && matchesStatus && matchesRole;
  }), [leaveApps, search, statusFilter, staffTypeFilter]);

  const stats = {
    total: leaveApps.length,
    pending: leaveApps.filter((l) => l.status === 'Pending').length,
    approved: leaveApps.filter((l) => l.status === 'Approved').length,
    rejected: leaveApps.filter((l) => l.status === 'Rejected').length,
  };

  const setStatus = (id, status) => {
    setLeaveApps((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    showToast(`Leave application ${status.toLowerCase()}`, status === 'Approved' ? 'ti-circle-check' : 'ti-circle-x');
  };

  const saveLeave = () => {
    if (!newLeave.staffId || !newLeave.from || !newLeave.to) {
      showToast('Please fill in required fields', 'ti-alert-circle');
      return;
    }
    const member = staff.find((s) => s.id === newLeave.staffId);
    const newId = 'LV-' + String(leaveApps.length + 1).padStart(3, '0');
    const days = Math.max(1, Math.round((new Date(newLeave.to) - new Date(newLeave.from)) / 86400000) + 1);
    setLeaveApps((prev) => [{
      id: newId, staffId: newLeave.staffId, name: member?.name || '—', role: member?.role || '—',
      leaveType: newLeave.leaveType, from: newLeave.from, to: newLeave.to, days,
      reason: newLeave.reason || '—', status: 'Pending', appliedOn: new Date().toISOString().slice(0, 10),
    }, ...prev]);
    setShowApplyLeave(false);
    setNewLeave(EMPTY_LEAVE);
    showToast('Leave application submitted!', 'ti-calendar-plus');
  };

  const exportLeaves = () => exportToExcel('leave-applications', [
    { key: 'staffId', label: 'Staff ID' }, { key: 'name', label: 'Name' }, { key: 'role', label: 'Role' },
    { key: 'leaveType', label: 'Leave Type' }, { key: 'from', label: 'From' }, { key: 'to', label: 'To' },
    { key: 'days', label: 'Days' }, { key: 'status', label: 'Status' },
  ], filtered);

  return (
    <>
      <PageHeader
        title="Leave Applications"
        subtitle="Track and manage leave requests from teachers & staff"
        actions={<button className="btn-purple" onClick={() => setShowApplyLeave(true)}><i className="ti ti-calendar-plus"></i>Apply leave</button>}
      />

      <div className="row row-cols-2 row-cols-md-4 g-3 mb-4">
        <StatCard icon="ti-calendar-stats" num={stats.total} label="Total applications" />
        <StatCard icon="ti-clock-hour-4" num={stats.pending} label="Pending" />
        <StatCard icon="ti-circle-check" num={stats.approved} label="Approved" />
        <StatCard icon="ti-circle-x" num={stats.rejected} label="Rejected" />
      </div>

      <div className="ec-card mb-3">
        <div className="p-3 d-flex flex-wrap gap-2 align-items-center">
          <div className="flex-grow-1" style={{ minWidth: 220 }}>
            <input type="search" className="form-control" placeholder="Search by name, Staff ID, or leave type…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="form-select" style={{ maxWidth: 170 }} value={staffTypeFilter} onChange={(e) => setStaffTypeFilter(e.target.value)}>
            <option value="">All staff types</option>
            {roles.map((r) => <option key={r}>{r}</option>)}
          </select>
          <select className="form-select" style={{ maxWidth: 170 }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All status</option>
            <option>Pending</option><option>Approved</option><option>Rejected</option>
          </select>
          <button className="export-btn excel" onClick={exportLeaves}><i className="ti ti-file-spreadsheet"></i>Excel Sheet</button>
        </div>
      </div>

      <div className="ec-card">
        <div className="ec-card-head">
          <h2><i className="ti ti-calendar-stats me-1" style={{ color: 'var(--purple)' }}></i>All leave applications <span className="att-badge" style={{ background: 'var(--purple-light)', color: 'var(--purple)', marginLeft: 6 }}>{filtered.length}</span></h2>
        </div>
        <div className="lib-table-wrap">
          <table className="lib-table">
            <thead>
              <tr><th className="text-start">Staff ID</th><th className="text-start">Name</th><th>Role</th><th>Leave Type</th><th>From</th><th>To</th><th>Days</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id}>
                  <td className="text-start">{l.staffId}</td>
                  <td className="text-start">{l.name}</td>
                  <td>{l.role}</td>
                  <td>{l.leaveType}</td>
                  <td>{formatDateDMY(l.from)}</td>
                  <td>{formatDateDMY(l.to)}</td>
                  <td>{l.days}</td>
                  <td><span className={`badge-status ${badgeClass[l.status]}`}>{l.status}</span></td>
                  <td>
                    {l.status === 'Pending' ? (
                      <div className="d-flex gap-1 justify-content-center">
                        <button className="btn-ghost-purple" style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => setStatus(l.id, 'Approved')}>Approve</button>
                        <button className="btn-ghost-purple" style={{ padding: '4px 10px', fontSize: 12, color: 'var(--red)', borderColor: 'var(--red-light)' }} onClick={() => setStatus(l.id, 'Rejected')}>Reject</button>
                      </div>
                    ) : <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center py-3 mb-0" style={{ color: 'var(--text-muted)', fontSize: 13 }}>No leave applications match your search/filter.</p>
          )}
        </div>
      </div>

      <div className="thought-banner"><i className="ti ti-books me-2"></i>A Reader Today, A Leader Tomorrow.</div>

      <Modal open={showApplyLeave} onClose={() => setShowApplyLeave(false)} title="Apply Leave" icon="ti-calendar-plus"
        footer={<><button className="btn-ghost-purple" onClick={() => setShowApplyLeave(false)}>Cancel</button><button className="btn-purple ms-2" onClick={saveLeave}><i className="ti ti-check"></i>Submit</button></>}>
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label">Staff Member</label>
            <select className="form-select" value={newLeave.staffId} onChange={(e) => setNewLeave({ ...newLeave, staffId: e.target.value })}>
              <option value="">Select staff member</option>
              {staff.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
            </select>
          </div>
          <div className="col-6">
            <label className="form-label">Leave Type</label>
            <select className="form-select" value={newLeave.leaveType} onChange={(e) => setNewLeave({ ...newLeave, leaveType: e.target.value })}>
              {LEAVE_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="col-6"></div>
          <div className="col-6"><label className="form-label">From</label><input type="date" className="form-control" value={newLeave.from} onChange={(e) => setNewLeave({ ...newLeave, from: e.target.value })} /></div>
          <div className="col-6"><label className="form-label">To</label><input type="date" className="form-control" value={newLeave.to} onChange={(e) => setNewLeave({ ...newLeave, to: e.target.value })} /></div>
          <div className="col-12"><label className="form-label">Reason</label><textarea className="form-control" rows="3" placeholder="Reason for leave" value={newLeave.reason} onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })} /></div>
        </div>
      </Modal>
    </>
  );
}
