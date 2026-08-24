const router = require("express").Router();
const { protect, authorize } = require("../../../middleware/auth");
const validate = require("../../../middleware/validate");
const schema = require("../validation/feePayment.validation");
const controller = require("../controller/feePayment.controller");
const { ACCOUNTANT_ROLES } = require("../../../constants/roles");

router.use(protect);

router.get("/", controller.list);
router.post("/", authorize("admin", ...ACCOUNTANT_ROLES), validate(schema.pay), controller.pay);

module.exports = router;
