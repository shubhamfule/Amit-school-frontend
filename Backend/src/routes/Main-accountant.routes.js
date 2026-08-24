// Routes for every model Main-accountant.js owns.

const { Router } = require("express");
const crudRouter = require("../utils/crudRouter");
const {
  Transaction,
  TeacherSalaryPayment,
  NonTeachingSalaryPayment,
  StudentFeeRecord,
  Expense,
  StaffAttendanceMark,
  Book,
  BookIssue,
  BookReturn,
  LibraryFine,
  LibraryClearance,
} = require("../module/Main-accountant");

const ACCOUNTANT_ROLES = ["admin", "main-accountant", "non-teaching-accountant", "student-accountant", "teaching-accountant"];
const LIBRARY_ROLES = ["admin", "library"];

const router = Router();

router.use("/transactions", crudRouter(Transaction, { writeRoles: ACCOUNTANT_ROLES }));
router.use("/teacher-salary", crudRouter(TeacherSalaryPayment, { writeRoles: ACCOUNTANT_ROLES }));
router.use("/non-teaching-salary", crudRouter(NonTeachingSalaryPayment, { writeRoles: ACCOUNTANT_ROLES }));
router.use("/student-fees", crudRouter(StudentFeeRecord, { writeRoles: ACCOUNTANT_ROLES }));
router.use("/expenses", crudRouter(Expense, { writeRoles: ACCOUNTANT_ROLES }));
router.use("/staff-attendance", crudRouter(StaffAttendanceMark, { writeRoles: ACCOUNTANT_ROLES }));
// Mounted as /library to match the teacher portal's real Library.jsx calls.
router.use("/library", crudRouter(Book, { writeRoles: [...LIBRARY_ROLES, "teacher"] }));
router.use("/book-issues", crudRouter(BookIssue, { writeRoles: LIBRARY_ROLES }));
router.use("/book-returns", crudRouter(BookReturn, { writeRoles: LIBRARY_ROLES }));
router.use("/library-fines", crudRouter(LibraryFine, { writeRoles: LIBRARY_ROLES }));
router.use("/library-clearances", crudRouter(LibraryClearance, { writeRoles: LIBRARY_ROLES }));

module.exports = router;
