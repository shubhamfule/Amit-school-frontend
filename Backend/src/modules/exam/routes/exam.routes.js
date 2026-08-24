const router = require("express").Router();
const { protect, authorize } = require("../../../middleware/auth");
const validate = require("../../../middleware/validate");
const schema = require("../validation/exam.validation");
const controller = require("../controller/exam.controller");

router.use(protect);

router.get("/", controller.list);
router.get("/:id", controller.getById);
router.post("/", authorize("admin", "teacher"), validate(schema.create), controller.create);
router.patch("/:id", authorize("admin", "teacher"), validate(schema.update), controller.updateById);
router.delete("/:id", authorize("admin", "teacher"), controller.deleteById);

module.exports = router;
