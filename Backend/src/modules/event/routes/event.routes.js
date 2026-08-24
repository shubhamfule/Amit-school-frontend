const router = require("express").Router();
const { protect, authorize } = require("../../../middleware/auth");
const validate = require("../../../middleware/validate");
const schema = require("../validation/event.validation");
const controller = require("../controller/event.controller");

router.use(protect);

router.get("/", controller.list);
router.get("/:id", controller.getById);
router.post("/", authorize("admin", "library"), validate(schema.create), controller.create);
router.patch("/:id", authorize("admin", "library"), validate(schema.update), controller.updateById);
router.delete("/:id", authorize("admin", "library"), controller.deleteById);

module.exports = router;
