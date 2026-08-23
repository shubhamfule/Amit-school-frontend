import { useState } from "react";
import { Link } from "react-router-dom";
import { getMonthMatrix, toKey, monthLabel, weekDays } from "./calendarUtils";

// Compact, read-only calendar shown on the main Dashboard.
// Highlights today's date and supports Previous/Next month navigation.
export default function MiniCalendar() {
  const today = new Date();
  const [cursor, setCursor] = useState({ year: today.getFullYear(), month: today.getMonth() });

  const cells = getMonthMatrix(cursor.year, cursor.month);
  const todayKey = toKey(today);

  const goPrev = () =>
    setCursor((c) => (c.month === 0 ? { year: c.year - 1, month: 11 } : { year: c.year, month: c.month - 1 }));
  const goNext = () =>
    setCursor((c) => (c.month === 11 ? { year: c.year + 1, month: 0 } : { year: c.year, month: c.month + 1 }));
  const goToday = () => setCursor({ year: today.getFullYear(), month: today.getMonth() });

  return (
    <div className="widget-card mini-calendar-card">
      <div className="mini-cal-title-row">
        <h4>Calendar</h4>
      </div>

      <div className="mini-cal-header">
        <span className="mini-cal-month-label" onClick={goToday} title="Jump to current month">
          {monthLabel(cursor.year, cursor.month)}
        </span>
        <div className="mini-cal-nav">
          <button type="button" className="mini-cal-nav-btn" onClick={goPrev} aria-label="Previous month">
            <i className="bi bi-chevron-left"></i>
          </button>
          <button type="button" className="mini-cal-nav-btn" onClick={goNext} aria-label="Next month">
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>

      <div className="mini-cal-grid mini-cal-weekdays">
        {weekDays.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>

      <div className="mini-cal-grid">
        {cells.map((c, i) => {
          const key = toKey(c.date);
          const isToday = key === todayKey;
          const isWeekend = i % 7 === 5 || i % 7 === 6; // Sa, Su columns
          return (
            <span
              key={i}
              className={`mini-cal-cell ${c.currentMonth ? "" : "is-muted"} ${isWeekend ? "is-weekend" : ""} ${isToday ? "is-today" : ""}`}
              title={isToday ? "Today" : undefined}
            >
              {c.day}
            </span>
          );
        })}
      </div>

      <Link to="/student-accountant/events" className="mini-cal-add-event">
        <i className="bi bi-plus-lg"></i>
        Add event
      </Link>
    </div>
  );
}
