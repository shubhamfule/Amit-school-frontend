import { useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import Modal from '../components/Modal';
import { useToast } from '../context/ToastContext';

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DNAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const TYPE_META = {
  due:      { color: 'var(--red)',   bg: 'var(--red-light)',   fg: 'var(--red)',   label: 'Book Due' },
  holiday:  { color: 'var(--amber)', bg: 'var(--amber-light)', fg: 'var(--amber)', label: 'Holiday' },
  meeting:  { color: 'var(--blue)',  bg: 'var(--blue-light)',  fg: 'var(--blue)',  label: 'Meeting' },
  bookfair: { color: 'var(--pink)',  bg: 'var(--pink-light)',  fg: 'var(--pink)',  label: 'Book Fair' },
  workshop: { color: 'var(--teal)',  bg: 'var(--teal-light)',  fg: 'var(--teal)',  label: 'Workshop' },
};

function iso(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function seedEvents(year, month) {
  return [
    { date: iso(year, month, 2), title: 'Library Committee Meeting', type: 'meeting', time: '11:00 AM' },
    { date: iso(year, month, 5), title: 'Book Fair Setup', type: 'bookfair', time: '09:00 AM' },
    { date: iso(year, month, 8), title: 'Overdue Returns Due — Class 8', type: 'due', time: '' },
    { date: iso(year, month, 14), title: 'Reading Skills Workshop', type: 'workshop', time: '02:00 PM' },
    { date: iso(year, month, 18), title: 'Public Holiday', type: 'holiday', time: '' },
    { date: iso(year, month, 22), title: 'New Arrivals Showcase', type: 'bookfair', time: '10:00 AM' },
    { date: iso(year, month, 28), title: 'Monthly Fine Collection Due', type: 'due', time: '' },
  ];
}

export default function CalendarPage() {
  const showToast = useToast();
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [events, setEvents] = useState(() => seedEvents(today.getFullYear(), today.getMonth()));
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeTypes, setActiveTypes] = useState(Object.keys(TYPE_META));
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: '', date: '', time: '', type: 'due', desc: '' });

  const toggleType = (t) => setActiveTypes((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);

  const goto = (deltaMonths) => {
    let m = viewMonth + deltaMonths, y = viewYear;
    if (m < 0) { m = 11; y--; } else if (m > 11) { m = 0; y++; }
    setViewMonth(m); setViewYear(y);
  };
  const gotoToday = () => { setViewYear(today.getFullYear()); setViewMonth(today.getMonth()); };

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const todayStr = iso(today.getFullYear(), today.getMonth(), today.getDate());

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(<div key={`e${i}`} className="big-cal-day empty" />);
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = iso(viewYear, viewMonth, d);
    const dow = new Date(viewYear, viewMonth, d).getDay();
    const dayEvents = events.filter((ev) => ev.date === dateStr && activeTypes.includes(ev.type));
    const isToday = dateStr === todayStr;
    const classes = ['big-cal-day'];
    if (dow === 0 || dow === 6) classes.push('weekend');
    if (isToday) classes.push('today');
    if (selectedDate === dateStr) classes.push('selected');
    cells.push(
      <div key={d} className={classes.join(' ')} onClick={() => setSelectedDate(dateStr)}>
        <div className="day-num">{d}</div>
        <div className="day-events">
          {dayEvents.slice(0, 2).map((ev, i) => (
            <div key={i} className="day-event-pill" style={{ background: TYPE_META[ev.type].bg, color: TYPE_META[ev.type].fg }}>{ev.title}</div>
          ))}
          {dayEvents.length > 2 && <div className="day-more">+{dayEvents.length - 2} more</div>}
        </div>
      </div>
    );
  }

  const upcoming = useMemo(() => events
    .filter((ev) => ev.date >= todayStr && activeTypes.includes(ev.type))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 8), [events, activeTypes, todayStr]);

  const monthPrefix = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}`;
  const monthEvents = events.filter((ev) => ev.date.startsWith(monthPrefix));
  const stats = {
    total: monthEvents.length,
    due: monthEvents.filter((e) => e.type === 'due').length,
    holidays: monthEvents.filter((e) => e.type === 'holiday').length,
    fairs: monthEvents.filter((e) => e.type === 'bookfair').length,
  };

  const saveEvent = () => {
    if (!form.title || !form.date) { showToast('Please fill in title and date', 'ti-alert-circle'); return; }
    setEvents((prev) => [...prev, { date: form.date, title: form.title, type: form.type, time: form.time }]);
    setShowAdd(false);
    setForm({ title: '', date: '', time: '', type: 'due', desc: '' });
    showToast(`Event "${form.title}" added!`, 'ti-calendar-plus');
  };

  return (
    <>
      <PageHeader
        title="Calendar"
        subtitle="Track library events, book fairs, holidays and important due dates"
        actions={
          <>
            <button className="btn-ghost-purple" onClick={() => window.print()}><i className="ti ti-printer"></i>Print</button>
            <button className="btn-purple" onClick={() => setShowAdd(true)}><i className="ti ti-plus"></i>Add Event</button>
          </>
        }
      />

      <div className="row row-cols-2 row-cols-md-4 g-3 mb-4">
        <StatCard icon="ti-calendar-stats" color="purple" num={stats.total} label="Events this month" />
        <StatCard icon="ti-clock-hour-4" color="red" num={stats.due} label="Upcoming due dates" />
        <StatCard icon="ti-flag" color="amber" num={stats.holidays} label="Holidays" />
        <StatCard icon="ti-books" color="pink" num={stats.fairs} label="Book fair events" />
      </div>

      <div className="cal-layout">
        <div className="ec-card">
          <div className="ec-card-head">
            <h2><i className="ti ti-calendar me-1" style={{ color: 'var(--purple)' }}></i>Event Calendar</h2>
            <div className="cal-nav">
              <button className="cal-today-btn" onClick={gotoToday}>Today</button>
              <div className="cal-nav-btn" onClick={() => goto(-1)}><i className="ti ti-chevron-left"></i></div>
              <div className="cal-month-label">{MONTH_NAMES[viewMonth]} {viewYear}</div>
              <div className="cal-nav-btn" onClick={() => goto(1)}><i className="ti ti-chevron-right"></i></div>
            </div>
          </div>

          <div className="legend">
            {Object.entries(TYPE_META).map(([key, m]) => (
              <div className="legend-item" key={key}><span className="legend-dot" style={{ background: m.color }}></span>{m.label}</div>
            ))}
          </div>

          <div className="big-cal-grid">
            {DNAMES.map((d) => <div className="big-cal-dname" key={d}>{d}</div>)}
          </div>
          <div className="big-cal-grid">{cells}</div>
        </div>

        <div className="d-flex flex-column gap-3">
          <div className="ec-card">
            <div className="ec-card-head"><h2><i className="ti ti-filter me-1" style={{ color: 'var(--purple)' }}></i>Filter Events</h2></div>
            <div className="filter-chip-group">
              {Object.entries(TYPE_META).map(([key, m]) => (
                <label className="filter-chip" key={key}>
                  <input type="checkbox" checked={activeTypes.includes(key)} onChange={() => toggleType(key)} />
                  <span className="filter-dot" style={{ background: m.color }}></span>{m.label}
                </label>
              ))}
            </div>
          </div>

          <div className="ec-card">
            <div className="ec-card-head"><h2><i className="ti ti-list me-1" style={{ color: 'var(--purple)' }}></i>Upcoming Events</h2></div>
            <div className="upcoming-list">
              {upcoming.length === 0 && (
                <div className="upcoming-empty"><i className="ti ti-calendar-off" style={{ fontSize: 22, display: 'block', marginBottom: 6 }}></i>No upcoming events</div>
              )}
              {upcoming.map((ev, i) => {
                const m = TYPE_META[ev.type];
                const d = new Date(ev.date + 'T00:00:00');
                const dateLabel = d.getDate() + ' ' + MONTH_NAMES[d.getMonth()].slice(0, 3) + (ev.time ? ' · ' + ev.time : '');
                return (
                  <div className="upcoming-item" key={i} onClick={() => { setSelectedDate(ev.date); setViewYear(d.getFullYear()); setViewMonth(d.getMonth()); }}>
                    <div className="upcoming-bar" style={{ background: m.color }}></div>
                    <div className="flex-grow-1">
                      <div className="upcoming-title">{ev.title}</div>
                      <div className="upcoming-meta">{dateLabel}</div>
                      <span className="upcoming-type-badge" style={{ background: m.bg, color: m.fg }}>{m.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add New Event"
        footer={<><button className="btn-ghost-purple" onClick={() => setShowAdd(false)}>Cancel</button><button className="btn-purple ms-2" onClick={saveEvent}><i className="ti ti-check"></i>Save Event</button></>}>
        <div className="row g-3">
          <div className="col-12"><label className="form-label">Event Title</label><input className="form-control" placeholder="e.g. Book Fair Setup" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div className="col-md-6"><label className="form-label">Date</label><input type="date" className="form-control" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
          <div className="col-md-6"><label className="form-label">Time (optional)</label><input type="time" className="form-control" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} /></div>
          <div className="col-md-6">
            <label className="form-label">Event Type</label>
            <select className="form-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {Object.entries(TYPE_META).map(([key, m]) => <option key={key} value={key}>{m.label}</option>)}
            </select>
          </div>
          <div className="col-12"><label className="form-label">Description (optional)</label><textarea className="form-control" style={{ height: 70, resize: 'none' }} placeholder="Additional notes…" value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })}></textarea></div>
        </div>
      </Modal>
    </>
  );
}
