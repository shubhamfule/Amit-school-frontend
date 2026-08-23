// Sample data for the Library module — book issues, returns,
// fine collection and clearance records for teaching staff.

export const bookIssueRecords = [
  {
    id: "ISS-002",
    name: "Neha Ma'am",
    userType: "Teacher",
    bookId: "BK-3002",
    bookName: "English Grammar",
    issueDate: "2026-07-08",
    dueDate: "2026-07-22",
    status: "Issued",
  },
  {
    id: "ISS-004",
    name: "Raj Sir",
    userType: "Teacher",
    bookId: "BK-3004",
    bookName: "Physics Guide",
    issueDate: "2026-07-01",
    dueDate: "2026-07-15",
    status: "Overdue",
  },
];

export const bookReturnRecords = [
  {
    id: "RET-001",
    name: "Anita Ma'am",
    userType: "Teacher",
    bookId: "BK-3001",
    bookName: "History Atlas",
    issueDate: "2026-06-20",
    returnDate: "2026-07-03",
    status: "Returned",
  },
  {
    id: "RET-002",
    name: "Karan Sir",
    userType: "Teacher",
    bookId: "BK-3003",
    bookName: "Mathematics Vol 2",
    issueDate: "2026-06-18",
    returnDate: "2026-07-04",
    status: "Returned",
  },
];

export const fineCollectionRecords = [
  {
    id: "FIN-001",
    name: "Raj Sir",
    userType: "Teacher",
    bookId: "BK-3004",
    bookName: "Physics Guide",
    fineAmount: 50,
    status: "Pending",
  },
  {
    id: "FIN-002",
    name: "Karan Sir",
    userType: "Teacher",
    bookId: "BK-3003",
    bookName: "Mathematics Vol 2",
    fineAmount: 20,
    status: "Paid",
  },
];

export const libraryClearanceRecords = [
  {
    id: "CLR-001",
    name: "Anita Ma'am",
    userType: "Teacher",
    booksIssued: 0,
    pendingFine: 0,
    status: "Cleared",
  },
  {
    id: "CLR-002",
    name: "Raj Sir",
    userType: "Teacher",
    booksIssued: 1,
    pendingFine: 50,
    status: "Pending",
  },
];
