const { Router } = require("express");
const crudRouter = require("../utils/crudRouter");
const { LibraryMember } = require("../module/Library");

const router = Router();
router.use("/library-members", crudRouter(LibraryMember, { writeRoles: ["admin", "library"] }));

module.exports = router;
