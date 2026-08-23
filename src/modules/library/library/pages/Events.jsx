import { useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import Modal from '../components/Modal';
import { useToast } from '../context/ToastContext';
import { exportToExcel } from '../utils/exportHelpers';
import './Events.css';

const BANNER_COLORS = ['var(--purple)', 'var(--pink)', 'var(--blue)', 'var(--teal)', 'var(--amber)', 'var(--green)'];

const INITIAL_EVENTS = [
  { id: 'EVT-001', icon: 'ti-trophy', title: 'Annual Sports Day', date: '15 Jul 2024', venue: 'School Ground', status: 'Scheduled', desc: 'A full day of athletics, relays and team sports for all age groups.' },
  { id: 'EVT-002', icon: 'ti-palette', title: 'Art & Craft Exhibition', date: '18 Jul 2024', venue: 'Main Hall', status: 'Upcoming', desc: 'Student artwork on display, judged by the art faculty.' },
  { id: 'EVT-003', icon: 'ti-flask', title: 'Science Exhibition', date: '22 Jul 2024', venue: 'Science Block', status: 'Upcoming', desc: 'Student-led experiments and working models across all branches of science.' },
  { id: 'EVT-004', icon: 'ti-books', title: 'Book Fair & Author Meet', date: '12 Jul 2024', venue: 'Library Lawn', status: 'Scheduled', desc: 'Browse and buy from a curated selection of books, with a live author meet.' },
  { id: 'EVT-005', icon: 'ti-microphone-2', title: 'Annual Reading Marathon', date: '15 Jul 2024', venue: 'Auditorium', status: 'Completed', desc: 'A day-long collective reading session across every grade.' },
  { id: 'EVT-006', icon: 'ti-gift', title: 'Book Donation Drive', date: '18 Jul 2024', venue: 'Library Entrance', status: 'Completed', desc: 'Collecting gently-used books from students and staff for donation.' },
];

const STATUS_OPTIONS = ['Scheduled', 'Upcoming', 'Completed', 'Cancelled'];
const EMPTY_FORM = { title: '', date: '', venue: '', status: 'Upcoming', desc: '', icon: 'ti-calendar-event' };

const badgeClass = { Scheduled: 'badge-issued', Upcoming: 'badge-pending2', Completed: 'badge-available', Cancelled: 'badge-overdue' };

export default function Events() {
  const showToast = useToast();
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [activeEvent, setActiveEvent] = useState(null);

  const filtered = useMemo(() => events.filter((e) => {
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || `${e.title} ${e.venue} ${e.id}`.toLowerCase().includes(q);
    const matchesStatus = !statusFilter || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  }), [events, search, statusFilter]);

  const stats = {
    total: events.length,
    upcoming: events.filter((e) => e.status === 'Upcoming').length,
    scheduled: events.filter((e) => e.status === 'Scheduled').length,
    completed: events.filter((e) => e.status === 'Completed').length,
  };

  const saveEvent = () => {
    if (!form.title || !form.date || !form.venue) {
      showToast('Please fill in required fields', 'ti-alert-circle');
      return;
    }
    const newId = 'EVT-' + String(events.length + 1).padStart(3, '0');
    setEvents((prev) => [{ id: newId, ...form }, ...prev]);
    setShowAdd(false);
    setForm(EMPTY_FORM);
    showToast('Event added successfully!', 'ti-calendar-plus');
  };

  const exportEvents = () => exportToExcel('events', [
    { key: 'id', label: 'Event ID' }, { key: 'title', label: 'Title' }, { key: 'date', label: 'Date' },
    { key: 'venue', label: 'Venue' }, { key: 'status', label: 'Status' },
  ], filtered);

  return (
    <>
      <PageHeader
        title="Events"
        subtitle="Plan, track and manage every school & library event"
        actions={<button className="btn-purple" onClick={() => setShowAdd(true)}><i className="ti ti-calendar-plus"></i>Add event</button>}
      />

      <div className="row row-cols-2 row-cols-md-4 g-3 mb-4">
        <StatCard icon="ti-calendar-stats" num={stats.total} label="Total events" />
        <StatCard icon="ti-clock-hour-4" num={stats.upcoming} label="Upcoming events" />
        <StatCard icon="ti-calendar-event" num={stats.scheduled} label="Scheduled events" />
        <StatCard icon="ti-circle-check" num={stats.completed} label="Completed events" />
      </div>

      <div className="ec-card mb-3">
        <div className="p-3 d-flex flex-wrap gap-2 align-items-center events-toolbar">
          <div className="flex-grow-1" style={{ minWidth: 220 }}>
            <input type="search" className="form-control" placeholder="Search by title, venue, or event ID…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <select className="form-select" style={{ maxWidth: 170 }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All status</option>
              {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
            </select>
            <button className="export-btn excel" onClick={exportEvents}><i className="ti ti-file-spreadsheet"></i>Excel Sheet</button>
          </div>
        </div>
      </div>

      <div className="event-grid">
        {filtered.map((ev, i) => (
          <div className="event-card" key={ev.id} onClick={() => setActiveEvent(ev)}>
            <div className="event-banner" style={{ background: BANNER_COLORS[i % BANNER_COLORS.length] }}>
              <i className={`ti ${ev.icon}`}></i>
            </div>
            <div className="event-body">
              <div className="d-flex align-items-start justify-content-between gap-2">
                <h5>{ev.title}</h5>
                <span className={`badge-status ${badgeClass[ev.status]}`}>{ev.status}</span>
              </div>
              <p className="event-meta"><i className="ti ti-calendar me-1"></i>{ev.date}</p>
              <p className="event-meta"><i className="ti ti-map-pin me-1"></i>{ev.venue}</p>
              <p className="event-desc">{ev.desc}</p>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center py-4 mb-0" style={{ color: 'var(--text-muted)', fontSize: 13, gridColumn: '1 / -1' }}>No events match your search/filter.</p>
        )}
      </div>

      <div className="thought-banner"><i className="ti ti-books me-2"></i>A Reader Today, A Leader Tomorrow.</div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Event" icon="ti-calendar-plus"
        footer={<><button className="btn-ghost-purple" onClick={() => setShowAdd(false)}>Cancel</button><button className="btn-purple ms-2" onClick={saveEvent}><i className="ti ti-check"></i>Save Event</button></>}>
        <div className="row g-3">
          <div className="col-12"><label className="form-label">Event Title</label><input className="form-control" placeholder="e.g. Annual Sports Day" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div className="col-6"><label className="form-label">Date</label><input type="date" className="form-control" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
          <div className="col-6"><label className="form-label">Venue</label><input className="form-control" placeholder="e.g. Main Hall" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} /></div>
          <div className="col-6">
            <label className="form-label">Status</label>
            <select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="col-12"><label className="form-label">Description</label><textarea className="form-control" rows="3" placeholder="Brief description of the event" value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} /></div>
        </div>
      </Modal>

      <Modal open={!!activeEvent} onClose={() => setActiveEvent(null)} title={activeEvent?.title} icon={activeEvent?.icon}
        footer={<button className="btn-purple" onClick={() => setActiveEvent(null)}>Close</button>}>
        {activeEvent && (
          <div>
            <p className="event-meta"><i className="ti ti-calendar me-1"></i>{activeEvent.date}</p>
            <p className="event-meta"><i className="ti ti-map-pin me-1"></i>{activeEvent.venue}</p>
            <p className="event-meta"><i className="ti ti-tag me-1"></i>{activeEvent.status}</p>
            <p className="mb-0" style={{ color: 'var(--text-secondary)', fontSize: 13.5 }}>{activeEvent.desc}</p>
          </div>
        )}
      </Modal>
    </>
  );
}
