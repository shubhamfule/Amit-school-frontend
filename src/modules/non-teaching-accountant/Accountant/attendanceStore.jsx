// Shared attendance storage for the Non-Teaching Attendance module.
// Records are keyed by [date][employeeKey] = status, where employeeKey is the
// unique `key` field from salaryData (roleKey-id) — using the unique key
// instead of the plain `id` avoids collisions between roles that reuse the
// same ID sequence (e.g. Clerk C001 and Driver C001).
// This is read by both the Attendance page (mark/unmark) and the Staff
// Directory "View attendance & salary" modal (read-only monthly summary),
// so the two stay in sync automatically.

export const ATTENDANCE_STORAGE_KEY = "accountant_nonTeachingAttendance_v2";
export const STATUSES = ["Present", "Absent", "Leave"];

export function loadAllAttendance() {
  try {
    const saved = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

export function saveAllAttendance(all) {
  try {
    localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(all));
  } catch {
    // storage unavailable — attendance simply won't persist across refresh
  }
}

export function todayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function formatDateLabel(key) {
  const [y, m, d] = key.split("-").map(Number);
  if (!y || !m || !d) return key;
  return new Date(y, m - 1, d).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

export function shiftDateKey(key, deltaDays) {
  const [y, m, d] = key.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + deltaDays);
  const ny = dt.getFullYear();
  const nm = String(dt.getMonth() + 1).padStart(2, "0");
  const nd = String(dt.getDate()).padStart(2, "0");
  return `${ny}-${nm}-${nd}`;
}

// Returns { workingDays, present, absent, leave, attendancePct } for one
// employee within a given year/month (1-12), counting every recorded day
// (Present/Absent/Leave) as a working day.
export function monthSummaryFor(allAttendance, employeeKey, year, month) {
  const prefix = `${year}-${String(month).padStart(2, "0")}-`;
  let present = 0, absent = 0, leave = 0, workingDays = 0;
  const days = [];
  Object.entries(allAttendance).forEach(([dateKey, rec]) => {
    if (!dateKey.startsWith(prefix)) return;
    const status = rec && rec[employeeKey];
    if (!status) return;
    workingDays += 1;
    if (status === "Present") present += 1;
    else if (status === "Absent") absent += 1;
    else if (status === "Leave") leave += 1;
    days.push({ date: dateKey, status });
  });
  days.sort((a, b) => (a.date < b.date ? -1 : 1));
  const attendancePct = workingDays > 0 ? ((present / workingDays) * 100).toFixed(2) : "0.00";
  return { workingDays, present, absent, leave, attendancePct, days };
}
