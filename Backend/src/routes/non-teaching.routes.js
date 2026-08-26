const { Router } = require("express");
const crudRouter = require("../utils/crudRouter");
const { NonTeachingOnboarding } = require("../module/Non-teaching");

const router = Router();
// main-accountant's own NonTeachingRegistration.jsx (applicant intake) also writes here.
router.use("/non-teaching-onboarding", crudRouter(NonTeachingOnboarding, { writeRoles: ["admin", "non-teaching-accountant", "main-accountant"] }));

module.exports = router;
