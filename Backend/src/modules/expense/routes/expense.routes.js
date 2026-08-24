const router = require("express").Router();
const { protect, authorize } = require("../../../middleware/auth");
const validate = require("../../../middleware/validate");
const schema = require("../validation/expense.validation");
const controller = require("../controller/expense.controller");
const { ACCOUNTANT_ROLES } = require("../../../constants/roles");

router.use(protect);

router.get("/", controller.list);
router.post("/", authorize("admin", ...ACCOUNTANT_ROLES), validate(schema.create), controller.create);
router.delete("/:id", authorize("admin"), controller.deleteById);

module.exports = router;
