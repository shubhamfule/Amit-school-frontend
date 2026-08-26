import { useEffect, useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import { useToast } from '../context/ToastContext';
import { apiGet, apiPost, apiDelete } from '../utils/api';

const PRIORITY_CLASS = { high: 'badge-unpaid', medium: 'badge-pending', low: 'badge-paid' };

function formatDate(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function Notices() {
  const showToast = useToast();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [form, setForm] = useState({ title: '', date: '', audience: 'All Students', priority: 'medium', body: '' });

  useEffect(() => {
    let cancelled = false;
    apiGet('/notices')
      .then((res) => { if (!cancelled) setNotices(res.data ?? []); })
      .catch(() => { if (!cancelled) showToast('Could not load notices', 'ti-alert-circle'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(
    () => (filter === 'all' ? notices : notices.filter((n) => n.priority === filter)),
    [notices, filter]
  );

  async function saveNotice() {
    if (!form.title.trim() || !form.date) { showToast('Please fill in title and date', 'ti-alert-circle'); return; }
    try {
      const res = await apiPost('/notices', { ...form, body: form.body || 'Details to be announced.' });
      setNotices((list) => [res.data, ...list]);
      setShowAdd(false);
      setForm({ title: '', date: '', audience: 'All Students', priority: 'medium', body: '' });
      showToast('Notice published!', 'ti-speakerphone');
    } catch (err) {
      showToast(err.message || 'Could not publish notice', 'ti-alert-circle');
    }
  }

  async function removeNotice(id) {
    try {
      await apiDelete(`/notices/${id}`);
      setNotices((list) => list.filter((n) => n._id !== id));
      showToast('Notice removed', 'ti-trash');
    } catch {
      showToast('Could not remove notice', 'ti-alert-circle');
    }
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
          {loading ? (
            <p className="text-center py-3 mb-0" style={{ color: 'var(--text-muted)', fontSize: 13 }}>Loading notices…</p>
          ) : filtered.length === 0 ? (
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
                  <tr key={n._id}>
                    <td onClick={() => setViewing(n)} style={{ cursor: 'pointer', fontWeight: 500, color: 'var(--purple)' }}>{n.title}</td>
                    <td>{n.audience}</td>
                    <td>{formatDate(n.date)}</td>
                    <td><span className={`badge-pill ${PRIORITY_CLASS[n.priority]}`} style={{ textTransform: 'capitalize' }}>{n.priority}</span></td>
                    <td>
                      <div className="table-actions">
                        <div className="tbl-icon-btn" title="View" onClick={() => setViewing(n)}><i className="ti ti-eye"></i></div>
                        <div className="tbl-icon-btn danger" title="Remove" onClick={() => removeNotice(n._id)}><i className="ti ti-trash"></i></div>
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
              <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{formatDate(viewing.date)}</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13.5 }} className="mb-3">{viewing.body}</p>
            <div className="form-label">Audience: {viewing.audience}</div>
          </div>
        )}
      </Modal>
    </>
  );
}
