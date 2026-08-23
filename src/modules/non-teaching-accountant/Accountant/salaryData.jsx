// Seed data reproduced from the original static HTML tables.
// Non-Teaching Accountant build — only non-teaching staff salary and expense data is kept.

export const staffRoles = {
  cleaner: {
    title: "Cleaner Salary Management",
    subtitle: "Amit Group of Schools | Non-teaching staff payroll",
    nameCol: "Cleaner Name",
    metaCol: "Area",
    paidLabel: "Paid Cleaners",
    rows: [
      { id: "CL001", name: "Sunita Devi", meta: "Main Building", salary: 15000, paid: 15000 },
      { id: "CL002", name: "Meena Sharma", meta: "Classrooms", salary: 16000, paid: 10000 },
      { id: "CL003", name: "Rani Patil", meta: "Library", salary: 14500, paid: 14500 },
      { id: "CL004", name: "Kavita Verma", meta: "Laboratory", salary: 15500, paid: 8000 },
    ],
  },
  clerk: {
    title: "Clerk Salary Management",
    subtitle: "Amit Group of Schools | Non-teaching staff payroll",
    nameCol: "Name",
    metaCol: "Department",
    paidLabel: "Paid Payment",
    rows: [
      { id: "C001", name: "Anil Sharama", meta: "Accounts", salary: 25000, paid: 25000 },
      { id: "C002", name: "Vijay Singh", meta: "Administration", salary: 22000, paid: 15000 },
      { id: "C003", name: "Rakesh Varma", meta: "Office", salary: 24000, paid: 24000 },
      { id: "C004", name: "Amrita Sharma", meta: "Administration", salary: 22000, paid: 15000 },
      { id: "C005", name: "Sanjay Patel", meta: "Accounts", salary: 23000, paid: 23000 },
      { id: "C006", name: "Raman Doge", meta: "Office", salary: 20000, paid: 14000 },
      { id: "C007", name: "Vijay Singh", meta: "Administration", salary: 22000, paid: 15000 },
    ],
  },
  driver: {
    title: "Drivers Salary Management",
    subtitle: "Amit Group of Schools | Non-teaching staff payroll",
    nameCol: "Driver Name",
    metaCol: "Vehicle",
    paidLabel: "Paid Payment",
    rows: [
      { id: "C001", name: "Anil Sharama", meta: "Bus No.2", salary: 18000, paid: 18000 },
      { id: "C002", name: "Vijay Singh", meta: "Bus No.1", salary: 18000, paid: 15000 },
    ],
  },
  peon: {
    title: "Peons Salary Management",
    subtitle: "Amit Group of Schools | Non-teaching staff payroll",
    nameCol: "Name",
    metaCol: "Department",
    paidLabel: "Paid Peons",
    rows: [
      { id: "P001", name: "Ganesh Rao", meta: "Office", salary: 16000, paid: 16000 },
      { id: "P002", name: "Ramesh Yadav", meta: "Administration", salary: 16000, paid: 10000 },
      { id: "P003", name: "Lata Patil", meta: "Library", salary: 14500, paid: 14500 },
      { id: "P004", name: "Mahesh Verma", meta: "Examination Hall", salary: 15500, paid: 8000 },
    ],
  },
  security: {
    title: "Security Guard Salary Management",
    subtitle: "Amit Group of Schools | Non-teaching staff payroll",
    nameCol: "Name",
    metaCol: "Department",
    paidLabel: "Paid Security Guards",
    rows: [
      { id: "SG001", name: "Mahesh Yadav", meta: "Day Shift", salary: 15000, paid: 15000 },
      { id: "SG002", name: "Vijay Sharma", meta: "Night Shift", salary: 15000, paid: 10000 },
      { id: "SG003", name: "Rani Patil", meta: "Day Shift", salary: 15000, paid: 15000 },
      { id: "SG004", name: "Karan Verma", meta: "Night Shift", salary: 15000, paid: 8000 },
    ],
  },
  librarian: {
    title: "Librarian Salary Management",
    subtitle: "Amit Group of Schools | Non-teaching staff payroll",
    nameCol: "Librarian Name",
    metaCol: "Library",
    paidLabel: "Paid Librarians",
    rows: [
      { id: "LB001", name: "Sneha Kulkarni", meta: "Main Library", salary: 20000, paid: 20000 },
      { id: "LB002", name: "Arvind Joshi", meta: "Junior Section Library", salary: 18000, paid: 12000 },
    ],
  },
};

// Human-readable designation label for each individual non-teaching role.
// The underlying role data above stays intact (per-role rows are still stored),
// but the UI only ever surfaces the unified "Non-Teaching" category — this label
// is shown as a plain data column, not as a separate tab/filter/page.
const nonTeachingDesignationLabels = {
  cleaner: "Cleaner",
  clerk: "Clerk",
  driver: "Driver",
  peon: "Peon",
  security: "Security Guard",
  librarian: "Librarian",
};

// Deterministic pseudo-random helpers so every non-teaching employee gets a
// stable (but not manually authored) mobile number / joining date, without
// having to hand-edit every row above.
function hashString(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

const JOIN_DATES = [
  "2017-06-12", "2018-11-03", "2019-04-22", "2019-09-15", "2020-01-18",
  "2020-08-02", "2021-03-03", "2021-07-19", "2022-02-10", "2022-10-05",
  "2023-06-01", "2024-01-14",
];

function mobileFor(key) {
  const h = hashString(key);
  const prefix = ["9", "8", "7", "6"][h % 4];
  const rest = String(1000000000 + (h % 900000000)).slice(0, 9);
  return prefix + rest;
}

function joiningDateFor(key) {
  const h = hashString(key + "-join");
  return JOIN_DATES[h % JOIN_DATES.length];
}

// Academic year a joining date falls into (school year runs June -> May).
export function academicYearFor(isoDate) {
  const [y, m] = isoDate.split("-").map(Number);
  const startYear = m >= 6 ? y : y - 1;
  return `${startYear}-${String((startYear + 1) % 100).padStart(2, "0")}`;
}

// Experience as of today, formatted like "5 Years 5 Months".
export function experienceFor(isoDate) {
  const join = new Date(`${isoDate}T00:00:00`);
  const now = new Date();
  let years = now.getFullYear() - join.getFullYear();
  let months = now.getMonth() - join.getMonth();
  if (now.getDate() < join.getDate()) months -= 1;
  if (months < 0) { years -= 1; months += 12; }
  if (years < 0) { years = 0; months = 0; }
  const yLabel = `${years} Year${years === 1 ? "" : "s"}`;
  const mLabel = `${months} Month${months === 1 ? "" : "s"}`;
  return `${yLabel} ${mLabel}`;
}

export function formatDDMMYYYY(isoDate) {
  const [y, m, d] = isoDate.split("-");
  return `${d}/${m}/${y}`;
}

// ── Unified Non-Teaching staff list ──
// Merges every individual non-teaching role (Driver, Clerk, Cleaner, Peon, Security Guard, etc.)
// from staffRoles into a single flat list so the Non-Teaching module can show them all
// under one "Non-Teaching" category instead of separate role tabs/pages.
// Each employee also gets a stable mobile number / joining date (derived from
// their unique key) so the staff-directory profile card has real-looking,
// already-entered details to display.
export const nonTeachingRows = Object.entries(staffRoles).flatMap(([roleKey, role]) =>
  role.rows.map((r) => {
    const key = `${roleKey}-${r.id}`;
    const joiningDate = joiningDateFor(key);
    return {
      id: r.id,
      key,
      name: r.name,
      designation: nonTeachingDesignationLabels[roleKey] || roleKey,
      meta: r.meta,
      salary: r.salary,
      paid: r.paid,
      mobile: mobileFor(key),
      joiningDate,
      academicYear: academicYearFor(joiningDate),
    };
  })
);

// paymentStatus is intentionally not stored — it is always derived from whether
// paymentProof has been uploaded (see SchoolExpenses.jsx): Paid only once a
// receipt/proof file exists, otherwise Pending.
export const initialExpenses = [
  { date: "2026-06-21", expense: "Electricity Bill", category: "Utility", amount: 25000, mode: "Bank", paymentProof: null },
  { date: "2026-06-20", expense: "Cleaning Supplies", category: "Maintenance", amount: 6000, mode: "Cash", paymentProof: null },
  { date: "2026-06-24", expense: "Vehicle Fuel & Maintenance", category: "Transport", amount: 5000, mode: "Cash", paymentProof: null },
];
