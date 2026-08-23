import React, { useState } from 'react';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DNAMES = ['Mo','Tu','We','Th','Fr','Sa','Su'];

export default function MiniCalendar({ eventDays = {}, onSelectDay }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selected, setSelected] = useState(null);

  function prev() { if (month === 0) { setMonth(11); setYear(year - 1); } else setMonth(month - 1); }
  function next() { if (month === 11) { setMonth(0); setYear(year + 1); } else setMonth(month + 1); }

  const firstDay = new Date(year, month, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const dim = new Date(year, month + 1, 0).getDate();
  const evts = (eventDays[year] && eventDays[year][month]) || [];
  const today = new Date();

  const cells = [];
  for (let i = 0; i < offset; i++) cells.push(<div className="cal-d empty" key={`e${i}`} />);
  for (let d = 1; d <= dim; d++) {
    const dow = (offset + d - 1) % 7;
    const isToday = year === today.getFullYear() && month === today.getMonth() && d === today.getDate();
    const isSelected = selected === d;
    const classes = ['cal-d'];
    if (dow >= 5) classes.push('weekend');
    if (evts.includes(d)) classes.push('event');
    if (isToday) classes.push('today');
    else if (isSelected) classes.push('selected');
    cells.push(
      <div
        key={d}
        className={classes.join(' ')}
        onClick={() => { if (!isToday) { setSelected(d); onSelectDay && onSelectDay(new Date(year, month, d)); } }}
      >
        {d}
      </div>
    );
  }
  const rem = (7 - ((offset + dim) % 7)) % 7;
  for (let i = 0; i < rem; i++) cells.push(<div className="cal-d empty" key={`r${i}`} />);

  return (
    <div>
      <div className="d-flex align-center gap-2" style={{ justifyContent: 'flex-end', marginBottom: 4 }}>
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
      <div className="cal-grid">
        {DNAMES.map((d, i) => (
          <div className="cal-dname" key={d} style={i >= 5 ? { color: 'var(--pink)' } : undefined}>{d}</div>
        ))}
        {cells}
      </div>
    </div>
  );
}
