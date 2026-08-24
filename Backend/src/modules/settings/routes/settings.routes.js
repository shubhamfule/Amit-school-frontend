const router = require("express").Router();
const { protect } = require("../../../middleware/auth");
const validate = require("../../../middleware/validate");
const schema = require("../validation/settings.validation");
const controller = require("../controller/settings.controller");

router.use(protect);

router.get("/", controller.getMine);
router.patch("/", validate(schema.update), controller.updateMine);

module.exports = router;
