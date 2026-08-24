const router = require("express").Router();
const { protect } = require("../../../middleware/auth");
const controller = require("../controller/transaction.controller");

router.use(protect);
router.get("/", controller.list);

module.exports = router;
