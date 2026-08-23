import React, { useState } from 'react';
import MiniCalendar from '../components/MiniCalendar';
import Modal from '../components/Modal';
import { useToast } from '../components/ToastContext';

const now = new Date();
const Y = now.getFullYear();
const M = now.getMonth();

const INITIAL_EVENTS = [
  { id: 1, day: 9,  month: 'Jul', title: 'Student counselling',       time: '11:00 AM – 12:00 PM', color: 'var(--purple)' },
  { id: 2, day: 11, month: 'Jul', title: 'Teachers meeting',          time: '4:00 PM – 5:00 PM', color: 'var(--pink)' },
  { id: 3, day: 15, month: 'Jul', title: 'Annual Sports Day',         time: '8:00 AM – 4:00 PM', color: 'var(--teal)' },
  { id: 4, day: 22, month: 'Jul', title: 'Cultural fest rehearsal',   time: '3:00 PM – 6:00 PM', color: 'var(--green)' },
  { id: 5, day: 28, month: 'Jul', title: 'End-of-term exams begin',   time: 'All day', color: 'var(--red)' },
];

export default function CalendarPage() {
  const showToast = useToast();
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: '', date: '', time: '' });

  const eventDays = { [Y]: { [M]: events.map((e) => e.day) } };

  function addEvent() {
    if (!form.title.trim() || !form.date) { showToast('Please fill in title and date', 'ti-alert-circle'); return; }
    const d = new Date(form.date);
    setEvents((ev) => [...ev, {
      id: Date.now(), day: d.getDate(), month: d.toLocaleString('en', { month: 'short' }),
      title: form.title, time: form.time || 'All day', color: 'var(--blue)',
    }]);
    setShowAdd(false);
    setForm({ title: '', date: '', time: '' });
    showToast(`Event "${form.title}" added!`, 'ti-calendar-plus');
  }

  const sorted = [...events].sort((a, b) => a.day - b.day);

  return (
    <div>
      <div className="d-flex align-center justify-between flex-wrap gap-3 mb-4">
        <div className="page-title">
          <h1>Calendar</h1>
          <p>Track school events, meetings and important dates</p>
        </div>
        <button className="btn-purple" onClick={() => setShowAdd(true)}><i className="ti ti-plus"></i>New event</button>
      </div>

      <div className="cal-page-grid">
        <div className="ec-card cal-page-card">
          <div className="ec-card-head">
            <h2>Month view</h2>
          </div>
          <div className="cal-body">
            <MiniCalendar eventDays={eventDays} onSelectDay={(d) => showToast(`Selected ${d.toDateString()}`, 'ti-calendar')} />
          </div>
        </div>

        <div className="ec-card">
          <div className="ec-card-head">
            <h2>Upcoming events</h2>
          </div>
          <div>
            {sorted.map((e) => (
              <div className="event-list-item" key={e.id}>
                <div className="event-list-date" style={{ background: 'var(--purple-light)', color: 'var(--purple)' }}>
                  <small>{e.month}</small>
                  <span>{e.day}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="act-name">{e.title}</div>
                  <div className="act-time">{e.time}</div>
                </div>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: e.color, flexShrink: 0 }}></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal
        open={showAdd} onClose={() => setShowAdd(false)} title="New Event" icon="ti-calendar-plus" filled
        footer={<>
          <button className="btn-sm-light" onClick={() => setShowAdd(false)}>Cancel</button>
          <button className="btn-purple" onClick={addEvent}>Save event</button>
        </>}
      >
        <div className="form-group">
          <label className="form-label">Event title</label>
          <input className="form-control" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Annual Sports Day" />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Date</label>
            <input type="date" className="form-control" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Time</label>
            <input type="time" className="form-control" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
