import React, { useMemo } from 'react';
import { MONTH_NAMES, CAL_DOW_LABELS, CURRENT_YEAR, CURRENT_MONTH, TODAY, buildCalendarWeeks } from '../../data/staffData';

const CAL_STYLES = {
  card: { background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: 16, marginBottom: 16 },
  toolbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  navBtn: { width: 30, height: 30, borderRadius: 8, border: '1px solid var(--border-mid)', background: 'var(--surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  weekdays: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: 0.4, padding: '6px 0', borderBottom: '1px solid var(--border)' },
  weekendLabel: { color: '#d6336c' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' },
  cellWrap: { borderBottom: '1px solid var(--border)', borderRight: '1px solid var(--border)', minHeight: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  legend: { display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 10, fontSize: 12.5, color: 'var(--text-muted)' },
  legendDot: (color) => ({ display: 'inline-block', width: 9, height: 9, borderRadius: '50%', background: color, marginRight: 6 }),
};

function dayCellStyle(cell) {
  const base = { width: '80%', height: '80%', margin: 6, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, cursor: 'default' };
  if (!cell) return { ...base, visibility: 'hidden' };
  const isToday = cell.isToday;
  if (isToday) return { ...base, background: 'var(--purple)', color: '#fff', cursor: cell.status === 'Present' || cell.status === 'Absent' ? 'pointer' : 'default' };
  if (cell.status === 'Present') return { ...base, background: 'var(--green-light)', color: 'var(--green)', cursor: 'pointer' };
  if (cell.status === 'Absent') return { ...base, background: 'var(--red-light)', color: 'var(--red)', cursor: 'pointer' };
  if (cell.status === 'Sunday') return { ...base, color: '#d6336c', opacity: 0.55 };
  return { ...base, color: 'var(--text-muted)', opacity: 0.55 };
}

export default function AttendanceCalendar({ attYear, attMonth, days, onShiftMonth, onToggleDay }) {
  const weeks = useMemo(() => buildCalendarWeeks(days), [days]);
  return (
    <div style={CAL_STYLES.card}>
      <div style={CAL_STYLES.toolbar}>
        <div style={{ fontWeight: 700, fontSize: 15 }}>{MONTH_NAMES[attMonth - 1]} {attYear}</div>
        <div className="d-flex gap-2">
          <button type="button" style={CAL_STYLES.navBtn} onClick={() => onShiftMonth(-1)}><i className="ti ti-chevron-left"></i></button>
          <button type="button" style={CAL_STYLES.navBtn} onClick={() => onShiftMonth(1)}><i className="ti ti-chevron-right"></i></button>
        </div>
      </div>
      <div style={CAL_STYLES.weekdays}>
        {CAL_DOW_LABELS.map((label) => (
          <div key={label} style={label === 'SA' || label === 'SU' ? CAL_STYLES.weekendLabel : undefined}>{label}</div>
        ))}
      </div>
      <div style={CAL_STYLES.grid}>
        {weeks.flat().map((cell, idx) => {
          const isToday = !!cell && attYear === CURRENT_YEAR && attMonth === CURRENT_MONTH && cell.date === TODAY.getDate();
          const enriched = cell ? { ...cell, isToday } : null;
          const clickable = enriched && (enriched.status === 'Present' || enriched.status === 'Absent');
          return (
            <div key={idx} style={CAL_STYLES.cellWrap}>
              <div
                style={dayCellStyle(enriched)}
                title={clickable ? 'Click to toggle Present / Absent' : undefined}
                onClick={() => clickable && onToggleDay(cell.date, cell.status === 'Present' ? 'Absent' : 'Present')}
              >
                {cell ? cell.date : ''}
              </div>
            </div>
          );
        })}
      </div>
      <div style={CAL_STYLES.legend}>
        <span><span style={CAL_STYLES.legendDot('var(--green)')}></span>Present</span>
        <span><span style={CAL_STYLES.legendDot('var(--red)')}></span>Absent</span>
        <span><span style={CAL_STYLES.legendDot('#d6336c')}></span>Sunday / Not applicable</span>
        <span><span style={CAL_STYLES.legendDot('var(--purple)')}></span>Today</span>
      </div>
    </div>
  );
}
