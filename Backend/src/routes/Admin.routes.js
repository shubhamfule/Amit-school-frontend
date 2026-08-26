// Routes for every model Admin.js owns. Reused models (Student, Staff,
// LeaveApplication, Notice, Event) get their one canonical route set here —
// other portal files reuse the models but do not get a second route set.

const { Router } = require("express");
const crudRouter = require("../utils/crudRouter");
const { Student, Staff, LeaveApplication, Notice, Event, CalendarEvent, Settings } = require("../module/Admin");

const router = Router();

// Mounted as /students to match the teacher portal's real StudentPortal.jsx
// calls. main-accountant's and student-accountant's own StudentAdmission.jsx
// forms also POST here — both included below.
router.use("/students", crudRouter(Student, { writeRoles: ["admin", "teacher", "main-accountant", "student-accountant"] }));
router.use("/staff", crudRouter(Staff, { writeRoles: ["admin"] }));
// Mounted as /leave to match the teacher portal's real LeaveApplications.jsx calls.
router.use("/leave", crudRouter(LeaveApplication)); // no writeRoles — anyone authenticated can apply/review
// main-accountant's own Notices.jsx/Events.jsx also write here.
router.use("/notices", crudRouter(Notice, { writeRoles: ["admin", "library", "main-accountant"] }));
router.use("/events", crudRouter(Event, { writeRoles: ["admin", "library", "main-accountant"] }));
router.use("/calendar-events", crudRouter(CalendarEvent, { writeRoles: ["admin", "library"] }));
router.use("/settings", crudRouter(Settings, { writeRoles: ["admin"] }));

module.exports = router;
