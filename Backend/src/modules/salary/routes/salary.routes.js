const router = require("express").Router();
const { protect, authorize } = require("../../../middleware/auth");
const validate = require("../../../middleware/validate");
const schema = require("../validation/salary.validation");
const controller = require("../controller/salary.controller");
const { ACCOUNTANT_ROLES } = require("../../../constants/roles");

router.use(protect);

router.get("/", controller.list);
router.post(
  "/generate",
  authorize("admin", ...ACCOUNTANT_ROLES),
  validate(schema.generate),
  controller.generate
);
router.post(
  "/:id/pay",
  authorize("admin", ...ACCOUNTANT_ROLES),
  validate(schema.pay),
  controller.pay
);

module.exports = router;
