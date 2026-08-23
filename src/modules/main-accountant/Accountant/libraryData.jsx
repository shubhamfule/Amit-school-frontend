// Seed data for the Library module — issues, returns, fines and clearance.

export const avatarPalette = [
  { bg: "#faeeda", fg: "#a9660a" }, // amber
  { bg: "#e6f1fb", fg: "#2a78d6" }, // blue
  { bg: "#fce8f1", fg: "#c94f83" }, // pink
  { bg: "#faeeda", fg: "#ba7517" }, // gold
  { bg: "#e1f5ee", fg: "#0f6e56" }, // teal
  { bg: "#eaf3de", fg: "#3b6d11" }, // green
];

function initials(name) {
  return name
    .replace(/['â€™]/g, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

function withAvatar(rows) {
  return rows.map((r, i) => ({ ...r, initials: initials(r.name), avatar: avatarPalette[i % avatarPalette.length] }));
}

export const clearanceRecords = withAvatar([
  { id: "CLR-001", name: "Amit Sharma", userType: "Student", bookId: "BK-3001", bookName: "Science Book", overdueFine: 20, damageFine: 30, status: "Cleared" },
  { id: "CLR-002", name: "Neha Ma'am", userType: "Teacher", bookId: "BK-3002", bookName: "English Grammar", overdueFine: 50, damageFine: 50, status: "Pending" },
  { id: "CLR-003", name: "Rahul Patil", userType: "Student", bookId: "BK-3003", bookName: "Mathematics", overdueFine: 25, damageFine: 0, status: "Cleared" },
  { id: "CLR-004", name: "Raj Sir", userType: "Teacher", bookId: "BK-3004", bookName: "Physics Guide", overdueFine: 40, damageFine: 10, status: "Pending" },
  { id: "CLR-005", name: "Sneha Gupta", userType: "Student", bookId: "BK-3005", bookName: "Geography Atlas", overdueFine: 0, damageFine: 20, status: "Cleared" },
]);

export const bookIssues = withAvatar([
  { id: "ISS-001", name: "Amit Sharma", userType: "Student", bookId: "BK-3001", bookName: "Science Book", issueDate: "2026-07-05", dueDate: "2026-07-19", status: "Issued" },
  { id: "ISS-002", name: "Neha Ma'am", userType: "Teacher", bookId: "BK-3002", bookName: "English Grammar", issueDate: "2026-07-08", dueDate: "2026-07-22", status: "Issued" },
  { id: "ISS-003", name: "Rahul Patil", userType: "Student", bookId: "BK-3003", bookName: "Mathematics", issueDate: "2026-06-28", dueDate: "2026-07-12", status: "Returned" },
  { id: "ISS-004", name: "Raj Sir", userType: "Teacher", bookId: "BK-3004", bookName: "Physics Guide", issueDate: "2026-07-01", dueDate: "2026-07-15", status: "Overdue" },
  { id: "ISS-005", name: "Sneha Gupta", userType: "Student", bookId: "BK-3005", bookName: "Geography Atlas", issueDate: "2026-07-10", dueDate: "2026-07-24", status: "Issued" },
]);

export const bookReturns = withAvatar([
  { id: "RTN-001", name: "Rahul Patil", userType: "Student", bookId: "BK-3003", bookName: "Mathematics", returnDate: "2026-07-11", condition: "Good", fine: 0 },
  { id: "RTN-002", name: "Amit Sharma", userType: "Student", bookId: "BK-2991", bookName: "History Notes", returnDate: "2026-07-14", condition: "Damaged", fine: 30 },
  { id: "RTN-003", name: "Neha Ma'am", userType: "Teacher", bookId: "BK-2988", bookName: "Grammar Workbook", returnDate: "2026-07-16", condition: "Good", fine: 0 },
  { id: "RTN-004", name: "Sneha Gupta", userType: "Student", bookId: "BK-2975", bookName: "Atlas Vol. 2", returnDate: "2026-07-18", condition: "Late", fine: 15 },
]);

export const fineCollections = withAvatar([
  { id: "FIN-001", name: "Amit Sharma", userType: "Student", bookId: "BK-3001", type: "Overdue", amount: 20, status: "Paid" },
  { id: "FIN-002", name: "Neha Ma'am", userType: "Teacher", bookId: "BK-3002", type: "Damage", amount: 50, status: "Unpaid" },
  { id: "FIN-003", name: "Rahul Patil", userType: "Student", bookId: "BK-3003", type: "Overdue", amount: 25, status: "Paid" },
  { id: "FIN-004", name: "Raj Sir", userType: "Teacher", bookId: "BK-3004", type: "Damage", amount: 10, status: "Unpaid" },
  { id: "FIN-005", name: "Sneha Gupta", userType: "Student", bookId: "BK-3005", type: "Damage", amount: 20, status: "Paid" },
]);
