const request = require("supertest");
const jwt = require("jsonwebtoken");
const { setupTestDB, teardownTestDB, clearTestDB } = require("./setup");

let app;
let jwtSecret;

beforeAll(async () => {
  await setupTestDB();
  app = require("../src/app");
  ({ jwtSecret } = require("../src/config/env"));
});

afterEach(async () => {
  await clearTestDB();
});

afterAll(async () => {
  await teardownTestDB();
});

const CREDS = { username: "jdoe", email: "jdoe@example.com", password: "Passw0rd!", role: "admin" };

describe("auth", () => {
  it("registers a new user and sets an auth cookie", async () => {
    const res = await request(app).post("/api/auth/register").send(CREDS);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(CREDS.email);
    expect(res.body.data.role).toBe("admin");
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("rejects register with an unknown role", async () => {
    const res = await request(app).post("/api/auth/register").send({ ...CREDS, role: "principal" });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("rejects duplicate username/email on register", async () => {
    await request(app).post("/api/auth/register").send(CREDS);
    const res = await request(app).post("/api/auth/register").send(CREDS);
    expect(res.status).toBe(409);
  });

  it("logs in with correct credentials and returns the right role via /me", async () => {
    await request(app).post("/api/auth/register").send(CREDS);
    const login = await request(app)
      .post("/api/auth/login")
      .send({ identifier: CREDS.email, password: CREDS.password });
    expect(login.status).toBe(200);
    const cookie = login.headers["set-cookie"];

    const me = await request(app).get("/api/auth/me").set("Cookie", cookie);
    expect(me.status).toBe(200);
    expect(me.body.data.role).toBe("admin");
    expect(me.body.data.email).toBe(CREDS.email);
  });

  it("rejects login with wrong password", async () => {
    await request(app).post("/api/auth/register").send(CREDS);
    const res = await request(app)
      .post("/api/auth/login")
      .send({ identifier: CREDS.email, password: "WrongPass1" });
    expect(res.status).toBe(401);
  });

  it("rejects login for an inactive user", async () => {
    const reg = await request(app).post("/api/auth/register").send(CREDS);
    const { User } = require("../src/module/Admin");
    await User.findByIdAndUpdate(reg.body.data.id, { isActive: false });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ identifier: CREDS.email, password: CREDS.password });
    expect(res.status).toBe(401);
  });

  it("logs out and clears the cookie", async () => {
    const res = await request(app).post("/api/auth/logout");
    expect(res.status).toBe(200);
    expect(res.headers["set-cookie"][0]).toMatch(/amit_school_token=;/);
  });

  it("rejects a protected route with no token", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });

  it("rejects a protected route with an invalid token", async () => {
    const res = await request(app).get("/api/auth/me").set("Cookie", ["amit_school_token=not-a-real-token"]);
    expect(res.status).toBe(401);
  });

  it("rejects a protected route with an expired token", async () => {
    const reg = await request(app).post("/api/auth/register").send(CREDS);
    const expired = jwt.sign({ sub: reg.body.data.id, role: "admin" }, jwtSecret, { expiresIn: -10 });
    const res = await request(app).get("/api/auth/me").set("Cookie", [`amit_school_token=${expired}`]);
    expect(res.status).toBe(401);
  });
});
