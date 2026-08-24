const router = require("express").Router();
const { protect, authorize } = require("../../../middleware/auth");
const validate = require("../../../middleware/validate");
const schema = require("../validation/notice.validation");
const controller = require("../controller/notice.controller");

router.use(protect);

router.get("/", controller.list);
router.get("/:id", controller.getById);
router.post("/:id/read", controller.markRead);
router.post("/", authorize("admin"), validate(schema.create), controller.create);
router.patch("/:id", authorize("admin"), validate(schema.update), controller.updateById);
router.delete("/:id", authorize("admin"), controller.deleteById);

module.exports = router;
