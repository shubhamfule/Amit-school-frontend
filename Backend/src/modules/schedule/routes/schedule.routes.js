const router = require("express").Router();
const { protect, authorize } = require("../../../middleware/auth");
const validate = require("../../../middleware/validate");
const schema = require("../validation/schedule.validation");
const controller = require("../controller/schedule.controller");

router.use(protect);

router.get("/", controller.list);
router.get("/:id", controller.getById);
router.post("/", authorize("teacher", "admin"), validate(schema.create), controller.create);
router.post("/bulk", authorize("teacher", "admin"), validate(schema.bulkCreate), controller.bulkCreate);
router.patch("/:id", authorize("teacher", "admin"), validate(schema.update), controller.updateById);
router.delete("/:id", authorize("teacher", "admin"), controller.deleteById);

module.exports = router;
