const request = require("supertest");
const mongoose = require("mongoose");
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

describe("/api/certificates", () => {
  testCrud(() => app, {
    basePath: "/api/certificates",
    validPayload: { title: "Science Fair", category: "academic", issuer: "School", date: "2026-01-01" },
    updatePayload: { category: "sports" },
    updatedField: "category",
    getCookie: () => cookie,
  });
});

describe("/api/parent-info", () => {
  testCrud(() => app, {
    basePath: "/api/parent-info",
    validPayload: {
      studentId: new mongoose.Types.ObjectId().toString(),
      father: { name: "Ramesh" },
      mother: { name: "Sunita" },
    },
    updatePayload: { father: { name: "Ramesh Updated" } },
    updatedField: "father",
    getCookie: () => cookie,
  });
});

describe("/api/exams", () => {
  testCrud(() => app, {
    basePath: "/api/exams",
    validPayload: { subject: "Maths", date: "2026-03-01", time: "10:00", room: "Hall A" },
    updatePayload: { status: "completed" },
    updatedField: "status",
    getCookie: () => cookie,
  });
});

describe("/api/results", () => {
  testCrud(() => app, {
    basePath: "/api/results",
    validPayload: { subject: "Maths", term: "term1", marks: 88, max: 100, status: "pass" },
    updatePayload: { grade: "A" },
    updatedField: "grade",
    getCookie: () => cookie,
  });

  it("rejects an invalid term enum", async () => {
    const res = await request(app)
      .post("/api/results")
      .set("Cookie", cookie)
      .send({ subject: "Maths", term: "not-a-term", marks: 50, max: 100, status: "pass" });
    expect(res.status).toBe(400);
  });
});
