import { useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import { useToast } from '../context/ToastContext';

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
    <>
      <PageHeader
        title="Notices"
        subtitle="School-wide announcements and circulars"
        actions={
          <>
            <div className="seg-tabs">
              {['all', 'high', 'medium', 'low'].map((p) => (
                <button
                  key={p}
                  className={`seg-tab ${filter === p ? 'active' : ''}`}
                  style={{ textTransform: 'capitalize' }}
                  onClick={() => setFilter(p)}
                >
                  {p}
                </button>
              ))}
            </div>
            <button className="btn-purple" onClick={() => setShowAdd(true)}><i className="ti ti-plus"></i>New notice</button>
          </>
        }
      />

      <div className="ec-card">
        <div className="ec-card-head">
          <h2>Recent notices</h2>
          <span className="badge-pill badge-pending">{filtered.length} notices</span>
        </div>
        <div className="lib-table-wrap">
          {filtered.length === 0 ? (
            <p className="text-center py-3 mb-0" style={{ color: 'var(--text-muted)', fontSize: 13 }}>No notices found.</p>
          ) : (
            <table className="ec-table">
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
                    <td onClick={() => setViewing(n)} style={{ cursor: 'pointer', fontWeight: 500, color: 'var(--purple)' }}>{n.title}</td>
                    <td>{n.audience}</td>
                    <td>{n.date}</td>
                    <td><span className={`badge-pill ${PRIORITY_CLASS[n.priority]}`} style={{ textTransform: 'capitalize' }}>{n.priority}</span></td>
                    <td>
                      <div className="table-actions">
                        <div className="tbl-icon-btn" title="View" onClick={() => setViewing(n)}><i className="ti ti-eye"></i></div>
                        <div className="tbl-icon-btn danger" title="Remove" onClick={() => removeNotice(n.id)}><i className="ti ti-trash"></i></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="thought-banner"><i className="ti ti-books me-2"></i>A Reader Today, A Leader Tomorrow.</div>

      <Modal
        open={showAdd} onClose={() => setShowAdd(false)} title="New Notice" icon="ti-speakerphone"
        footer={<>
          <button className="btn-ghost-purple" onClick={() => setShowAdd(false)}>Cancel</button>
          <button className="btn-purple ms-2" onClick={saveNotice}><i className="ti ti-check"></i>Publish</button>
        </>}
      >
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label">Title</label>
            <input className="form-control" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Term-end exam schedule" />
          </div>
          <div className="col-6">
            <label className="form-label">Date</label>
            <input type="date" className="form-control" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <div className="col-6">
            <label className="form-label">Priority</label>
            <select className="form-select" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div className="col-12">
            <label className="form-label">Audience</label>
            <select className="form-select" value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })}>
              <option>All Students</option>
              <option>Parents</option>
              <option>Staff</option>
            </select>
          </div>
          <div className="col-12">
            <label className="form-label">Message</label>
            <textarea className="form-control" rows={3} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder="Notice details…" />
          </div>
        </div>
      </Modal>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title={viewing?.title || ''} icon="ti-speakerphone">
        {viewing && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className={`badge-pill ${PRIORITY_CLASS[viewing.priority]}`} style={{ textTransform: 'capitalize' }}>{viewing.priority} priority</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{viewing.date}</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13.5 }} className="mb-3">{viewing.body}</p>
            <div className="form-label">Audience: {viewing.audience}</div>
          </div>
        )}
      </Modal>
    </>
  );
}
