import { useState } from 'react';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DNAMES = ['Mo','Tu','We','Th','Fr','Sa','Su'];

export default function MiniCalendar({ eventDays = {}, onAddEvent, onSelectDate }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selected, setSelected] = useState(null);

  const prev = () => { if (month === 0) { setMonth(11); setYear((y) => y - 1); } else setMonth((m) => m - 1); };
  const next = () => { if (month === 11) { setMonth(0); setYear((y) => y + 1); } else setMonth((m) => m + 1); };

  const firstDay = new Date(year, month, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const dim = new Date(year, month + 1, 0).getDate();
  const evts = (eventDays[year] && eventDays[year][month]) || [];
  const today = new Date();

  const cells = [];
  for (let i = 0; i < offset; i++) cells.push(<div key={`e${i}`} className="cal-d empty" />);
  for (let d = 1; d <= dim; d++) {
    const dow = (offset + d - 1) % 7;
    const classes = ['cal-d'];
    if (dow >= 5) classes.push('weekend');
    if (evts.includes(d)) classes.push('event');
    const isToday = year === today.getFullYear() && month === today.getMonth() && d === today.getDate();
    if (isToday) classes.push('today');
    if (!isToday && selected === d) classes.push('selected');
    cells.push(
      <div
        key={d}
        className={classes.join(' ')}
        onClick={() => { if (!isToday) setSelected(d); onSelectDate?.(new Date(year, month, d)); }}
      >
        {d}
      </div>
    );
  }
  const rem = (7 - ((offset + dim) % 7)) % 7;
  for (let i = 0; i < rem; i++) cells.push(<div key={`r${i}`} className="cal-d empty" />);

  return (
    <div>
      <div className="d-flex align-items-center justify-content-end gap-2 mb-2">
        <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500, marginRight: 'auto' }}>
          {MONTHS[month]} {year}
        </span>
        <button className="icon-btn" style={{ width: 26, height: 26 }} title="Previous month" onClick={prev}>
          <i className="ti ti-chevron-left" style={{ fontSize: 14 }}></i>
        </button>
        <button className="icon-btn" style={{ width: 26, height: 26 }} title="Next month" onClick={next}>
          <i className="ti ti-chevron-right" style={{ fontSize: 14 }}></i>
        </button>
      </div>
      <div className="cal-body" style={{ padding: 0 }}>
        <div className="cal-grid">
          {DNAMES.map((d, i) => (
            <div key={d} className="cal-dname" style={i >= 5 ? { color: 'var(--pink)' } : undefined}>{d}</div>
          ))}
          {cells}
        </div>
        {onAddEvent && (
          <button className="add-event-btn" onClick={onAddEvent}>
            <i className="ti ti-plus" style={{ fontSize: 15 }}></i>Add event
          </button>
        )}
      </div>
    </div>
  );
}
