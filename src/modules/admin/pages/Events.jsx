import React, { useMemo, useState } from 'react';
import Modal from '../components/Modal';
import { useToast } from '../components/ToastContext';

const BANNER_COLORS = ['var(--purple)', 'var(--pink)', 'var(--blue)', 'var(--teal)', 'var(--amber)', 'var(--green)'];

const INITIAL_EVENTS = [
  { id: 1, icon: '🏆', title: 'Annual Sports Day', date: '15 Jul 2026', venue: 'School Ground', status: 'scheduled', desc: 'A full day of athletics, relays and team sports for all age groups.' },
  { id: 2, icon: '🎨', title: 'Art & Craft Exhibition', date: '18 Jul 2026', venue: 'Main Hall', status: 'upcoming', desc: 'Student artwork on display, judged by the art faculty.' },
  { id: 3, icon: '📚', title: 'Science Exhibition', date: '22 Jul 2026', venue: 'Science Block', status: 'planning', desc: 'Student science projects and live demonstrations.' },
  { id: 4, icon: '🎭', title: 'Cultural Fest', date: '28 Jul 2026', venue: 'Auditorium', status: 'upcoming', desc: 'Dance, music and drama performances by students.' },
  { id: 5, icon: '🎤', title: 'Parent-Teacher Meeting', date: '2 Aug 2026', venue: 'Classrooms', status: 'scheduled', desc: 'Termly progress discussion with parents.' },
  { id: 6, icon: '🎓', title: 'Annual Day Ceremony', date: '20 Aug 2026', venue: 'School Auditorium', status: 'planning', desc: 'Prize distribution and year-end celebration.' },
];

export default function Events() {
  const showToast = useToast();
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [form, setForm] = useState({ title: '', date: '', venue: '', icon: '🎓', status: 'upcoming' });

  const filtered = useMemo(() => (statusFilter === 'all' ? events : events.filter((e) => e.status === statusFilter)), [events, statusFilter]);

  function saveEvent() {
    if (!form.title.trim() || !form.date) { showToast('Please fill in title and date', 'ti-alert-circle'); return; }
    setEvents((ev) => [...ev, { id: Date.now(), icon: form.icon, title: form.title, date: form.date, venue: form.venue || 'TBA', status: form.status, desc: 'Details to be announced.' }]);
    setShowAdd(false);
    setForm({ title: '', date: '', venue: '', icon: '🎓', status: 'upcoming' });
    showToast(`Event "${form.title}" added!`, 'ti-calendar-plus');
  }

  return (
    <div>
      <div className="events-toolbar">
        <div className="page-title">
          <h1>Events</h1>
          <p>School events, ceremonies and activities</p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <div className="tab-row">
            {['all','upcoming','scheduled','planning'].map((s) => (
              <button key={s} className={`tab-btn ${statusFilter === s ? 'active' : ''}`} onClick={() => setStatusFilter(s)} style={{ textTransform: 'capitalize' }}>{s}</button>
            ))}
          </div>
          <button className="btn-purple" onClick={() => setShowAdd(true)}><i className="ti ti-plus"></i>New event</button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 50, color: 'var(--text-muted)' }}>
          <i className="ti ti-calendar-x mb-2" style={{ fontSize: 26, display: 'block' }}></i>
          No events found.
        </div>
      ) : (
        <div className="event-grid">
          {filtered.map((e, i) => (
            <div className="event-card" key={e.id} onClick={() => setViewing(e)}>
              <div className="event-banner" style={{ background: BANNER_COLORS[i % BANNER_COLORS.length] }}>{e.icon}</div>
              <div className="event-body">
                <h5>{e.title}</h5>
                <div className="event-meta"><i className="ti ti-calendar"></i>{e.date}</div>
                <div className="event-footer">
                  <span className={`evt-badge ${e.status}`}>{e.status}</span>
                  <span className="text-muted" style={{ fontSize: 12 }}><i className="ti ti-map-pin" style={{ marginRight: 4 }}></i>{e.venue}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={showAdd} onClose={() => setShowAdd(false)} title="New Event" icon="ti-calendar-plus" filled
        footer={<>
          <button className="btn-sm-light" onClick={() => setShowAdd(false)}>Cancel</button>
          <button className="btn-purple" onClick={saveEvent}>Save event</button>
        </>}
      >
        <div className="form-group">
          <label className="form-label">Event name</label>
          <input className="form-control" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Annual Sports Day" />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Date</label>
            <input type="date" className="form-control" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Venue</label>
            <input className="form-control" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} placeholder="e.g. School Auditorium" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Icon</label>
            <select className="form-select" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}>
              <option value="🎓">🎓 Sports / Academic</option>
              <option value="🎨">🎨 Art</option>
              <option value="📚">📚 Science</option>
              <option value="🎭">🎭 Cultural</option>
              <option value="🏆">🏆 Quiz / Award</option>
              <option value="🎤">🎤 Meeting</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="upcoming">Upcoming</option>
              <option value="scheduled">Scheduled</option>
              <option value="planning">Planning</option>
            </select>
          </div>
        </div>
      </Modal>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title={viewing?.title || ''} icon="ti-calendar-event">
        {viewing && (
          <div>
            <div className="event-banner" style={{ borderRadius: 10, marginBottom: 14 }}>{viewing.icon}</div>
            <div className="event-meta mb-3"><i className="ti ti-calendar"></i>{viewing.date}</div>
            <p className="text-muted mb-3">{viewing.desc}</p>
            <div className="d-flex justify-between align-center">
              <span className={`evt-badge ${viewing.status}`}>{viewing.status}</span>
              <span className="text-muted" style={{ fontSize: 13 }}><i className="ti ti-map-pin" style={{ marginRight: 4 }}></i>{viewing.venue}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
