import React, { useMemo, useState } from 'react';
import Modal from '../components/Modal';
import { useToast } from '../components/ToastContext';

const PRIORITY_CLASS = { high: 'badge-unpaid', medium: 'badge-pending', low: 'badge-paid' };

const INITIAL_NOTICES = [
  { id: 1, title: 'Term-end exam schedule released', date: '10 Aug 2026', priority: 'high', audience: 'All Students', body: 'The term-end examination timetable has been published. Students should check their class notice boards for exact dates and hall allotments.' },
  { id: 2, title: 'PTM rescheduled to next Saturday', date: '08 Aug 2026', priority: 'medium', audience: 'Parents', body: 'The Parent-Teacher Meeting originally planned for this week has been moved to next Saturday due to the sports day preparations.' },
  { id: 3, title: 'Library books due for return', date: '06 Aug 2026', priority: 'low', audience: 'All Students', body: 'Students holding library books issued before July are requested to return them before the new academic material arrives.' },
  { id: 4, title: 'Staff meeting — new attendance policy', date: '04 Aug 2026', priority: 'medium', audience: 'Staff', body: 'A mandatory staff meeting will be held to walk through the updated attendance and leave policy for the coming term.' },
];

export default function Notices() {
  const showToast = useToast();
  const [notices, setNotices] = useState(INITIAL_NOTICES);
  const [filter, setFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [form, setForm] = useState({ title: '', date: '', audience: 'All Students', priority: 'medium', body: '' });

  const filtered = useMemo(
    () => (filter === 'all' ? notices : notices.filter((n) => n.priority === filter)),
    [notices, filter]
  );

  function saveNotice() {
    if (!form.title.trim() || !form.date) { showToast('Please fill in title and date', 'ti-alert-circle'); return; }
    setNotices((list) => [{ id: Date.now(), ...form, body: form.body || 'Details to be announced.' }, ...list]);
    setShowAdd(false);
    setForm({ title: '', date: '', audience: 'All Students', priority: 'medium', body: '' });
    showToast('Notice published!', 'ti-speakerphone');
  }

  function removeNotice(id) {
    setNotices((list) => list.filter((n) => n.id !== id));
    showToast('Notice removed', 'ti-trash');
  }

  return (
    <div>
      <div className="d-flex align-center justify-between flex-wrap gap-3 mb-4">
        <div className="page-title">
          <h1>Notices</h1>
          <p>School-wide announcements and circulars</p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <div className="tab-row">
            {['all', 'high', 'medium', 'low'].map((p) => (
              <button key={p} className={`tab-btn ${filter === p ? 'active' : ''}`} onClick={() => setFilter(p)} style={{ textTransform: 'capitalize' }}>{p}</button>
            ))}
          </div>
          <button className="btn-purple" onClick={() => setShowAdd(true)}><i className="ti ti-plus"></i>New notice</button>
        </div>
      </div>

      <div className="ec-card">
        <div className="ec-card-head">
          <h2>Recent notices</h2>
          <span className="badge-pill badge-pending">{filtered.length} notices</span>
        </div>
        <div className="table-wrap">
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No notices found.</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Audience</th>
                  <th>Date</th>
                  <th>Priority</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((n) => (
                  <tr key={n.id}>
                    <td onClick={() => setViewing(n)} style={{ cursor: 'pointer', fontWeight: 500 }}>{n.title}</td>
                    <td>{n.audience}</td>
                    <td>{n.date}</td>
                    <td><span className={`badge-pill ${PRIORITY_CLASS[n.priority]}`} style={{ textTransform: 'capitalize' }}>{n.priority}</span></td>
                    <td>
                      <div className="d-flex gap-2">
                        <div className="icon-action" title="View" onClick={() => setViewing(n)}><i className="ti ti-eye"></i></div>
                        <div className="icon-action danger" title="Remove" onClick={() => removeNotice(n.id)}><i className="ti ti-trash"></i></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal
        open={showAdd} onClose={() => setShowAdd(false)} title="New Notice" icon="ti-speakerphone" filled
        footer={<>
          <button className="btn-sm-light" onClick={() => setShowAdd(false)}>Cancel</button>
          <button className="btn-purple" onClick={saveNotice}>Publish</button>
        </>}
      >
        <div className="form-group">
          <label className="form-label">Title</label>
          <input className="form-control" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Term-end exam schedule" />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Date</label>
            <input type="date" className="form-control" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Priority</label>
            <select className="form-select" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Audience</label>
          <select className="form-select" value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })}>
            <option>All Students</option>
            <option>Parents</option>
            <option>Staff</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Message</label>
          <textarea className="form-control" rows={3} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder="Notice details…" />
        </div>
      </Modal>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title={viewing?.title || ''} icon="ti-speakerphone">
        {viewing && (
          <div>
            <div className="d-flex justify-between align-center mb-3">
              <span className={`badge-pill ${PRIORITY_CLASS[viewing.priority]}`} style={{ textTransform: 'capitalize' }}>{viewing.priority} priority</span>
              <span className="text-muted" style={{ fontSize: 12 }}>{viewing.date}</span>
            </div>
            <p className="text-muted mb-3">{viewing.body}</p>
            <div className="form-label">Audience: {viewing.audience}</div>
          </div>
        )}
      </Modal>
    </div>
  );
}
