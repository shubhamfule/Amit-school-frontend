const router = require("express").Router();
const { protect, authorize } = require("../../../middleware/auth");
const validate = require("../../../middleware/validate");
const schema = require("../validation/studentFee.validation");
const controller = require("../controller/studentFee.controller");
const { ACCOUNTANT_ROLES } = require("../../../constants/roles");

router.use(protect);

router.get("/", controller.list);
router.get("/:id", controller.getById);
router.post("/", authorize("admin", ...ACCOUNTANT_ROLES), validate(schema.create), controller.create);
router.delete("/:id", authorize("admin"), controller.deleteById);

module.exports = router;
