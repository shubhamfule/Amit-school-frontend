// Shared CRUD router factory used by every routes/*.js file.
// GET routes only require a valid session (protect); POST/PATCH/DELETE
// additionally require one of `writeRoles` when given. Keeps the per-portal
// routes files to one line per model instead of repeating this wiring.

const { Router } = require("express");
const { protect, authorize } = require("../middleware/auth");
const { crudController } = require("./crudFactory");

function crudRouter(Model, { writeRoles, populate } = {}) {
  const c = crudController(Model, { populate });
  const r = Router();
  const writeGuard = writeRoles ? [authorize(...writeRoles)] : [];

  r.use(protect);
  r.get("/", c.list);
  r.get("/:id", c.getById);
  r.post("/", ...writeGuard, c.create);
  r.patch("/:id", ...writeGuard, c.updateById);
  r.delete("/:id", ...writeGuard, c.deleteById);

  return r;
}

module.exports = crudRouter;
