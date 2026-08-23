import React, { useMemo, useState } from 'react';
import Modal from '../Modal';
import { useToast } from '../ToastContext';
import AttendanceCalendar from './AttendanceCalendar';
import {
  MONTH_NAMES, ACADEMIC_YEARS, YEAR_OPTIONS, CURRENT_YEAR, CURRENT_MONTH,
  rupee, formatDateDMY, getAcademicYear, calcExperience,
  generateAttendance, getMonthAttendanceStats,
} from '../../data/staffData';

// Renders the roster grid, stat cards, Add-staff modal and the
// Attendance & Salary detail modal for one staff type ('teaching' or
// 'other'). Used by TeachingStaff.jsx and NonTeachingStaff.jsx so salary
// and attendance stay fully separate per staff type, without duplicating
// ~300 lines of markup between the two pages.
export default function StaffSection({
  staffType,
  idPrefix,
  roleOptions,
  roleFieldLabel,
  makeStaff,
  singular,
  plural,
  addButtonLabel,
  searchPlaceholder,
  designationOptions = [],
  showClasses = false,
}) {
  const showToast = useToast();
  const [staff, setStaff] = useState(makeStaff);
  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState('All');
  const [designationFilter, setDesignationFilter] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [newStaff, setNewStaff] = useState({ id: '', name: '', mobile: '', joiningDate: '', monthlySalary: '' });

  const [viewingId, setViewingId] = useState(null);
  const [attYear, setAttYear] = useState(CURRENT_YEAR);
  const [attMonth, setAttMonth] = useState(CURRENT_MONTH);

  // Month/Year filter driving the "presenty" (attendance/salary) overview stats.
  const [presMonth, setPresMonth] = useState(CURRENT_MONTH);
  const [presYear, setPresYear] = useState(CURRENT_YEAR);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return staff.filter((s) => {
      if (yearFilter !== 'All' && s.academicYear !== yearFilter) return false;
      if (designationFilter !== 'All' && s.role !== designationFilter) return false;
      if (!q) return true;
      return s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.mobile.includes(q);
    });
  }, [staff, yearFilter, designationFilter, search]);

  const presentyStats = useMemo(
    () => filtered.map((s) => ({ id: s.id, ...getMonthAttendanceStats(s, presYear, presMonth) })),
    [filtered, presYear, presMonth]
  );
  const totalPayable = presentyStats.reduce((sum, s) => sum + s.payableSalary, 0);
  const totalPendingAmount = filtered.reduce((sum, s) => {
    const stat = presentyStats.find((c) => c.id === s.id);
    return sum + (s.monthlySalary - (stat ? stat.payableSalary : 0));
  }, 0);

  const viewingStaff = viewingId ? staff.find((s) => s.id === viewingId) : null;
  const monthStats = viewingStaff ? getMonthAttendanceStats(viewingStaff, attYear, attMonth) : null;

  function openAttendance(s) {
    setViewingId(s.id);
    setAttYear(presYear);
    setAttMonth(presMonth);
  }

  function shiftAttMonth(delta) {
    let m = attMonth + delta;
    let y = attYear;
    if (m < 1) { m = 12; y -= 1; }
    if (m > 12) { m = 1; y += 1; }
    setAttMonth(m);
    setAttYear(y);
  }

  function setAttendanceStatus(day, status) {
    setStaff((prev) => prev.map((s) => {
      if (s.id !== viewingId) return s;
      const yearData = { ...(s.attendance[attYear] || {}) };
      const monthData = { ...(yearData[attMonth] || {}) };
      monthData[day] = status;
      yearData[attMonth] = monthData;
      return { ...s, attendance: { ...s.attendance, [attYear]: yearData } };
    }));
  }

  function addStaff() {
    if (!newStaff.id.trim()) { showToast('Please enter an ID', 'ti-alert-circle'); return; }
    if (staff.some((s) => s.id.toLowerCase() === newStaff.id.trim().toLowerCase())) { showToast('That ID is already in use', 'ti-alert-circle'); return; }
    if (!newStaff.name.trim()) { showToast('Please enter a name', 'ti-alert-circle'); return; }
    if (!/^[6-9]\d{9}$/.test(newStaff.mobile.trim())) { showToast('Please enter a valid 10-digit mobile number', 'ti-alert-circle'); return; }
    if (!newStaff.joiningDate) { showToast('Please select a date of joining', 'ti-alert-circle'); return; }
    const salaryNum = Number(newStaff.monthlySalary);
    if (!salaryNum || salaryNum <= 0) { showToast('Please enter a valid monthly salary', 'ti-alert-circle'); return; }

    const id = newStaff.id.trim();
    const countInTab = staff.length;

    setStaff((s) => [...s, {
      id,
      name: newStaff.name.trim(),
      type: staffType,
      mobile: newStaff.mobile.trim(),
      role: roleOptions[countInTab % roleOptions.length] + (staffType === 'teaching' ? ' Teacher' : ''),
      classes: showClasses ? '6th' : '—',
      joiningDate: newStaff.joiningDate,
      monthlySalary: salaryNum,
      academicYear: getAcademicYear(newStaff.joiningDate),
      attendance: generateAttendance(id, newStaff.joiningDate),
    }]);
    setShowAdd(false);
    setNewStaff({ id: '', name: '', mobile: '', joiningDate: '', monthlySalary: '' });
    showToast(`${newStaff.name} added!`, 'ti-user-plus');
  }

  return (
    <div>
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-icon-wrap si-purple"><i className="ti ti-users"></i></div>
          <div><div className="stat-num">{filtered.length}</div><div className="stat-label">Total {plural}</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap si-green"><i className="ti ti-circle-check"></i></div>
          <div><div className="stat-num">{rupee(totalPayable)}</div><div className="stat-label">Payable salary ({MONTH_NAMES[presMonth - 1]} {presYear})</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap si-red"><i className="ti ti-circle-x"></i></div>
          <div><div className="stat-num">{rupee(totalPendingAmount)}</div><div className="stat-label">Deducted for absence ({MONTH_NAMES[presMonth - 1]} {presYear})</div></div>
        </div>
      </div>

      <div className="staff-toolbar">
        <div className="d-flex gap-2 flex-wrap" style={{ flex: 1, minWidth: 220 }}>
          <div className="search-wrap">
            <i className="ti ti-search"></i>
            <input placeholder={searchPlaceholder} value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="form-select" style={{ maxWidth: 190 }} value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
            <option value="All">All Academic Years</option>
            {ACADEMIC_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          {designationOptions.length > 0 && (
            <>
              <select className="form-select" style={{ maxWidth: 180 }} value={designationFilter} onChange={(e) => setDesignationFilter(e.target.value)}>
                <option value="All">All Designations</option>
                {designationOptions.map((designation) => <option key={designation} value={designation}>{designation}</option>)}
              </select>
            </>
          )}
          <select className="form-select" style={{ maxWidth: 150 }} value={presMonth} onChange={(e) => setPresMonth(Number(e.target.value))} title="Attendance month">
            {MONTH_NAMES.map((m, idx) => <option key={m} value={idx + 1}>{m}</option>)}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 50, color: 'var(--text-muted)' }}>
          <i className="ti ti-search mb-2" style={{ fontSize: 26, display: 'block' }}></i>
          No {plural.toLowerCase()} match your search / academic year.
        </div>
      ) : (
        <div className="staff-grid">
          {filtered.map((s) => {
            const stat = presentyStats.find((c) => c.id === s.id);
            const pct = stat && stat.workingDays > 0 ? (stat.present / stat.workingDays) * 100 : null;
            return (
              <div className="staff-card" key={s.id}>
                <div className="staff-avatar">{s.name.split(' ').map((p) => p[0]).join('').slice(0, 2)}</div>
                <div className="staff-name">{s.name}</div>
                <div className="staff-role">{s.id} · {s.role}</div>
                {pct !== null && (
                  <div style={{ fontSize: 12, marginTop: 4, marginBottom: 4 }}>
                    <span className={`badge-pill ${pct >= 90 ? 'badge-paid' : pct < 75 ? 'badge-unpaid' : ''}`}>
                      {pct.toFixed(0)}% present · {MONTH_NAMES[presMonth - 1].slice(0, 3)} {presYear}
                    </span>
                  </div>
                )}
                <button className="btn-sm-light staff-salary-btn" onClick={() => openAttendance(s)}>
                  <i className="ti ti-calendar-dollar"></i>View attendance &amp; salary
                </button>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={showAdd} onClose={() => setShowAdd(false)} title={`Add ${singular}`} icon="ti-user-plus"
        footer={<>
          <button className="btn-sm-light" onClick={() => setShowAdd(false)}>Cancel</button>
          <button className="btn-purple" onClick={addStaff}>Save</button>
        </>}
      >
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">{idPrefix} ID</label>
            <input className="form-control" value={newStaff.id} onChange={(e) => setNewStaff({ ...newStaff, id: e.target.value })} placeholder={`e.g. ${idPrefix}009`} />
          </div>
          <div className="form-group">
            <label className="form-label">Full name</label>
            <input className="form-control" value={newStaff.name} onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })} placeholder="e.g. Anita Desai" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Mobile number</label>
            <input className="form-control" value={newStaff.mobile} onChange={(e) => setNewStaff({ ...newStaff, mobile: e.target.value })} placeholder="10-digit mobile number" />
          </div>
          <div className="form-group">
            <label className="form-label">Date of joining</label>
            <input type="date" className="form-control" value={newStaff.joiningDate} onChange={(e) => setNewStaff({ ...newStaff, joiningDate: e.target.value })} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Monthly salary (₹)</label>
          <input type="number" min="1" className="form-control" value={newStaff.monthlySalary} onChange={(e) => setNewStaff({ ...newStaff, monthlySalary: e.target.value })} placeholder="e.g. 30000" />
        </div>
        {newStaff.joiningDate && (
          <div className="form-hint" style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Academic Year will be set automatically to <strong>{getAcademicYear(newStaff.joiningDate)}</strong>, and experience will be calculated automatically.
          </div>
        )}
      </Modal>

      <Modal
        open={!!viewingStaff}
        onClose={() => setViewingId(null)}
        title={viewingStaff ? `${viewingStaff.name} — Attendance & Salary` : ''}
        icon="ti-calendar-dollar"
        size="lg"
      >
        {viewingStaff && monthStats && (
          <>
            <div className="d-flex align-center gap-2 mb-3">
              <div className="staff-avatar" style={{ width: 44, height: 44, fontSize: 15, margin: 0 }}>
                {viewingStaff.name.split(' ').map((p) => p[0]).join('').slice(0, 2)}
              </div>
              <div>
                <div className="act-name">{viewingStaff.name}</div>
                <div className="act-time">{singular}</div>
              </div>
            </div>

            <div className="ec-card" style={{ padding: 14, marginBottom: 20 }}>
              <div className="fm-title" style={{ marginBottom: 10 }}>{singular} Details</div>
              <div className="form-row mb-2">
                <div><div className="form-label">{idPrefix} ID</div><div>{viewingStaff.id}</div></div>
                <div><div className="form-label">Full Name</div><div>{viewingStaff.name}</div></div>
              </div>
              <div className="form-row mb-2">
                <div><div className="form-label">Mobile Number</div><div>{viewingStaff.mobile}</div></div>
                <div><div className="form-label">Date of Joining</div><div>{formatDateDMY(viewingStaff.joiningDate)}</div></div>
              </div>
              <div className="form-row mb-2">
                <div><div className="form-label">Experience</div><div>{calcExperience(viewingStaff.joiningDate)}</div></div>
                <div><div className="form-label">Academic Year</div><div>{viewingStaff.academicYear}</div></div>
              </div>
              <div className="form-row">
                <div><div className="form-label">Monthly Salary</div><div>{rupee(viewingStaff.monthlySalary)}</div></div>
                <div><div className="form-label">{roleFieldLabel}</div><div>{viewingStaff.role}</div></div>
              </div>
            </div>

            <div className="fm-title" style={{ marginBottom: 10 }}>Attendance &amp; Salary</div>

            <div className="d-flex gap-2 mb-3 flex-wrap">
              <select className="form-select" style={{ maxWidth: 130 }} value={attYear} onChange={(e) => setAttYear(Number(e.target.value))}>
                {Array.from(new Set([...Object.keys(viewingStaff.attendance).map(Number), CURRENT_YEAR])).sort().map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <select className="form-select" style={{ maxWidth: 160 }} value={attMonth} onChange={(e) => setAttMonth(Number(e.target.value))}>
                {MONTH_NAMES.map((m, idx) => <option key={m} value={idx + 1}>{m}</option>)}
              </select>
            </div>

            <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 16 }}>
              <div className="stat-card" style={{ padding: 12 }}>
                <div className="stat-num" style={{ fontSize: 18 }}>{monthStats.workingDays}</div>
                <div className="stat-label">Working Days</div>
              </div>
              <div className="stat-card" style={{ padding: 12 }}>
                <div className="stat-num" style={{ fontSize: 18, color: 'var(--green)' }}>{monthStats.present}</div>
                <div className="stat-label">Present</div>
              </div>
              <div className="stat-card" style={{ padding: 12 }}>
                <div className="stat-num" style={{ fontSize: 18, color: 'var(--red)' }}>{monthStats.absent}</div>
                <div className="stat-label">Absent</div>
              </div>
              <div className="stat-card" style={{ padding: 12 }}>
                <div className="stat-num" style={{ fontSize: 18 }}>{monthStats.workingDays > 0 ? ((monthStats.present / monthStats.workingDays) * 100).toFixed(2) : '0.00'}%</div>
                <div className="stat-label">Attendance</div>
              </div>
            </div>

            <div className="ec-card" style={{ padding: 14, marginBottom: 16 }}>
              <div className="form-row mb-2">
                <div><div className="form-label">Monthly Salary</div><div>{rupee(viewingStaff.monthlySalary)}</div></div>
                <div><div className="form-label">Daily Salary</div><div>{rupee(monthStats.dailySalary)}</div></div>
              </div>
              <div className="form-row">
                <div><div className="form-label">Payable Salary</div><div style={{ fontWeight: 700 }}>{rupee(monthStats.payableSalary)}</div></div>
                <div><div className="form-label">Deducted (Absences)</div><div>{rupee(viewingStaff.monthlySalary - monthStats.payableSalary)}</div></div>
              </div>
            </div>

            <AttendanceCalendar
              attYear={attYear}
              attMonth={attMonth}
              days={monthStats.days}
              onShiftMonth={shiftAttMonth}
              onToggleDay={setAttendanceStatus}
            />
          </>
        )}
      </Modal>
    </div>
  );
}
