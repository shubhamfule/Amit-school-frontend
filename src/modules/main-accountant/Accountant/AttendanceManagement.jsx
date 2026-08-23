import { useEffect, useMemo, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import PageHeader from "./PageHeader";
import { teachingStaff, nonTeachingStaff } from "./staffAttendanceData";

const weekdayLong = { weekday: "long", day: "2-digit", month: "long", year: "numeric" };
const weekdayShort = { weekday: "long", day: "2-digit", month: "short", year: "numeric" };

function toKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function fromKey(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatDate(date, opts) {
  return date.toLocaleDateString("en-GB", opts);
}

function formatTime(date) {
  let h = date.getHours();
  const m = String(date.getMinutes()).padStart(2, "0");
  const s = String(date.getSeconds()).padStart(2, "0");
  const ampm = h >= 12 ? "pm" : "am";
  h = h % 12 || 12;
  return `${String(h).padStart(2, "0")}:${m}:${s} ${ampm}`;
}

export default function AttendanceManagement() {
  const { showToast } = useOutletContext();
  const dateInputRef = useRef(null);

  const [selectedKey, setSelectedKey] = useState(() => toKey(new Date()));
  const [now, setNow] = useState(new Date());
  const [staffType, setStaffType] = useState("teaching");
  const [search, setSearch] = useState("");
  const [marks, setMarks] = useState({});
  const [savedDates, setSavedDates] = useState({});

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const selectedDate = useMemo(() => fromKey(selectedKey), [selectedKey]);
  const list = staffType === "teaching" ? teachingStaff : nonTeachingStaff;

  const groupKey = `${staffType}-${selectedKey}`;
  const savedForGroup = !!savedDates[groupKey];

  // Use each person's unique "key" (falls back to "id" for teaching staff,
  // which has no key field) so people who share a display ID — e.g. Clerk
  // C001 and Driver C001 — are tracked separately.
  const getMark = (person) => marks[groupKey]?.[person.key || person.id] || "Present";

  const setMark = (person, value) => {
    const markKey = person.key || person.id;
    setMarks((m) => ({
      ...m,
      [groupKey]: { ...(m[groupKey] || {}), [markKey]: value },
    }));
  };

  const filtered = list.filter((s) => s.name.toLowerCase().includes(search.trim().toLowerCase()));

  const presentCount = list.filter((s) => getMark(s) === "Present").length;
  const absentCount = list.filter((s) => getMark(s) === "Absent").length;

  const goPrevDay = () => {
    const d = fromKey(selectedKey);
    d.setDate(d.getDate() - 1);
    setSelectedKey(toKey(d));
  };
  const goNextDay = () => {
    const d = fromKey(selectedKey);
    d.setDate(d.getDate() + 1);
    setSelectedKey(toKey(d));
  };
  const goToday = () => setSelectedKey(toKey(new Date()));

  const openCalendar = () => {
    if (dateInputRef.current?.showPicker) dateInputRef.current.showPicker();
    else dateInputRef.current?.focus();
  };

  const saveAttendance = () => {
    setSavedDates((s) => ({ ...s, [groupKey]: true }));
    showToast(
      `Attendance saved for ${staffType === "teaching" ? "Teaching" : "Non-Teaching"} Staff — ${formatDate(selectedDate, weekdayShort)}`,
      "ti-check"
    );
  };

  return (
    <div>
      <PageHeader title="Attendance Management" subtitle={`Selected date: ${formatDate(selectedDate, weekdayLong)}`} />

      <div className="attn-banner">
        {formatDate(now, weekdayShort)} &nbsp;·&nbsp; {formatTime(now)}
      </div>

      <div className="attn-toolbar">
        <div className="attn-toolbar-left">
          <button className="btn btn-outline" onClick={openCalendar}>
            <i className="bi bi-calendar3"></i> Calendar
          </button>
          <button className="btn btn-outline attn-arrow" onClick={goPrevDay} aria-label="Previous day">
            <i className="bi bi-chevron-left"></i>
          </button>
          <button className="btn btn-outline" onClick={goToday}>
            Today
          </button>
          <button className="btn btn-outline attn-arrow" onClick={goNextDay} aria-label="Next day">
            <i className="bi bi-chevron-right"></i>
          </button>
          <input
            ref={dateInputRef}
            type="date"
            className="form-control attn-date-input"
            value={selectedKey}
            onChange={(e) => e.target.value && setSelectedKey(e.target.value)}
          />
        </div>

        <button className="btn btn-dark" onClick={saveAttendance}>
          <i className="bi bi-check2-circle"></i> Save Attendance
        </button>
      </div>

      <div className="attn-controls-row">
        <div className="attn-search-wrap">
          <input
            type="text"
            className="form-control"
            placeholder="Search staff"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="form-control attn-type-select"
          value={staffType}
          onChange={(e) => {
            setStaffType(e.target.value);
            setSearch("");
          }}
        >
          <option value="teaching">Teaching Staff</option>
          <option value="non-teaching">Non-Teaching Staff</option>
        </select>
      </div>

      <div className="attn-counts">
        <span className="count-pill present">
          <i className="bi bi-check-circle-fill"></i> Present: {presentCount}
        </span>
        <span className="count-pill absent">
          <i className="bi bi-x-circle-fill"></i> Absent: {absentCount}
        </span>
      </div>

      <p className="attn-status-line">
        {savedForGroup
          ? `Attendance saved for ${formatDate(selectedDate, weekdayShort)}.`
          : `No attendance saved yet for ${formatDate(selectedDate, weekdayShort)}.`}
      </p>

      <div className="attn-card">
        <div className="attn-card-head">
          <div className="attn-card-icon">
            <i className="bi bi-clipboard2-check"></i>
          </div>
          <div>
            <h4>{staffType === "teaching" ? "Teaching Staff Attendance" : "Non-Teaching Staff Attendance"}</h4>
            <p>
              {list.length} staff · {formatDate(selectedDate, weekdayShort)}
            </p>
          </div>
        </div>

        <div className="staff-grid">
          {filtered.map((s) => {
            const mark = getMark(s);
            return (
              <div className="staff-item" key={s.key || s.id}>
                <div className="staff-item-top">
                  <span className="staff-id-badge">{s.id}</span>
                  <div className="staff-info">
                    <div className="staff-name">{s.name}</div>
                    <div className="staff-role">
                      {staffType === "teaching" ? `${s.role} · ${s.subject} · ${s.section}` : `${s.role} · ${s.dept}`}
                    </div>
                  </div>
                  <button className="staff-dots" aria-label="More options">
                    <i className="bi bi-three-dots"></i>
                  </button>
                </div>
                <div className="staff-actions">
                  <button
                    className={`staff-pill-btn present ${mark === "Present" ? "active" : ""}`}
                    onClick={() => setMark(s, "Present")}
                  >
                    Present
                  </button>
                  <button
                    className={`staff-pill-btn absent ${mark === "Absent" ? "active" : ""}`}
                    onClick={() => setMark(s, "Absent")}
                  >
                    Absent
                  </button>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="coming-soon" style={{ gridColumn: "1 / -1" }}>
              <i className="bi bi-search"></i>
              <p>No staff match your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
