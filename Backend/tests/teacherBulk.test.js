const request = require("supertest");
const mongoose = require("mongoose");
const { setupTestDB, teardownTestDB, clearTestDB } = require("./setup");

let app;

beforeAll(async () => {
  await setupTestDB();
  app = require("../src/app");
});

afterEach(async () => {
  await clearTestDB();
});

afterAll(async () => {
  await teardownTestDB();
});

async function loginAsTeacher() {
  const creds = { username: "teacher1", email: "teacher1@example.com", password: "Passw0rd!", role: "teacher" };
  await request(app).post("/api/auth/register").send(creds);
  const login = await request(app)
    .post("/api/auth/login")
    .send({ identifier: creds.email, password: creds.password });
  return login.headers["set-cookie"];
}

describe("POST /api/attendance/bulk", () => {
  it("upserts — re-posting the same date updates existing records instead of duplicating", async () => {
    const cookie = await loginAsTeacher();
    const studentId = new mongoose.Types.ObjectId().toString();
    const date = "2026-08-10";

    const first = await request(app)
      .post("/api/attendance/bulk")
      .set("Cookie", cookie)
      .send({ date, records: [{ studentId, studentName: "Asha", class: "5", status: "present" }] });
    expect(first.status).toBe(201);
    expect(first.body.data).toHaveLength(1);
    expect(first.body.data[0].status).toBe("present");

    const second = await request(app)
      .post("/api/attendance/bulk")
      .set("Cookie", cookie)
      .send({ date, records: [{ studentId, studentName: "Asha", class: "5", status: "absent" }] });
    expect(second.status).toBe(201);
    expect(second.body.data).toHaveLength(1);
    expect(second.body.data[0].status).toBe("absent");

    const { StudentAttendance } = require("../src/module/Teacher");
    const all = await StudentAttendance.find({});
    expect(all).toHaveLength(1);
  });

  it("rejects a payload missing date or records", async () => {
    const cookie = await loginAsTeacher();
    const res = await request(app).post("/api/attendance/bulk").set("Cookie", cookie).send({ date: "2026-08-10" });
    expect(res.status).toBe(400);
  });
});

describe("GET /api/attendance?date=YYYY-MM-DD", () => {
  it("returns only records within that day, excluding other days", async () => {
    const cookie = await loginAsTeacher();
    const s1 = new mongoose.Types.ObjectId().toString();
    const s2 = new mongoose.Types.ObjectId().toString();

    await request(app)
      .post("/api/attendance/bulk")
      .set("Cookie", cookie)
      .send({ date: "2026-08-10", records: [{ studentId: s1, studentName: "Asha", class: "5", status: "present" }] });
    await request(app)
      .post("/api/attendance/bulk")
      .set("Cookie", cookie)
      .send({ date: "2026-08-11", records: [{ studentId: s2, studentName: "Ravi", class: "5", status: "absent" }] });

    const res = await request(app).get("/api/attendance?date=2026-08-10").set("Cookie", cookie);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].studentId).toBe(s1);
  });
});

describe("POST /api/schedule/bulk", () => {
  it("bulk-inserts schedule entries", async () => {
    const cookie = await loginAsTeacher();
    const entries = [
      { time: "09:00 - 09:45", subject: "Math", class: "5", room: "101" },
      { time: "09:45 - 10:30", subject: "Science", class: "5", room: "102" },
    ];
    const res = await request(app).post("/api/schedule/bulk").set("Cookie", cookie).send({ entries });
    expect(res.status).toBe(201);
    expect(res.body.data).toHaveLength(2);

    const list = await request(app).get("/api/schedule").set("Cookie", cookie);
    expect(list.body.data).toHaveLength(2);
  });

  it("rejects an empty entries array", async () => {
    const cookie = await loginAsTeacher();
    const res = await request(app).post("/api/schedule/bulk").set("Cookie", cookie).send({ entries: [] });
    expect(res.status).toBe(400);
  });
});
