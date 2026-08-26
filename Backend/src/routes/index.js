// Aggregates every portal's routes under /api. Each file mounts only the
// models that portal actually owns — reused models get exactly one route
// set, from whichever file owns them (see the "reused from X.js" comments
// in src/module/*.js).

const { Router } = require("express");

const router = Router();

router.use("/auth", require("./auth.routes"));
router.use("/", require("./Admin.routes"));
router.use("/", require("./Main-accountant.routes"));
router.use("/", require("./Teacher-accountant.routes"));
router.use("/", require("./student-accountant"));
router.use("/", require("./non-teaching.routes"));
router.use("/", require("./teacher.routes"));
router.use("/", require("./student.routes"));
router.use("/", require("./Library.routes"));

module.exports = router;
