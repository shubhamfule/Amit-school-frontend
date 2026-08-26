const request = require("supertest");
const app = require("../src/app");
const { connect, closeDatabase, clearDatabase } = require("./helpers/db");
const { loginAs } = require("./helpers/auth");
const testCrud = require("./helpers/testCrud");

let cookie;
beforeAll(connect);
beforeEach(async () => {
  cookie = await loginAs(app, "admin");
});
afterEach(clearDatabase);
afterAll(closeDatabase);

describe("/api/library-members", () => {
  testCrud(() => app, {
    basePath: "/api/library-members",
    validPayload: { memberId: "MEM-101", name: "Asha Patil", role: "Student" },
    updatePayload: { record: "Overdue" },
    updatedField: "record",
    getCookie: () => cookie,
  });

  it("rejects a duplicate memberId with 409", async () => {
    const payload = { memberId: "MEM-102", name: "Dup", role: "Student" };
    await request(app).post("/api/library-members").set("Cookie", cookie).send(payload);
    const res = await request(app).post("/api/library-members").set("Cookie", cookie).send(payload);
    expect(res.status).toBe(409);
  });
});
