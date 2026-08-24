const { Router } = require("express");
const crudRouter = require("../utils/crudRouter");
const { StaffOnboarding } = require("../module/Teacher-accountant");

const router = Router();
router.use("/staff-onboarding", crudRouter(StaffOnboarding, { writeRoles: ["admin", "teaching-accountant"] }));

module.exports = router;
