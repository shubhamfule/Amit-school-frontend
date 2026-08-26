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

describe("/api/students", () => {
  testCrud(() => app, {
    basePath: "/api/students",
    validPayload: { name: "Asha Patil", class: "5", section: "A" },
    updatePayload: { section: "B" },
    updatedField: "section",
    getCookie: () => cookie,
  });

  it("computes feePending as a virtual", async () => {
    const res = await request(app)
      .post("/api/students")
      .set("Cookie", cookie)
      .send({ name: "Rohit", class: "6", feeTotal: 1000, feePaid: 400 });
    expect(res.body.data.feePending).toBe(600);
  });
});

describe("/api/staff", () => {
  testCrud(() => app, {
    basePath: "/api/staff",
    validPayload: {
      staffId: "T001",
      name: "Meena Rao",
      type: "teaching",
      mobile: "9876543210",
      role: "Mathematics Teacher",
      joiningDate: "2024-06-01",
      monthlySalary: 30000,
    },
    updatePayload: { monthlySalary: 32000 },
    updatedField: "monthlySalary",
    getCookie: () => cookie,
  });

  it("derives academicYear from joiningDate", async () => {
    const res = await request(app)
      .post("/api/staff")
      .set("Cookie", cookie)
      .send({
        staffId: "T002",
        name: "Kiran Shah",
        type: "teaching",
        mobile: "9876543211",
        role: "Science Teacher",
        joiningDate: "2024-06-01",
        monthlySalary: 28000,
      });
    expect(res.status).toBe(201);
    expect(res.body.data.academicYear).toBe("2024-25");
  });

  it("rejects a mobile number that fails the pattern", async () => {
    const res = await request(app)
      .post("/api/staff")
      .set("Cookie", cookie)
      .send({
        staffId: "T003",
        name: "Bad Mobile",
        type: "teaching",
        mobile: "12345",
        role: "Teacher",
        joiningDate: "2024-06-01",
        monthlySalary: 28000,
      });
    expect(res.status).toBe(400);
  });

  it("rejects a duplicate staffId with 409", async () => {
    const payload = {
      staffId: "T004",
      name: "Dup One",
      type: "teaching",
      mobile: "9876543212",
      role: "Teacher",
      joiningDate: "2024-06-01",
      monthlySalary: 25000,
    };
    await request(app).post("/api/staff").set("Cookie", cookie).send(payload);
    const res = await request(app)
      .post("/api/staff")
      .set("Cookie", cookie)
      .send({ ...payload, name: "Dup Two" });
    expect(res.status).toBe(409);
  });
});

describe("/api/leave", () => {
  testCrud(() => app, {
    basePath: "/api/leave",
    validPayload: { staffName: "Meena Rao", reason: "Fever" },
    updatePayload: { status: "Approved" },
    updatedField: "status",
    getCookie: () => cookie,
  });

  it("requires a reason", async () => {
    const res = await request(app).post("/api/leave").set("Cookie", cookie).send({ staffName: "No Reason" });
    expect(res.status).toBe(400);
  });
});

describe("/api/notices", () => {
  testCrud(() => app, {
    basePath: "/api/notices",
    validPayload: { title: "Holiday notice", body: "School closed" },
    updatePayload: { priority: "high" },
    updatedField: "priority",
    getCookie: () => cookie,
  });
});

describe("/api/events", () => {
  testCrud(() => app, {
    basePath: "/api/events",
    validPayload: { title: "Sports Day", date: "2026-01-15" },
    updatePayload: { status: "scheduled" },
    updatedField: "status",
    getCookie: () => cookie,
  });
});

describe("/api/calendar-events", () => {
  testCrud(() => app, {
    basePath: "/api/calendar-events",
    validPayload: { title: "PTM", date: "2026-02-01", time: "10:00" },
    updatePayload: { time: "11:00" },
    updatedField: "time",
    getCookie: () => cookie,
  });
});

describe("/api/settings", () => {
  testCrud(() => app, {
    basePath: "/api/settings",
    validPayload: { userId: new mongoose.Types.ObjectId().toString() },
    updatePayload: { themeChoice: "dark" },
    updatedField: "themeChoice",
    getCookie: () => cookie,
  });

  it("rejects a duplicate userId with 409", async () => {
    const userId = new mongoose.Types.ObjectId().toString();
    await request(app).post("/api/settings").set("Cookie", cookie).send({ userId });
    const res = await request(app).post("/api/settings").set("Cookie", cookie).send({ userId });
    expect(res.status).toBe(409);
  });
});
