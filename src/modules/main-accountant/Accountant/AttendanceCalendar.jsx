import { useEffect, useRef, useState } from "react";
import { getMonthMatrix, toKey, monthLabel, weekDays } from "./calendarUtils";

const STORAGE_KEY = "accountant_teacherAttendance";
const CLICK_DELAY = 220; // ms — lets a second click upgrade to a double-click before we commit to "Present"

// Attendance calendar for the Teacher Salary section.
// Single click on a date -> Present (green). Double click -> Absent (red).
// Attendance is persisted to localStorage so it survives refresh/re-render.
export default function AttendanceCalendar() {
  const today = new Date();
  const [cursor, setCursor] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [attendance, setAttendance] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const clickTimerRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(attendance));
    } catch {
      // storage unavailable — attendance simply won't persist across refresh
    }
  }, [attendance]);

  useEffect(() => () => clickTimerRef.current && clearTimeout(clickTimerRef.current), []);

  const cells = getMonthMatrix(cursor.year, cursor.month);
  const todayKey = toKey(today);

  const goPrev = () =>
    setCursor((c) => (c.month === 0 ? { year: c.year - 1, month: 11 } : { year: c.year, month: c.month - 1 }));
  const goNext = () =>
    setCursor((c) => (c.month === 11 ? { year: c.year + 1, month: 0 } : { year: c.year, month: c.month + 1 }));

  const setStatus = (dateKey, status) => {
    setAttendance((prev) => ({ ...prev, [dateKey]: status }));
  };

  const handleClick = (dateKey, currentMonth) => {
    if (!currentMonth) return;
    // Delay the "Present" write briefly so a following double-click can pre-empt it as "Absent".
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    clickTimerRef.current = setTimeout(() => {
      setStatus(dateKey, "Present");
      clickTimerRef.current = null;
    }, CLICK_DELAY);
  };

  const handleDoubleClick = (dateKey, currentMonth) => {
    if (!currentMonth) return;
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
    }
    setStatus(dateKey, "Absent");
  };

  const monthDateKeys = cells.filter((c) => c.currentMonth).map((c) => toKey(c.date));
  const totalPresent = monthDateKeys.filter((k) => attendance[k] === "Present").length;
  const totalAbsent = monthDateKeys.filter((k) => attendance[k] === "Absent").length;

  return (
    <div className="widget-card attendance-cal-card">
      <div className="mini-cal-header">
        <h4><i className="bi bi-calendar2-check"></i>Attendance Calendar</h4>
        <div className="mini-cal-nav">
          <button type="button" className="mini-cal-nav-btn" onClick={goPrev} aria-label="Previous month">
            <i className="bi bi-chevron-left"></i>
          </button>
          <span className="mini-cal-month-label">{monthLabel(cursor.year, cursor.month)}</span>
          <button type="button" className="mini-cal-nav-btn" onClick={goNext} aria-label="Next month">
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>

      <p className="attendance-cal-hint">
        Single-click a date to mark <b>Present</b>, double-click to mark <b>Absent</b>.
      </p>

      <div className="mini-cal-grid mini-cal-weekdays">
        {weekDays.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>

      <div className="mini-cal-grid">
        {cells.map((c, i) => {
          const key = toKey(c.date);
          const status = attendance[key];
          const isToday = key === todayKey;
          return (
            <button
              type="button"
              key={i}
              disabled={!c.currentMonth}
              className={[
                "mini-cal-cell",
                "attendance-cell",
                c.currentMonth ? "" : "is-muted",
                isToday ? "is-today" : "",
                status === "Present" ? "is-present" : "",
                status === "Absent" ? "is-absent" : "",
              ].filter(Boolean).join(" ")}
              onClick={() => handleClick(key, c.currentMonth)}
              onDoubleClick={() => handleDoubleClick(key, c.currentMonth)}
              title={c.currentMonth ? (status ? `${monthLabel(cursor.year, cursor.month)} ${c.day} — ${status}` : `Mark ${c.day}`) : undefined}
            >
              {c.day}
            </button>
          );
        })}
      </div>

      <div className="attendance-summary-row">
        <div className="attendance-summary-chip is-present">
          <i className="bi bi-check-circle-fill"></i>
          Total Present: <b>{totalPresent}</b>
        </div>
        <div className="attendance-summary-chip is-absent">
          <i className="bi bi-x-circle-fill"></i>
          Total Absent: <b>{totalAbsent}</b>
        </div>
      </div>
    </div>
  );
}
