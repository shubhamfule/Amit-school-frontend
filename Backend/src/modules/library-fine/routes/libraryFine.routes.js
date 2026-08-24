const router = require("express").Router();
const { protect, authorize } = require("../../../middleware/auth");
const validate = require("../../../middleware/validate");
const schema = require("../validation/libraryFine.validation");
const controller = require("../controller/libraryFine.controller");

router.use(protect);

router.get("/", controller.list);
router.post("/:id/clear", authorize("library", "admin"), validate(schema.clear), controller.clear);

module.exports = router;
