// Shared CRUD router factory used by every routes/*.js file.
// The frontend now sends a session cookie on every fetch() call
// (credentials: "include" — see modules/teacher/utils/api.js,
// modules/library/library/utils/api.js, src/lib/auth.ts's backend-backed
// login), so every route here requires a valid session via `protect`.
// Writes are additionally restricted to `writeRoles` via `authorize` when
// given; omit writeRoles to allow any authenticated user to write (matches
// routes like /leave, /marks, /schedule, /assignments where every real
// portal that writes there is a legitimate caller).
const { Router } = require("express");
const { crudController } = require("./crudFactory");
const { protect, authorize } = require("../middleware/auth");

function crudRouter(Model, { populate, writeRoles, filterableFields } = {}) {
  const c = crudController(Model, { populate, filterableFields });
  const r = Router();
  const guardWrite = writeRoles && writeRoles.length ? [protect, authorize(...writeRoles)] : [protect];

  r.get("/", protect, c.list);
  r.get("/:id", protect, c.getById);
  r.post("/", ...guardWrite, c.create);
  r.patch("/:id", ...guardWrite, c.updateById);
  r.delete("/:id", ...guardWrite, c.deleteById);

  return r;
}

module.exports = crudRouter;
