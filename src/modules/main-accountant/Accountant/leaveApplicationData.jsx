// Seed data for the Leave Applications module.

function formatDateLabel(iso) {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

const rawTeachingLeaves = [
  { staffId: "T002", name: "Rohit Kulkarni", reason: "Fever and viral infection", start: "2026-07-22", end: "2026-07-24", days: 3, status: "Approved" },
  { staffId: "T004", name: "Suresh Iyer", reason: "Family function", start: "2026-08-10", end: "2026-08-11", days: 2, status: "Pending" },
  { staffId: "T001", name: "Anjali Deshmukh", reason: "Personal work", start: "2026-07-05", end: "2026-07-06", days: 2, status: "Rejected" },
];

const rawNonTeachingLeaves = [
  { staffId: "CL002", name: "Meena Sharma", reason: "Fever", start: "2026-07-20", end: "2026-07-21", days: 2, status: "Approved" },
  { staffId: "P002", name: "Ramesh Yadav", reason: "Personal work", start: "2026-08-09", end: "2026-08-09", days: 1, status: "Pending" },
  { staffId: "SG002", name: "Vijay Sharma", reason: "Family function", start: "2026-07-15", end: "2026-07-16", days: 2, status: "Rejected" },
];

const withLabels = (rows) =>
  rows.map((r) => ({ ...r, startLabel: formatDateLabel(r.start), endLabel: formatDateLabel(r.end) }));

export const teachingLeaves = withLabels(rawTeachingLeaves);
export const nonTeachingLeaves = withLabels(rawNonTeachingLeaves);
