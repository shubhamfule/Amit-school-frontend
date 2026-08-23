// Teaching staff salary and directory data used across the Teaching module.

export const staffRoles = {
  teacher: {
    title: "Teaching Staff Salary Management",
    subtitle: "Amit Group of Schools | Teaching staff payroll",
    nameCol: "Teacher Name",
    metaCol: "Subject / Class",
    paidLabel: "Paid Teachers",
    rows: [
      { id: "T001", name: "Anjali Deshmukh", meta: "Mathematics · 9th", salary: 32000, paid: 32000 },
      { id: "T002", name: "Rohit Kulkarni", meta: "Science · 8th", salary: 30000, paid: 18000 },
      { id: "T003", name: "Priya Nair", meta: "English · 10th", salary: 34000, paid: 34000 },
      { id: "T004", name: "Suresh Iyer", meta: "History · 7th", salary: 28000, paid: 14000 },
      { id: "T005", name: "Meghana Rao", meta: "Computer Science · 9th", salary: 33000, paid: 33000 },
      { id: "T006", name: "Vikram Joshi", meta: "Physical Education · 6th", salary: 27000, paid: 27000 },
      { id: "T007", name: "Sneha Patil", meta: "Marathi · 8th", salary: 29000, paid: 15000 },
      { id: "T008", name: "Arjun Menon", meta: "Geography · 9th", salary: 30500, paid: 30500 },
      { id: "T009", name: "Kavita Bhosale", meta: "Art & Craft · 5th", salary: 26000, paid: 13000 },
      { id: "T010", name: "Rahul Deshpande", meta: "Physics · 10th", salary: 35000, paid: 35000 },
      { id: "T011", name: "Neha Kulkarni", meta: "Hindi · 7th", salary: 28500, paid: 28500 },
      { id: "T012", name: "Sandeep Wagh", meta: "Sanskrit · 6th", salary: 27500, paid: 0 },
    ],
  },
};

const teacherDetails = {
  T001: { designation: "Teacher", mobile: "9876543210", joiningDate: "2019-06-12", subject: "Mathematics", classGrade: "9th" },
  T002: { designation: "Teacher", mobile: "9823456712", joiningDate: "2020-07-18", subject: "Science", classGrade: "8th" },
  T003: { designation: "Teacher", mobile: "9765432180", joiningDate: "2018-04-22", subject: "English", classGrade: "10th" },
  T004: { designation: "Teacher", mobile: "9898981234", joiningDate: "2021-06-03", subject: "History", classGrade: "7th" },
  T005: { designation: "Teacher", mobile: "9812345678", joiningDate: "2022-08-10", subject: "Computer Science", classGrade: "9th" },
  T006: { designation: "Teacher", mobile: "9845123467", joiningDate: "2021-01-15", subject: "Physical Education", classGrade: "6th" },
  T007: { designation: "Senior Teacher", mobile: "9867234510", joiningDate: "2017-05-20", subject: "Marathi", classGrade: "8th" },
  T008: { designation: "Teacher", mobile: "9834561278", joiningDate: "2020-11-09", subject: "Geography", classGrade: "9th" },
  T009: { designation: "Teacher", mobile: "9856781234", joiningDate: "2022-03-01", subject: "Art & Craft", classGrade: "5th" },
  T010: { designation: "Senior Teacher", mobile: "9812349876", joiningDate: "2016-06-15", subject: "Physics", classGrade: "10th" },
  T011: { designation: "Teacher", mobile: "9823419876", joiningDate: "2019-09-12", subject: "Hindi", classGrade: "7th" },
  T012: { designation: "Teacher", mobile: "9871239876", joiningDate: "2023-06-05", subject: "Sanskrit", classGrade: "6th" },
};

export function academicYearFor(isoDate) {
  const [y, m] = isoDate.split("-").map(Number);
  const startYear = m >= 6 ? y : y - 1;
  return `${startYear}-${String((startYear + 1) % 100).padStart(2, "0")}`;
}

export function experienceFor(isoDate) {
  const join = new Date(`${isoDate}T00:00:00`);
  const now = new Date();
  let years = now.getFullYear() - join.getFullYear();
  let months = now.getMonth() - join.getMonth();
  if (now.getDate() < join.getDate()) months -= 1;
  if (months < 0) { years -= 1; months += 12; }
  if (years < 0) { years = 0; months = 0; }
  return `${years} Year${years === 1 ? "" : "s"} ${months} Month${months === 1 ? "" : "s"}`;
}

export function formatDDMMYYYY(isoDate) {
  const [y, m, d] = isoDate.split("-");
  return `${d}/${m}/${y}`;
}

export const teacherRows = staffRoles.teacher.rows.map((r) => {
  const d = teacherDetails[r.id] || {};
  const joiningDate = d.joiningDate || "2020-06-01";
  return {
    id: r.id,
    key: `teacher-${r.id}`,
    name: r.name,
    designation: d.designation || "Teacher",
    meta: r.meta,
    subject: d.subject,
    classGrade: d.classGrade,
    salary: r.salary,
    paid: r.paid,
    mobile: d.mobile || "",
    joiningDate,
    academicYear: academicYearFor(joiningDate),
  };
});

export const initialExpenses = [
  { date: "2026-06-18", expense: "Teacher Training Workshop", category: "Office", amount: 12000, mode: "Bank", paymentProof: null },
  { date: "2026-06-22", expense: "Staffroom Supplies", category: "Office", amount: 4000, mode: "Cash", paymentProof: null },
  { date: "2026-06-25", expense: "Teacher Conveyance Reimbursement", category: "Transport", amount: 3000, mode: "Cash", paymentProof: null },
];
