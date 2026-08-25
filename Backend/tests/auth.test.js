const request = require("supertest");
const app = require("../src/app");
const { connect, closeDatabase, clearDatabase } = require("./helpers/db");

beforeAll(connect);
afterEach(clearDatabase);
afterAll(closeDatabase);

const validUser = {
  username: "admin1",
  email: "admin1@example.com",
  password: "password123",
  role: "admin",
  label: "Admin One",
};

describe("POST /api/auth/register", () => {
  it("creates a user and sets the auth cookie", async () => {
    const res = await request(app).post("/api/auth/register").send(validUser);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({
      username: validUser.username,
      email: validUser.email,
      role: validUser.role,
    });
    expect(res.body.data.passwordHash).toBeUndefined();
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("rejects a missing required field", async () => {
    const { password, ...rest } = validUser;
    const res = await request(app).post("/api/auth/register").send(rest);
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("rejects an invalid role", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ ...validUser, role: "not-a-role" });
    expect(res.status).toBe(400);
  });

  it("rejects a duplicate username/email with 409", async () => {
    await request(app).post("/api/auth/register").send(validUser);
    const res = await request(app).post("/api/auth/register").send(validUser);
    expect(res.status).toBe(409);
  });
});

describe("POST /api/auth/login", () => {
  it("logs in with a valid identifier/password", async () => {
    await request(app).post("/api/auth/register").send(validUser);
    const res = await request(app)
      .post("/api/auth/login")
      .send({ identifier: validUser.email, password: validUser.password });
    expect(res.status).toBe(200);
    expect(res.body.data.username).toBe(validUser.username);
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("logs in with username as the identifier too", async () => {
    await request(app).post("/api/auth/register").send(validUser);
    const res = await request(app)
      .post("/api/auth/login")
      .send({ identifier: validUser.username, password: validUser.password });
    expect(res.status).toBe(200);
  });

  it("rejects a wrong password with 401", async () => {
    await request(app).post("/api/auth/register").send(validUser);
    const res = await request(app)
      .post("/api/auth/login")
      .send({ identifier: validUser.email, password: "wrong-password" });
    expect(res.status).toBe(401);
  });

  it("rejects an unknown identifier with 401", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ identifier: "nobody@example.com", password: "whatever123" });
    expect(res.status).toBe(401);
  });
});

describe("GET /api/auth/me", () => {
  it("401s with no session", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });

  it("returns the current user for a valid session cookie", async () => {
    const register = await request(app).post("/api/auth/register").send(validUser);
    const cookie = register.headers["set-cookie"];

    const res = await request(app).get("/api/auth/me").set("Cookie", cookie);
    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe(validUser.email);
  });

  it("accepts a Bearer token instead of a cookie", async () => {
    const register = await request(app).post("/api/auth/register").send(validUser);
    const cookie = register.headers["set-cookie"][0];
    const token = cookie.split(";")[0].split("=")[1];

    const res = await request(app).get("/api/auth/me").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe(validUser.email);
  });

  it("401s for a garbage token", async () => {
    const res = await request(app).get("/api/auth/me").set("Authorization", "Bearer garbage");
    expect(res.status).toBe(401);
  });
});

describe("POST /api/auth/logout", () => {
  it("clears the cookie and returns success", async () => {
    const res = await request(app).post("/api/auth/logout");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, data: null });
  });
});
