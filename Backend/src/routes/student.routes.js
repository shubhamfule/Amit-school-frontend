// Routes for every model student.js owns. Reused models (Student,
// LeaveApplication, Notice, Event, StudentFeeRecord, Transaction, BookIssue)
// already have their one canonical route set in Admin.routes.js /
// Main-accountant.routes.js.

const { Router } = require("express");
const crudRouter = require("../utils/crudRouter");
const { Certificate, ParentInfo, Exam, Result } = require("../module/student");

const STUDENT_ROLES = ["admin", "student"];
const router = Router();

router.use("/certificates", crudRouter(Certificate, { writeRoles: STUDENT_ROLES }));
router.use("/parent-info", crudRouter(ParentInfo, { writeRoles: STUDENT_ROLES }));
router.use("/exams", crudRouter(Exam, { writeRoles: ["admin"] }));
router.use("/results", crudRouter(Result, { writeRoles: ["admin", "teacher"] }));

module.exports = router;
