const request = require("supertest");
const app = require("../src/app");

describe("GET /health", () => {
  it("reports ok without touching the database", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, data: { status: "ok" } });
  });
});

describe("unknown routes", () => {
  it("404s with the standard error shape", async () => {
    const res = await request(app).get("/api/does-not-exist");
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Route not found/);
  });
});
