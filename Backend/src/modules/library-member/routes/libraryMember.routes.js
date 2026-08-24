const router = require("express").Router();
const { protect, authorize } = require("../../../middleware/auth");
const validate = require("../../../middleware/validate");
const schema = require("../validation/libraryMember.validation");
const controller = require("../controller/libraryMember.controller");

router.use(protect);

router.get("/", controller.list);
router.get("/:id", controller.getById);
router.post("/", authorize("library", "admin"), validate(schema.create), controller.create);
router.patch("/:id", authorize("library", "admin"), validate(schema.update), controller.updateById);
router.delete("/:id", authorize("library", "admin"), controller.deleteById);

module.exports = router;
