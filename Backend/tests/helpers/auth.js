const request = require("supertest");
const { User } = require("../../src/module/Admin");

// Creates a fresh admin-role session for a test. Call from beforeEach (not
// beforeAll) — clearDatabase wipes the users collection between tests too,
// so the session user must be recreated every time.
let counter = 0;

async function loginAs(app, role = "admin") {
  counter += 1;
  const email = `test-${role}-${counter}@test.local`;
  const password = "Test@12345";
  const passwordHash = await User.hashPassword(password);
  await User.create({ username: `test-${role}-${counter}`, email, passwordHash, role, label: role, isActive: true });

  const res = await request(app).post("/api/auth/login").send({ identifier: email, password });
  return res.headers["set-cookie"];
}

module.exports = { loginAs };
