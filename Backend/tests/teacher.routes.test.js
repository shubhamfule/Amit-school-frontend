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

async function createStudent() {
  const res = await request(app).post("/api/students").set("Cookie", cookie).send({ name: "Asha", class: "5" });
  return res.body.data;
}

describe("/api/attendance (custom bulk router)", () => {
  it("GET starts empty", async () => {
    const res = await request(app).get("/api/attendance").set("Cookie", cookie);
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });

  it("POST /bulk upserts attendance records for a date", async () => {
    const student = await createStudent();
    const res = await request(app)
      .post("/api/attendance/bulk")
      .set("Cookie", cookie)
      .send({
        date: "2026-01-05",
        records: [{ studentId: student._id, studentName: student.name, class: student.class, status: "present" }],
      });
    expect(res.status).toBe(201);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].status).toBe("present");
  });

  it("POST /bulk on the same student/date upserts rather than duplicating", async () => {
    const student = await createStudent();
    const body = {
      date: "2026-01-05",
      records: [{ studentId: student._id, studentName: student.name, class: student.class, status: "present" }],
    };
    await request(app).post("/api/attendance/bulk").set("Cookie", cookie).send(body);
    await request(app)
      .post("/api/attendance/bulk")
      .set("Cookie", cookie)
      .send({ ...body, records: [{ ...body.records[0], status: "absent" }] });

    const res = await request(app).get("/api/attendance").set("Cookie", cookie).query({ date: "2026-01-05" });
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].status).toBe("absent");
  });

  it("GET ?date= filters to that day only", async () => {
    const student = await createStudent();
    await request(app)
      .post("/api/attendance/bulk")
      .set("Cookie", cookie)
      .send({
        date: "2026-01-05",
        records: [{ studentId: student._id, studentName: student.name, status: "present" }],
      });
    await request(app)
      .post("/api/attendance/bulk")
      .set("Cookie", cookie)
      .send({
        date: "2026-01-06",
        records: [{ studentId: student._id, studentName: student.name, status: "absent" }],
      });

    const res = await request(app).get("/api/attendance").set("Cookie", cookie).query({ date: "2026-01-05" });
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].status).toBe("present");
  });

  it("POST /bulk 400s when records is missing", async () => {
    const res = await request(app).post("/api/attendance/bulk").set("Cookie", cookie).send({ date: "2026-01-05" });
    expect(res.status).toBe(400);
  });
});

describe("/api/marks", () => {
  testCrud(() => app, {
    basePath: "/api/marks",
    validPayload: { test: "Unit Test 1", roll: "R001", name: "Asha", subject: "Maths", marks: 88 },
    updatePayload: { marks: 92 },
    updatedField: "marks",
    getCookie: () => cookie,
  });

  it("rejects marks above 100", async () => {
    const res = await request(app)
      .post("/api/marks")
      .set("Cookie", cookie)
      .send({ test: "T", roll: "R1", name: "Asha", subject: "Maths", marks: 150 });
    expect(res.status).toBe(400);
  });
});

describe("/api/schedule", () => {
  testCrud(() => app, {
    basePath: "/api/schedule",
    validPayload: { time: "09:00 - 09:45", subject: "Maths", class: "5", room: "101" },
    updatePayload: { status: "Ongoing" },
    updatedField: "status",
    getCookie: () => cookie,
  });

  it("POST /bulk CSV-imports multiple entries", async () => {
    const res = await request(app)
      .post("/api/schedule/bulk")
      .set("Cookie", cookie)
      .send({
        entries: [
          { time: "09:00 - 09:45", subject: "Maths", class: "5", room: "101" },
          { time: "09:45 - 10:30", subject: "Science", class: "5", room: "102" },
        ],
      });
    expect(res.status).toBe(201);
    expect(res.body.data).toHaveLength(2);

    const list = await request(app).get("/api/schedule").set("Cookie", cookie);
    expect(list.body.data).toHaveLength(2);
  });

  it("POST /bulk 400s on an empty entries array", async () => {
    const res = await request(app).post("/api/schedule/bulk").set("Cookie", cookie).send({ entries: [] });
    expect(res.status).toBe(400);
  });
});

describe("/api/assignments", () => {
  testCrud(() => app, {
    basePath: "/api/assignments",
    validPayload: { title: "Ch 3 exercises", subject: "Maths", class: "5", dueDate: "2026-02-01" },
    updatePayload: { status: "Completed" },
    updatedField: "status",
    getCookie: () => cookie,
  });
});
