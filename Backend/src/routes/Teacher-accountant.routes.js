const { Router } = require("express");
const crudRouter = require("../utils/crudRouter");
const { StaffOnboarding } = require("../module/Teacher-accountant");

const router = Router();
// main-accountant's own TeacherRegistration.jsx (applicant intake) also writes here.
router.use("/staff-onboarding", crudRouter(StaffOnboarding, { writeRoles: ["admin", "teaching-accountant", "main-accountant"] }));

module.exports = router;
