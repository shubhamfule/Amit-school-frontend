import { useEffect, useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import Modal from '../components/Modal';
import { useToast } from '../context/ToastContext';
import { exportToExcel } from '../utils/exportHelpers';
import { apiGet, apiPost } from '../utils/api';
import './Events.css';

const BANNER_COLORS = ['var(--purple)', 'var(--pink)', 'var(--blue)', 'var(--teal)', 'var(--amber)', 'var(--green)'];

const STATUS_OPTIONS = ['Scheduled', 'Upcoming', 'Completed', 'Cancelled'];
const EMPTY_FORM = { title: '', date: '', venue: '', status: 'Upcoming', desc: '', icon: 'ti-calendar-event' };

const badgeClass = { Scheduled: 'badge-issued', Upcoming: 'badge-pending2', Completed: 'badge-available', Cancelled: 'badge-overdue' };

function formatDate(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function Events() {
  const showToast = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [activeEvent, setActiveEvent] = useState(null);

  useEffect(() => {
    let cancelled = false;
    apiGet('/events')
      .then((res) => { if (!cancelled) setEvents((res.data ?? []).map((e) => ({ ...e, id: e._id }))); })
      .catch(() => { if (!cancelled) showToast('Could not load events', 'ti-alert-circle'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

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

  const saveEvent = async () => {
    if (!form.title || !form.date || !form.venue) {
      showToast('Please fill in required fields', 'ti-alert-circle');
      return;
    }
    try {
      const res = await apiPost('/events', form);
      setEvents((prev) => [{ ...res.data, id: res.data._id }, ...prev]);
      setShowAdd(false);
      setForm(EMPTY_FORM);
      showToast('Event added successfully!', 'ti-calendar-plus');
    } catch (err) {
      showToast(err.message || 'Could not add event', 'ti-alert-circle');
    }
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
              <p className="event-meta"><i className="ti ti-calendar me-1"></i>{formatDate(ev.date)}</p>
              <p className="event-meta"><i className="ti ti-map-pin me-1"></i>{ev.venue}</p>
              <p className="event-desc">{ev.desc}</p>
            </div>
          </div>
        ))}
        {loading && (
          <p className="text-center py-4 mb-0" style={{ color: 'var(--text-muted)', fontSize: 13, gridColumn: '1 / -1' }}>Loading events…</p>
        )}
        {!loading && filtered.length === 0 && (
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
            <p className="event-meta"><i className="ti ti-calendar me-1"></i>{formatDate(activeEvent.date)}</p>
            <p className="event-meta"><i className="ti ti-map-pin me-1"></i>{activeEvent.venue}</p>
            <p className="event-meta"><i className="ti ti-tag me-1"></i>{activeEvent.status}</p>
            <p className="mb-0" style={{ color: 'var(--text-secondary)', fontSize: 13.5 }}>{activeEvent.desc}</p>
          </div>
        )}
      </Modal>
    </>
  );
}
