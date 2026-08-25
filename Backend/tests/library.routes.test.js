const request = require("supertest");
const app = require("../src/app");
const { connect, closeDatabase, clearDatabase } = require("./helpers/db");
const testCrud = require("./helpers/testCrud");

beforeAll(connect);
afterEach(clearDatabase);
afterAll(closeDatabase);

describe("/api/library-members", () => {
  testCrud(() => app, {
    basePath: "/api/library-members",
    validPayload: { memberId: "MEM-101", name: "Asha Patil", role: "Student" },
    updatePayload: { record: "Overdue" },
    updatedField: "record",
  });

  it("rejects a duplicate memberId with 409", async () => {
    const payload = { memberId: "MEM-102", name: "Dup", role: "Student" };
    await request(app).post("/api/library-members").send(payload);
    const res = await request(app).post("/api/library-members").send(payload);
    expect(res.status).toBe(409);
  });
});
