const { Router } = require("express");
const crudRouter = require("../utils/crudRouter");
const { NonTeachingOnboarding } = require("../module/Non-teaching");

const router = Router();
router.use("/non-teaching-onboarding", crudRouter(NonTeachingOnboarding, { writeRoles: ["admin", "non-teaching-accountant"] }));

module.exports = router;
