const router = require("express").Router();
const { protect, authorize } = require("../../../middleware/auth");
const validate = require("../../../middleware/validate");
const schema = require("../validation/leave.validation");
const controller = require("../controller/leave.controller");

const REVIEWERS = ["admin", "main-accountant", "non-teaching-accountant", "teaching-accountant", "library", "teacher"];

router.use(protect);

router.get("/", controller.list);
router.get("/:id", controller.getById);
router.post("/", validate(schema.create), controller.create);
router.patch("/:id/status", authorize(...REVIEWERS), validate(schema.updateStatus), controller.review);
router.delete("/:id", authorize("admin"), controller.deleteById);

module.exports = router;
