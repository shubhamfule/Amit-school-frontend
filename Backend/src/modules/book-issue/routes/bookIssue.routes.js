const router = require("express").Router();
const { protect, authorize } = require("../../../middleware/auth");
const validate = require("../../../middleware/validate");
const schema = require("../validation/bookIssue.validation");
const controller = require("../controller/bookIssue.controller");

router.use(protect);

router.get("/", controller.list);
router.post("/", authorize("library", "admin"), validate(schema.issue), controller.issue);
router.post(
  "/:id/return",
  authorize("library", "admin"),
  validate(schema.returnBook),
  controller.returnBook
);

module.exports = router;
