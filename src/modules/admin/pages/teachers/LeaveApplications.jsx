import React, { useMemo, useState } from 'react';
import Modal from '../../components/Modal';
import { useToast } from '../../components/ToastContext';
import { LEAVE_TYPES, TODAY, formatDateDMY, makeAllStaff, makeLeaveApplications } from '../../data/staffData';

export default function LeaveApplications() {
  const showToast = useToast();
  const [staff] = useState(makeAllStaff);
  const [leaveApps, setLeaveApps] = useState(() => makeLeaveApplications(staff));
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [staffTypeFilter, setStaffTypeFilter] = useState('all');
  const [showApplyLeave, setShowApplyLeave] = useState(false);
  const [newLeave, setNewLeave] = useState({ staffId: '', leaveType: LEAVE_TYPES[0], fromDate: '', toDate: '', reason: '' });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leaveApps.filter((l) => {
      if (statusFilter !== 'all' && l.status.toLowerCase() !== statusFilter) return false;
      if (staffTypeFilter !== 'all' && l.staffType !== staffTypeFilter) return false;
      if (!q) return true;
      return l.staffName.toLowerCase().includes(q) || l.staffId.toLowerCase().includes(q) || l.leaveType.toLowerCase().includes(q);
    });
  }, [leaveApps, search, statusFilter, staffTypeFilter]);

  const pendingCount = leaveApps.filter((l) => l.status === 'Pending').length;

  function applyLeave() {
    if (!newLeave.staffId) { showToast('Please select a staff member', 'ti-alert-circle'); return; }
    if (!newLeave.fromDate || !newLeave.toDate) { showToast('Please select leave dates', 'ti-alert-circle'); return; }
    if (newLeave.toDate < newLeave.fromDate) { showToast('End date cannot be before start date', 'ti-alert-circle'); return; }
    if (!newLeave.reason.trim()) { showToast('Please enter a reason', 'ti-alert-circle'); return; }

    const staffMember = staff.find((s) => s.id === newLeave.staffId);
    const todayIso = TODAY.toISOString().slice(0, 10);
    const id = `LV${String(leaveApps.length + 1).padStart(3, '0')}`;

    setLeaveApps((prev) => [{
      id,
      staffId: staffMember.id,
      staffName: staffMember.name,
      staffType: staffMember.type,
      leaveType: newLeave.leaveType,
      fromDate: newLeave.fromDate,
      toDate: newLeave.toDate,
      reason: newLeave.reason.trim(),
      status: 'Pending',
      appliedOn: todayIso,
    }, ...prev]);
    setShowApplyLeave(false);
    setNewLeave({ staffId: '', leaveType: LEAVE_TYPES[0], fromDate: '', toDate: '', reason: '' });
    showToast('Leave application submitted', 'ti-calendar-plus');
  }

  function setLeaveStatus(id, status) {
    setLeaveApps((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    showToast(`Leave ${status.toLowerCase()}`, status === 'Approved' ? 'ti-circle-check' : 'ti-circle-x');
  }

  return (
    <div>
      <div className="d-flex align-center justify-between flex-wrap gap-3 mb-4">
        <div className="fin-tab-note">Review and manage leave requests from teaching &amp; non-teaching staff</div>
        <div className="d-flex gap-2">
          <button onClick={() => showToast('Preparing leave report (PDF)…', 'ti-file-type-pdf')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', background: 'var(--red-light)', color: 'var(--red)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '8px 16px', fontSize: 13, fontWeight: 600 }}>
            <i className="ti ti-file-type-pdf"></i>PDF
          </button>
          <button onClick={() => showToast('Preparing leave report (Excel)…', 'ti-file-spreadsheet')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', background: 'var(--green-light)', color: 'var(--green)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '8px 16px', fontSize: 13, fontWeight: 600 }}>
            <i className="ti ti-file-spreadsheet"></i>Excel
          </button>
        </div>
      </div>

      <div className="staff-toolbar" style={{ flexWrap: 'nowrap', justifyContent: 'space-between', gap: 12 }}>
        <div className="search-wrap" style={{ maxWidth: 320, flex: '0 0 320px' }}>
          <i className="ti ti-search"></i>
          <input placeholder="Search by staff, type or status…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="d-flex gap-2 align-center" style={{ marginLeft: 'auto', flexWrap: 'nowrap' }}>
          <div className="tab-row" style={{ flexWrap: 'nowrap', justifyContent: 'flex-end' }}>
            {['all', 'pending', 'approved', 'rejected'].map((s) => (
              <button key={s} className={`tab-btn ${statusFilter === s ? 'active' : ''}`} onClick={() => setStatusFilter(s)} style={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                {s}{s === 'pending' && pendingCount > 0 ? ` (${pendingCount})` : ''}
              </button>
            ))}
          </div>
          <select className="form-select" value={staffTypeFilter} onChange={(e) => setStaffTypeFilter(e.target.value)} style={{ maxWidth: 180, minWidth: 150 }}>
            <option value="all">All Staff</option>
            <option value="teaching">Teacher</option>
            <option value="other">Non-Teaching</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 50, color: 'var(--text-muted)' }}>
          <i className="ti ti-calendar-off mb-2" style={{ fontSize: 26, display: 'block' }}></i>
          No leave applications found.
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Staff</th><th>Type</th><th>From</th><th>To</th><th>Reason</th><th>Applied On</th><th>Status</th><th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{l.staffName}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{l.staffId} · {l.staffType === 'teaching' ? 'Teaching' : 'Non-Teaching'}</div>
                  </td>
                  <td>{l.leaveType}</td>
                  <td>{formatDateDMY(l.fromDate)}</td>
                  <td>{formatDateDMY(l.toDate)}</td>
                  <td>{l.reason}</td>
                  <td>{formatDateDMY(l.appliedOn)}</td>
                  <td>
                    <span className={`badge-pill ${l.status === 'Approved' ? 'badge-paid' : l.status === 'Rejected' ? 'badge-unpaid' : 'badge-pending'}`}>
                      {l.status}
                    </span>
                  </td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={showApplyLeave}
        onClose={() => setShowApplyLeave(false)}
        title="Apply for Leave"
        icon="ti-calendar-plus"
        footer={<>
          <button className="btn-sm-light" onClick={() => setShowApplyLeave(false)}>Cancel</button>
          <button className="btn-purple" onClick={applyLeave}>Submit application</button>
        </>}
      >
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Staff member</label>
            <select className="form-select" value={newLeave.staffId} onChange={(e) => setNewLeave({ ...newLeave, staffId: e.target.value })}>
              <option value="">Select staff…</option>
              <optgroup label="Teaching Staff">
                {staff.filter((s) => s.type === 'teaching').map((s) => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
              </optgroup>
              <optgroup label="Non-Teaching Staff">
                {staff.filter((s) => s.type === 'other').map((s) => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
              </optgroup>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Leave type</label>
            <select className="form-select" value={newLeave.leaveType} onChange={(e) => setNewLeave({ ...newLeave, leaveType: e.target.value })}>
              {LEAVE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">From date</label>
            <input type="date" className="form-control" value={newLeave.fromDate} onChange={(e) => setNewLeave({ ...newLeave, fromDate: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">To date</label>
            <input type="date" className="form-control" value={newLeave.toDate} onChange={(e) => setNewLeave({ ...newLeave, toDate: e.target.value })} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Reason</label>
          <textarea className="form-control" rows={3} value={newLeave.reason} onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })} placeholder="Briefly describe the reason for leave" />
        </div>
      </Modal>
    </div>
  );
}
