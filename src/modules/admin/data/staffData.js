// ============================================================
// Staff data source for the Teachers module (Teaching Staff,
// Non-Teaching Staff, Leave Applications). Kept in one place so
// all three sub-pages share identical staff records, attendance
// logic and salary math instead of drifting apart.
// ============================================================

export const SUBJECTS = ['Mathematics', 'Science', 'English', 'Social Studies', 'Hindi', 'Computer Science', 'Physical Education', 'Art'];
export const OTHER_ROLES = ['Cleaner', 'Clerk', 'Driver', 'Librarian', 'Peon', 'Security Guard'];
export const TEACHING_NAMES = ['Anita Desai', 'Rajesh Kumar', 'Fatima Khan', 'Suresh Iyer', 'Lakshmi Menon', 'Vikas Chopra', 'Neha Kapoor', 'Manoj Tiwari'];
export const OTHER_NAMES = ['Sunita Rao', 'Arvind Bose', 'Geeta Nair', 'Deepak Malhotra'];
export const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const CAL_DOW_LABELS = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU']; // Monday-first, matches calendar UI
export const ACADEMIC_YEARS = ['2022-23', '2023-24', '2024-25', '2025-26', '2026-27'];
export const YEAR_OPTIONS = [2022, 2023, 2024, 2025, 2026];
export const LEAVE_TYPES = ['Sick Leave', 'Casual Leave', 'Earned Leave', 'Maternity/Paternity Leave', 'Unpaid Leave'];

export const TODAY = new Date();
export const CURRENT_YEAR = TODAY.getFullYear();
export const CURRENT_MONTH = TODAY.getMonth() + 1; // 1-12

export const rupee = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`;

// Formats "2022-06-15" as "15/06/2022" for display.
export const formatDateDMY = (isoDateStr) => {
  if (!isoDateStr) return '—';
  const [y, m, d] = isoDateStr.split('-');
  return `${d}/${m}/${y}`;
};

// ---- Date / academic-year helpers -----------------------------------

// Indian academic sessions run April -> March. A joining date of Apr..Dec
// belongs to that calendar year's session; Jan..Mar belongs to the
// previous calendar year's session.
export function getAcademicYear(joiningDateStr) {
  const d = new Date(joiningDateStr);
  const y = d.getMonth() >= 3 ? d.getFullYear() : d.getFullYear() - 1;
  return `${y}-${String((y + 1) % 100).padStart(2, '0')}`;
}

// Computes "X Years Y Months" experience from joining date to now.
export function calcExperience(joiningDateStr, asOf = TODAY) {
  const join = new Date(joiningDateStr);
  let years = asOf.getFullYear() - join.getFullYear();
  let months = asOf.getMonth() - join.getMonth();
  if (asOf.getDate() < join.getDate()) months -= 1;
  if (months < 0) { years -= 1; months += 12; }
  if (years < 0) { years = 0; months = 0; }
  return `${years} Year${years !== 1 ? 's' : ''} ${months} Month${months !== 1 ? 's' : ''}`;
}

// Generates realistic Present/Absent attendance for every working day
// (Mon-Sat) from the staff member's joining date up to today. Days before
// joining and Sundays are simply never recorded.
export function generateAttendance(staffId, joiningDateStr) {
  const join = new Date(joiningDateStr);
  const attendance = {};
  const cursor = new Date(join.getFullYear(), join.getMonth(), 1);
  const seedBase = staffId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);

  while (cursor <= TODAY) {
    const y = cursor.getFullYear();
    const m = cursor.getMonth() + 1; // 1-12
    const daysInMonth = new Date(y, m, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(y, m - 1, d);
      if (date < new Date(join.getFullYear(), join.getMonth(), join.getDate())) continue;
      if (date > TODAY) continue;
      if (date.getDay() === 0) continue; // Sunday - not a working day
      const seed = (seedBase + y + m * 31 + d * 7) % 7;
      const status = seed === 0 ? 'Absent' : 'Present'; // ~86% present
      attendance[y] = attendance[y] || {};
      attendance[y][m] = attendance[y][m] || {};
      attendance[y][m][d] = status;
    }
    cursor.setMonth(cursor.getMonth() + 1);
  }
  return attendance;
}

// Builds the day-by-day breakdown + salary numbers for one staff member,
// for one Year+Month, respecting their joining date and today's date.
export function getMonthAttendanceStats(staffMember, year, month) {
  const join = new Date(staffMember.joiningDate);
  const daysInMonth = new Date(year, month, 0).getDate();
  const days = [];
  let workingDays = 0, present = 0, absent = 0;

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month - 1, d);
    const dayName = DAY_NAMES[date.getDay()];
    let status;
    if (date < new Date(join.getFullYear(), join.getMonth(), join.getDate())) {
      status = 'Not Joined';
    } else if (date.getDay() === 0) {
      status = 'Sunday';
    } else if (date > TODAY) {
      status = 'Upcoming';
    } else {
      status = (staffMember.attendance[year] && staffMember.attendance[year][month] && staffMember.attendance[year][month][d]) || 'Absent';
      workingDays += 1;
      if (status === 'Present') present += 1;
      else absent += 1;
    }
    days.push({ date: d, dayName, dow: date.getDay(), status });
  }

  const dailySalary = workingDays > 0 ? staffMember.monthlySalary / workingDays : 0;
  const payableSalary = dailySalary * present;

  return { days, workingDays, present, absent, dailySalary, payableSalary };
}

// Arranges a month's days (Sunday-indexed `dow`) into Monday-first calendar
// weeks, padding the first/last week with nulls so every row has 7 cells.
export function buildCalendarWeeks(days) {
  if (!days.length) return [];
  const leading = (days[0].dow + 6) % 7; // Sunday(0) -> 6, Monday(1) -> 0, ...
  const cells = [...Array(leading).fill(null), ...days];
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

// ---- Sample data --------------------------------------------------

function buildStaffRecord(type, id, name, i) {
  const isTeaching = type === 'teaching';
  const year = 2021 + (i % 5); // 2021..2025, always before TODAY
  const month = (i * 3 + 2) % 12; // 0-11
  const day = 3 + ((i * 7) % 24);
  const joiningDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const monthlySalary = isTeaching ? 28000 + (i % 6) * 2500 : 18000 + (i % 4) * 2000;

  return {
    id,
    name,
    type,
    mobile: `9${(800000000 + i * 913571) % 100000000}`.slice(0, 10),
    role: isTeaching ? SUBJECTS[i % SUBJECTS.length] + ' Teacher' : OTHER_ROLES[i % OTHER_ROLES.length],
    classes: isTeaching ? `${(i % 5) + 6}th, ${((i + 1) % 5) + 6}th` : '—',
    joiningDate,
    monthlySalary,
    academicYear: getAcademicYear(joiningDate),
    attendance: generateAttendance(id, joiningDate),
  };
}

// Fresh teaching-staff roster (independent copy each call so pages don't
// share mutable state unless they explicitly pass records to each other).
export function makeTeachingStaff() {
  return TEACHING_NAMES.map((name, i) => buildStaffRecord('teaching', `T${String(i + 1).padStart(3, '0')}`, name, i));
}

// Fresh non-teaching staff roster.
export function makeNonTeachingStaff() {
  return OTHER_NAMES.map((name, i) => buildStaffRecord('other', `S${String(i + 1).padStart(3, '0')}`, name, TEACHING_NAMES.length + i));
}

export function makeAllStaff() {
  return [...makeTeachingStaff(), ...makeNonTeachingStaff()];
}

export function makeLeaveApplications(staffList) {
  const reasons = ['Fever and cold', 'Family function', 'Medical checkup', 'Personal work', 'Child care', 'Travel'];
  const statuses = ['Approved', 'Pending', 'Rejected'];
  const isoOf = (y, m, d) => `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  return staffList.slice(0, 6).map((s, i) => {
    const fromDay = 3 + i * 3;
    const span = i % 3;
    return {
      id: `LV${String(i + 1).padStart(3, '0')}`,
      staffId: s.id,
      staffName: s.name,
      staffType: s.type,
      leaveType: LEAVE_TYPES[i % LEAVE_TYPES.length],
      fromDate: isoOf(CURRENT_YEAR, CURRENT_MONTH, fromDay),
      toDate: isoOf(CURRENT_YEAR, CURRENT_MONTH, fromDay + span),
      reason: reasons[i % reasons.length],
      status: statuses[i % statuses.length],
      appliedOn: isoOf(CURRENT_YEAR, CURRENT_MONTH, Math.max(1, fromDay - 3)),
    };
  });
}
