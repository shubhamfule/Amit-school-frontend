// Routes for every model Main-accountant.js owns.

const { Router } = require("express");
const crudRouter = require("../utils/crudRouter");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const { protect, authorize } = require("../middleware/auth");
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
// AttendanceManagement.jsx's "Save Attendance" writes marks for every
// visible staff member on one date at once — /bulk upserts them in one
// round trip, matching teacher.routes.js's /attendance/bulk pattern.
// filterableFields lets the day view fetch ?staffType=&date= directly.
const staffAttendanceRouter = crudRouter(StaffAttendanceMark, {
  writeRoles: ACCOUNTANT_ROLES,
  filterableFields: ["staffType", "date"],
});
staffAttendanceRouter.post(
  "/bulk",
  protect,
  authorize(...ACCOUNTANT_ROLES),
  catchAsync(async (req, res) => {
    const { staffType, date, records } = req.body;
    if (!staffType || !date || !Array.isArray(records)) {
      throw new ApiError(400, "staffType, date and records[] are required");
    }
    const day = new Date(`${date}T00:00:00.000Z`);
    const ops = records.map((r) => ({
      updateOne: {
        filter: { staffType, personKey: r.personKey, date: day },
        update: { $set: { status: r.status } },
        upsert: true,
      },
    }));
    if (ops.length) await StaffAttendanceMark.bulkWrite(ops);
    const saved = await StaffAttendanceMark.find({
      staffType,
      date: day,
      personKey: { $in: records.map((r) => r.personKey) },
    });
    res.status(201).json({ success: true, data: saved });
  })
);
router.use("/staff-attendance", staffAttendanceRouter);
// Mounted as /library to match the teacher portal's real Library.jsx calls.
router.use("/library", crudRouter(Book, { writeRoles: [...LIBRARY_ROLES, "teacher"] }));
router.use("/book-issues", crudRouter(BookIssue, { writeRoles: LIBRARY_ROLES }));
router.use("/book-returns", crudRouter(BookReturn, { writeRoles: LIBRARY_ROLES }));
router.use("/library-fines", crudRouter(LibraryFine, { writeRoles: LIBRARY_ROLES }));
router.use("/library-clearances", crudRouter(LibraryClearance, { writeRoles: LIBRARY_ROLES }));

module.exports = router;
