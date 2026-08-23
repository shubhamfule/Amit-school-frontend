import { useMemo, useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { apiGet, apiPost } from "../../utils/api";

function formatDate(d) {
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function toInputValue(d) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function toDateString(d) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function StudentAttendance() {
  const { showToast } = useOutletContext();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [query, setQuery] = useState("");
  const [students, setStudents] = useState([]);
  const [status, setStatus] = useState({}); // { studentId: "present" | "absent" }
  const [loading, setLoading] = useState(true);

  // Load students on mount
  useEffect(() => {
    setLoading(true);
    apiGet("/students")
      .then((response) => {
        const studentList = response.data || response;
        setStudents(
          studentList.map((s) => ({
            id: s._id || s.id,
            name: s.name,
            roll: s.roll,
            class: s.class,
            section: s.section,
          }))
        );
      })
      .catch((error) => {
        console.error("Failed to load students:", error);
        showToast(`Failed to load students: ${error.message}`, "ti-alert-triangle");
      })
      .finally(() => setLoading(false));
  }, [showToast]);

  // Load existing attendance for selected date
  useEffect(() => {
    const dateStr = toDateString(selectedDate);
    apiGet(`/attendance?date=${dateStr}`)
      .then((response) => {
        const records = response.data || response;
        const statusMap = {};
        records.forEach((record) => {
          statusMap[record.studentId] = record.status;
        });
        setStatus(statusMap);
      })
      .catch((error) => {
        console.error("Failed to load attendance:", error);
        // Don't show error toast as this might be expected if no attendance exists
      });
  }, [selectedDate]);

  const filtered = useMemo(
    () =>
      students.filter((s) =>
        (s.name || "").toLowerCase().includes(query.toLowerCase())
      ),
    [students, query]
  );

  const presentCount = Object.values(status).filter((v) => v === "present").length;
  const absentCount = Object.values(status).filter((v) => v === "absent").length;
  const markedCount = presentCount + absentCount;

  const mark = (id, value) =>
    setStatus((prev) => ({ ...prev, [id]: prev[id] === value ? undefined : value }));

  const shiftDay = (delta) => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + delta);
    setSelectedDate(next);
  };

  const saveAttendance = async () => {
    try {
      const records = students
        .filter((s) => status[s.id])
        .map((s) => ({
          studentId: s.id,
          studentName: s.name,
          class: s.class,
          status: status[s.id],
        }));

      const dateStr = toDateString(selectedDate);
      await apiPost("/attendance/bulk", {
        date: dateStr,
        records,
      });

      showToast(`Attendance saved for ${formatDate(selectedDate)}`, "ti-check");
    } catch (error) {
      console.error("Failed to save attendance:", error);
      showToast(`Failed to save attendance: ${error.message}`, "ti-alert-triangle");
    }
  };

  if (loading) {
    return (
      <div className="attendance-page">
        <PageHeader title="Attendance Management" subtitle="Loading..." />
        <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
          Loading students...
        </div>
      </div>
    );
  }

  return (
    <div className="attendance-page">
      <PageHeader title="Attendance Management" subtitle={`Selected date: ${formatDate(selectedDate)}`} />

      <div className="attendance-toolbar">
        <button
          onClick={() => setSelectedDate(new Date())}
          className="attendance-btn attendance-btn-neutral"
        >
          Today
        </button>

        <button
          onClick={() => shiftDay(-1)}
          aria-label="Previous day"
          className="attendance-btn attendance-btn-icon"
        >
          ‹
        </button>
        <button
          onClick={() => shiftDay(1)}
          aria-label="Next day"
          className="attendance-btn attendance-btn-icon"
        >
          ›
        </button>

        <input
          type="date"
          value={toInputValue(selectedDate)}
          onChange={(e) => e.target.value && setSelectedDate(new Date(e.target.value))}
          className="attendance-date-input"
        />

        <div className="attendance-toolbar-spacer" />

        <button
          className="attendance-btn attendance-btn-primary"
          onClick={saveAttendance}
        >
          Save Attendance
        </button>
      </div>

      <input
        type="text"
        placeholder="Search students"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="attendance-search"
      />

      <div className="attendance-summary-row">
        <span className="attendance-chip attendance-chip-present">
          ✓ Present: {presentCount}
        </span>
        <span className="attendance-chip attendance-chip-absent">
          ✕ Absent: {absentCount}
        </span>
      </div>

      <div className="attendance-grid">
        {filtered.map((s, idx) => {
          const st = status[s.id];
          const isPresent = st === "present";
          const isAbsent = st === "absent";

          return (
            <div
              key={s.id}
              className={`attendance-student-card ${isPresent ? "is-present" : ""} ${isAbsent ? "is-absent" : ""}`}
            >
              <div className="attendance-student-head">
                <div className="attendance-student-meta">
                  <div className="attendance-student-index">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="attendance-student-name">{s.name}</div>
                    <div className="attendance-student-class">{s.class} - {s.section}</div>
                  </div>
                </div>
                {isPresent && <span className="attendance-state-mark present">✓</span>}
                {isAbsent && <span className="attendance-state-mark absent">✕</span>}
              </div>

              <div className="attendance-state-actions">
                <button
                  onClick={() => mark(s.id, "present")}
                  className={`attendance-state-btn ${isPresent ? "active present" : ""}`}
                >
                  Present
                </button>
                <button
                  onClick={() => mark(s.id, "absent")}
                  className={`attendance-state-btn ${isAbsent ? "active absent" : ""}`}
                >
                  Absent
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}