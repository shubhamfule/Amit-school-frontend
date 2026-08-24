// Shared CRUD router factory used by every routes/*.js file.
// The real frontend (src/modules/*) never sends a session cookie or
// Authorization header on its fetch() calls (see modules/teacher/utils/api.js
// and src/lib/auth.ts, which is a localStorage-only demo login) — so these
// routes are intentionally open, matching the reference "a backend"
// convention of plain, unauthenticated CRUD. The `protect`/`authorize`
// middleware still exists and is wired up on /api/auth for whenever a real
// login flow is connected, but data routes below don't require it.
const { Router } = require("express");
const { crudController } = require("./crudFactory");

function crudRouter(Model, { populate } = {}) {
  const c = crudController(Model, { populate });
  const r = Router();

  r.get("/", c.list);
  r.get("/:id", c.getById);
  r.post("/", c.create);
  r.patch("/:id", c.updateById);
  r.delete("/:id", c.deleteById);

  return r;
}

module.exports = crudRouter;
