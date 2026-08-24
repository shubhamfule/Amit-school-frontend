const router = require("express").Router();
const validate = require("../../../middleware/validate");
const { protect } = require("../../../middleware/auth");
const schema = require("../validation/auth.validation");
const controller = require("../controller/auth.controller");

router.post("/register", validate(schema.register), controller.register);
router.post("/login", validate(schema.login), controller.login);
router.post("/logout", controller.logout);
router.get("/me", protect, controller.me);

module.exports = router;
