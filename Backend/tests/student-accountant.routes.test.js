// student-accountant.js (the route file) mounts nothing of its own — this
// portal owns no model (see Student-account.js). Of the models it reuses,
// only Student is actually written to today: StudentAdmission.jsx is the
// one page in src/modules/student-accountant/Accountant/* that calls the
// real API. Every other page there (StudentManagement, StudentFeeCollection,
// BookIssue, BookReturn, FineCollection, LibraryClearance, Notices, Events)
// renders local seed data and never hits the backend — so this test only
// covers the "student-accountant" role's access to /students, plus a
// read-only check on /notices and /events.
const request = require("supertest");
const app = require("../src/app");
const { connect, closeDatabase, clearDatabase } = require("./helpers/db");
const { loginAs } = require("./helpers/auth");

let cookie;
beforeAll(connect);
beforeEach(async () => {
  cookie = await loginAs(app, "student-accountant");
});
afterEach(clearDatabase);
afterAll(closeDatabase);

describe("student-accountant role access", () => {
  it("writes /students, matching StudentAdmission.jsx's real apiPost call", async () => {
    const res = await request(app).post("/api/students").set("Cookie", cookie).send({ name: "Asha", class: "5" });
    expect(res.status).toBe(201);
  });

  it("can read but not write /notices and /events, matching the portal's read-only Notices.jsx/Events.jsx", async () => {
    const readNotices = await request(app).get("/api/notices").set("Cookie", cookie);
    expect(readNotices.status).toBe(200);
    const readEvents = await request(app).get("/api/events").set("Cookie", cookie);
    expect(readEvents.status).toBe(200);

    const writeNotice = await request(app).post("/api/notices").set("Cookie", cookie).send({ title: "X", audience: "All Classes" });
    expect(writeNotice.status).toBe(403);
    const writeEvent = await request(app).post("/api/events").set("Cookie", cookie).send({ title: "X", date: "2026-01-01", status: "Planning" });
    expect(writeEvent.status).toBe(403);
  });
});
