const router = require("express").Router();
const { protect, authorize } = require("../../../middleware/auth");
const validate = require("../../../middleware/validate");
const schema = require("../validation/student.validation");
const controller = require("../controller/student.controller");

const ADMIN_WRITE = ["admin", "student-accountant"];

router.use(protect);

router.get("/", controller.list);
router.get("/:id", controller.getById);
router.post("/", authorize(...ADMIN_WRITE), validate(schema.create), controller.create);
router.patch("/:id", authorize(...ADMIN_WRITE), validate(schema.update), controller.updateById);
router.delete("/:id", authorize("admin"), controller.deleteById);

module.exports = router;
