const router = require("express").Router();
const { protect, authorize } = require("../../../middleware/auth");
const validate = require("../../../middleware/validate");
const schema = require("../validation/attendance.validation");
const controller = require("../controller/attendance.controller");

router.use(protect);

router.get("/", validate(schema.query, "query"), controller.list);
router.get("/stats/:personId", controller.stats);
router.post(
  "/bulk",
  authorize("teacher", "admin"),
  validate(schema.bulkMark),
  controller.bulkMark
);

module.exports = router;
