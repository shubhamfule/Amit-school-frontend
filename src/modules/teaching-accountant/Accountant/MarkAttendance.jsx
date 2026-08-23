import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import PageHeader from "./PageHeader";
import LiveClock from "./LiveClock";
import { teacherRows } from "./salaryData";
import {
  loadAllAttendance,
  saveAllAttendance,
  todayKey,
  formatDateLabel,
  shiftDateKey,
} from "./attendanceStore";

const STATUS_OPTIONS = ["Present", "Absent"];

// Attendance Management — Teaching module.
// Card-based layout (one card per staff member) so the admin can mark
// Present / Absent for a chosen date at a glance — every card is a real
// Teaching staff member pulled straight from the staff directory.
// Marks are kept as a local draft while the admin taps through the cards and
// are only written to storage when "Save Attendance" is pressed, saving
// everyone's status for that date in one go.
export default function MarkAttendance() {
  const outlet = useOutletContext() || {};
  const showToast = outlet.showToast || (() => {});
  const [allAttendance, setAllAttendance] = useState(loadAllAttendance);
  const [date, setDate] = useState(todayKey());
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState(() => ({ ...loadAllAttendance()[todayKey()] }));

  // Reset the draft whenever the selected date changes, pre-filling it with
  // whatever was already saved for that date (if anything).
  useEffect(() => {
    setDraft({ ...allAttendance[date] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const setStatus = (employeeKey, status) => {
    setDraft((prev) => {
      const next = { ...prev };
      if (next[employeeKey] === status) delete next[employeeKey];
      else next[employeeKey] = status;
      return next;
    });
  };

  const saveAttendance = () => {
    const next = { ...allAttendance, [date]: draft };
    setAllAttendance(next);
    saveAllAttendance(next);
    showToast(`Attendance saved for ${formatDateLabel(date)}`, "bi bi-check-circle");
  };

  const filteredStaff = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return teacherRows;
    return teacherRows.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.designation.toLowerCase().includes(q)
    );
  }, [search]);

  const counts = useMemo(() => {
    const c = { Present: 0, Absent: 0 };
    teacherRows.forEach((s) => {
      const st = draft[s.key];
      if (st && c[st] !== undefined) c[st] += 1;
    });
    return c;
  }, [draft]);

  const markedCount = Object.keys(draft).length;
  const savedCount = Object.keys(allAttendance[date] || {}).length;
  const isDirty = JSON.stringify(draft) !== JSON.stringify(allAttendance[date] || {});

  return (
    <div>
      <PageHeader title="Attendance Management" subtitle={`Selected date: ${formatDateLabel(date)}`} />
      <LiveClock />

      <div className="attendance-mgr">
        <div className="attendance-cal-toolbar">
          <button type="button" className="btn btn-outline attendance-cal-label">
            <i className="bi bi-calendar3"></i> Calendar
          </button>
          <button type="button" className="attendance-nav-btn" onClick={() => setDate((d) => shiftDateKey(d, -1))} aria-label="Previous day">
            <i className="bi bi-chevron-left"></i>
          </button>
          <button type="button" className="btn btn-outline" onClick={() => setDate(todayKey())}>
            Today
          </button>
          <button type="button" className="attendance-nav-btn" onClick={() => setDate((d) => shiftDateKey(d, 1))} aria-label="Next day">
            <i className="bi bi-chevron-right"></i>
          </button>
          <input
            type="date"
            className="form-control attendance-date-picker"
            value={date}
            onChange={(e) => setDate(e.target.value || todayKey())}
          />
          <button type="button" className="btn btn-dark attendance-save-btn" onClick={saveAttendance} disabled={!isDirty}>
            <i className="bi bi-save2-fill"></i> Save Attendance
          </button>
        </div>

        <div className="attendance-field attendance-search-field">
          <input
            type="text"
            className="form-control"
            placeholder="Search staff"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="attendance-summary-row">
          <div className="attendance-summary-chip is-present">
            <i className="bi bi-check-circle-fill"></i> Present: <b>{counts.Present}</b>
          </div>
          <div className="attendance-summary-chip is-absent">
            <i className="bi bi-x-circle-fill"></i> Absent: <b>{counts.Absent}</b>
          </div>
        </div>

        <p className="attendance-mgr-hint">
          {isDirty
            ? `${markedCount} of ${teacherRows.length} staff marked — press "Save Attendance" to save everyone's status for ${formatDateLabel(date)}.`
            : savedCount > 0
            ? `Attendance for ${formatDateLabel(date)} is saved — ${savedCount} of ${teacherRows.length} staff recorded.`
            : `No attendance saved yet for ${formatDateLabel(date)}.`}
        </p>

        <div className="attendance-card-panel">
          <div className="attendance-card-panel-head">
            <span className="attendance-card-panel-icon"><i className="bi bi-clipboard2-check-fill"></i></span>
            <div>
              <h4>Teaching Staff Attendance</h4>
              <p>{teacherRows.length} staff · {formatDateLabel(date)}</p>
            </div>
          </div>

          <div className="attendance-people-grid">
            {filteredStaff.map((s) => {
              const status = draft[s.key];
              const cardState = status === "Present" ? "is-present" : status === "Absent" ? "is-absent" : "";
              return (
                <div className={`attendance-person-card ${cardState}`} key={s.key}>
                  <div className="attendance-person-top">
                    <span className="attendance-person-num">{s.id}</span>
                    <div className="attendance-person-info">
                      <span className="attendance-person-name">{s.name}</span>
                      <span className="attendance-person-meta">{s.designation} · {s.meta}</span>
                    </div>
                    <span className={`attendance-person-flag ${status === "Present" ? "flag-present" : status === "Absent" ? "flag-absent" : "flag-none"}`}>
                      {status === "Present" && <i className="bi bi-check-lg"></i>}
                      {status === "Absent" && <i className="bi bi-x-lg"></i>}
                      {status !== "Present" && status !== "Absent" && "•"}
                    </span>
                  </div>
                  <div className="attendance-status-group">
                    {STATUS_OPTIONS.map((opt) => (
                      <button
                        type="button"
                        key={opt}
                        className={`attendance-status-btn status-${opt.toLowerCase()} ${status === opt ? "is-active" : ""}`}
                        onClick={() => setStatus(s.key, opt)}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
            {filteredStaff.length === 0 && (
              <div className="widget-empty" style={{ gridColumn: "1 / -1" }}>No staff match your search.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
