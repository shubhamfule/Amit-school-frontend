import { useState, useMemo } from "react";
import { Link, useOutletContext } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import KpiCard from "../../components/KpiCard";

const quickAccess = [
  { icon: "bi bi-calendar2-plus", label: "Add Class", to: "/teacher/schedule" },
  { icon: "bi bi-clipboard2-check", label: "Mark Attendance", to: "/teacher/attendance" },
  { icon: "bi bi-graph-up", label: "Enter Marks", to: "/teacher/marks" },
  { icon: "bi bi-journal-plus", label: "Create Assignment", to: "/teacher/assignments" },
  { icon: "bi bi-envelope-plus", label: "Leave Applications", to: "/teacher/leave-applications" },
];

const initialTasks = [
  { id: 1, text: "Prepare teaching material for Ch. 4", done: false },
  { id: 2, text: "Grade Unit Test 2 papers", done: false },
  { id: 3, text: "Submit lesson plan for next week", done: true },
  { id: 4, text: "Respond to 2 leave applications", done: false },
];

const defaultTeacherInfo = {
  name: "Shubham Fule",
  employeeId: "TCH-1024",
  department: "Science Department",
  subject: "Mathematics",
  designation: "Mathematics Teacher",
  mobile: "+91 9356912600",
  email: "shubham.fule@school.edu",
};

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getMonthName(date) {
  return date.toLocaleString("default", { month: "long" });
}

function generateMonthAttendance(year, month, todayDate) {
  const daysInMonth = getDaysInMonth(year, month);
  const days = [];

  for (let day = 1; day <= daysInMonth; day++) {
    let status = "unmarked";

    if (day < todayDate) {
      status = day % 7 === 0 ? "absent" : "present";
    }

    days.push({ day, status });
  }

  return days;
}

export default function TeacherDashboard() {
  const { showToast } = useOutletContext();
  const [tasks, setTasks] = useState(initialTasks);
  const [teacherInfo, setTeacherInfo] = useState(defaultTeacherInfo);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [infoDraft, setInfoDraft] = useState(defaultTeacherInfo);

  const startEditInfo = () => {
    setInfoDraft(teacherInfo);
    setIsEditingInfo(true);
  };

  const cancelEditInfo = () => {
    setIsEditingInfo(false);
  };

  const saveEditInfo = () => {
    setTeacherInfo(infoDraft);
    setIsEditingInfo(false);
    showToast("Personal information updated", "ti-check");
  };

  const updateDraftField = (field, value) => {
    setInfoDraft((d) => ({ ...d, [field]: value }));
  };

  const toggleTask = (id) => setTasks((t) => t.map((task) => (task.id === id ? { ...task, done: !task.done } : task)));
  const doneCount = tasks.filter((t) => t.done).length;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentDate = now.getDate();

  const monthLabel = useMemo(() => `${getMonthName(now)} ${currentYear}`, [currentYear, currentMonth]);

  const attendanceDays = useMemo(() => generateMonthAttendance(currentYear, currentMonth, currentDate), [currentYear, currentMonth, currentDate]);

  const { presentCount, absentCount, attendancePct } = useMemo(() => {
    const present = attendanceDays.filter((d) => d.status === "present").length;
    const absent = attendanceDays.filter((d) => d.status === "absent").length;
    const marked = present + absent;
    const pct = marked > 0 ? Math.round((present / marked) * 100) : 0;

    return { presentCount: present, absentCount: absent, attendancePct: pct };
  }, [attendanceDays]);

  const firstWeekday = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7;
  const leadingBlanks = Array.from({ length: firstWeekday });
  const weekdayLabels = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  return (
    <div className="teacher-dashboard-page">
      <PageHeader title={`Good Morning, ${teacherInfo.name}! 👋`} subtitle="Amit Group of Schools | Here's what's happening today" />

      <div className="kpi-grid">
        <KpiCard icon="bi bi-collection-fill" label="Classes" value={4} trend="Today" trendDirection="up" color="#4d0011" bg="var(--purple-light)" />
        <KpiCard icon="bi bi-mortarboard-fill" label="Students" value={168} trend="Across 4 classes" trendDirection="up" color="#2a78d6" bg="var(--blue-light)" />
        <KpiCard icon="bi bi-calendar2-check-fill" label="Attendance" value="92%" trend="1.4%" trendDirection="up" color="#3b6d11" bg="var(--green-light)" />
        <KpiCard icon="bi bi-list-check" label="Pending Tasks" value={tasks.length - doneCount} trend={`${doneCount}/${tasks.length} done`} trendDirection="up" color="#ba7517" bg="var(--amber-light)" />
      </div>

      <div className="quick-actions-grid">
        {quickAccess.map((a) => (
          <Link key={a.label} to={a.to} className="quick-action-btn">
            <i className={a.icon}></i>
            {a.label}
          </Link>
        ))}
      </div>

      <div className="teacher-dashboard-cards">
        
        {/* Personal Information Card */}
        <div className="widget-card teacher-dashboard-card teacher-dashboard-card-personal">
          <div className="card-header-row">
            <h4>
              <i className="bi bi-person-badge-fill"></i> Teacher Personal Information
            </h4>
            {!isEditingInfo && (
              <button className="btn-icon-edit" onClick={startEditInfo} title="Edit personal information">
                <i className="bi bi-pencil-square"></i> Edit
              </button>
            )}
          </div>

          {!isEditingInfo ? (
            <div className="teacher-profile">
              <div className="teacher-profile-photo-wrap">
                {teacherInfo.photo ? (
                  <img src={teacherInfo.photo} alt={teacherInfo.name} className="teacher-profile-image" />
                ) : (
                  <div className="teacher-profile-image teacher-profile-fallback">
                    <i className="bi bi-person-fill"></i>
                  </div>
                )}
              </div>

              <div className="teacher-profile-content">
                <div className="teacher-profile-name">{teacherInfo.name}</div>
                <div className="teacher-profile-id">
                  <i className="bi bi-person-vcard"></i> {teacherInfo.employeeId}
                </div>

                <div className="teacher-profile-grid">
                  <div className="teacher-profile-item">
                    <span className="teacher-info-label">Department</span>
                    <span className="teacher-info-value">{teacherInfo.department}</span>
                  </div>
                  <div className="teacher-profile-item">
                    <span className="teacher-info-label">Subject</span>
                    <span className="teacher-info-value">{teacherInfo.subject}</span>
                  </div>
                  <div className="teacher-profile-item">
                    <span className="teacher-info-label">Designation</span>
                    <span className="teacher-info-value">{teacherInfo.designation}</span>
                  </div>
                  <div className="teacher-profile-item">
                    <span className="teacher-info-label">Mobile</span>
                    <span className="teacher-info-value">{teacherInfo.mobile}</span>
                  </div>
                  <div className="teacher-profile-item teacher-profile-item-full">
                    <span className="teacher-info-label">Email</span>
                    <span className="teacher-info-value">{teacherInfo.email}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="teacher-info-edit-form">
              <div className="edit-field">
                <label className="teacher-info-label">Name</label>
                <input className="edit-input" value={infoDraft.name} onChange={(e) => updateDraftField("name", e.target.value)} />
              </div>
              <div className="edit-field">
                <label className="teacher-info-label">Designation</label>
                <input className="edit-input" value={infoDraft.designation} onChange={(e) => updateDraftField("designation", e.target.value)} />
              </div>
              <div className="edit-field-row">
                <div className="edit-field">
                  <label className="teacher-info-label">Employee ID</label>
                  <input className="edit-input" value={infoDraft.employeeId} onChange={(e) => updateDraftField("employeeId", e.target.value)} />
                </div>
                <div className="edit-field">
                  <label className="teacher-info-label">Department</label>
                  <input className="edit-input" value={infoDraft.department} onChange={(e) => updateDraftField("department", e.target.value)} />
                </div>
              </div>
              <div className="edit-field-row">
                <div className="edit-field">
                  <label className="teacher-info-label">Subject</label>
                  <input className="edit-input" value={infoDraft.subject} onChange={(e) => updateDraftField("subject", e.target.value)} />
                </div>
                <div className="edit-field">
                  <label className="teacher-info-label">Mobile</label>
                  <input className="edit-input" value={infoDraft.mobile} onChange={(e) => updateDraftField("mobile", e.target.value)} />
                </div>
              </div>
              <div className="edit-field">
                <label className="teacher-info-label">Email</label>
                <input className="edit-input" type="email" value={infoDraft.email} onChange={(e) => updateDraftField("email", e.target.value)} />
              </div>

              <div className="edit-actions">
                <button className="btn btn-dark" onClick={saveEditInfo}>
                  <i className="bi bi-check-lg"></i> Save
                </button>
                <button className="btn btn-outline" onClick={cancelEditInfo}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Monthly Attendance Card */}
        <div className="widget-card teacher-dashboard-card teacher-dashboard-card-attendance">
          <div className="card-header-row">
            <h4>
              <i className="bi bi-calendar3"></i> Teacher Monthly Attendance
            </h4>
          </div>

          <div className="attendance-title">{monthLabel}</div>

          <div className="attendance-calendar" style={{ marginTop: "12px" }}>
            <div className="attendance-weekday-row">
              {weekdayLabels.map((day, index) => (
                <span key={`${day}-${index}`} className="attendance-weekday">
                  {day}
                </span>
              ))}
            </div>

            <div className="attendance-calendar-grid">
              {leadingBlanks.map((_, i) => (
                <div key={`blank-${i}`} className="attendance-day attendance-day-blank" />
              ))}
              {attendanceDays.map(({ day, status }) => (
                <div
                  key={day}
                  className={`attendance-day ${status}`}
                  title={status === "present" ? `${day} — Present` : status === "absent" ? `${day} — Absent` : `${day} — Not Marked`}
                  aria-label={status === "present" ? `${day} present` : status === "absent" ? `${day} absent` : `${day} unmarked`}
                >
                  <span>{day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="attendance-legend">
            <span className="legend-item"><span className="legend-dot present"></span>Present</span>
            <span className="legend-item"><span className="legend-dot absent"></span>Absent</span>
            <span className="legend-item"><span className="legend-dot unmarked"></span>Not Marked</span>
          </div>
        </div>

      </div>

      <div className="dash-grid-2" style={{ marginBottom: 0 }}>
        <div className="widget-card">
          <h4><i className="bi bi-list-check"></i>To-Do List</h4>
          <ul className="widget-list">
            {tasks.map((t) => (
              <li key={t.id} style={{ cursor: "pointer" }} onClick={() => toggleTask(t.id)}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input type="checkbox" checked={t.done} readOnly style={{ accentColor: "var(--purple-dark)" }} />
                  <span className="w-title" style={{ textDecoration: t.done ? "line-through" : "none", color: t.done ? "var(--text-muted)" : "var(--text-primary)" }}>
                    {t.text}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="widget-card">
          <h4><i className="bi bi-clipboard2-check-fill"></i>Teacher's Attendance Overview</h4>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", padding: "10px 0" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: "var(--green)" }}>{presentCount}</div>
              <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>Present Days</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: "var(--red)" }}>{absentCount}</div>
              <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>Absent Days</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: "var(--purple-dark)" }}>{attendancePct}%</div>
              <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>This Month</div>
            </div>
          </div>
          <button className="btn btn-dark" style={{ width: "100%", justifyContent: "center" }} onClick={() => showToast("Attendance report generated", "ti-check")}>
            <i className="bi bi-file-earmark-bar-graph"></i> Generate Report
          </button>
        </div>
      </div>

    </div>
  );
}