// Verifies crudRouter's auth enforcement itself (added once the frontend
// started sending session cookies on every request — see crudRouter.js).
const request = require("supertest");
const app = require("../src/app");
const { connect, closeDatabase, clearDatabase } = require("./helpers/db");
const { loginAs } = require("./helpers/auth");

beforeAll(connect);
afterEach(clearDatabase);
afterAll(closeDatabase);

describe("crudRouter auth enforcement", () => {
  it("401s a GET list with no session", async () => {
    const res = await request(app).get("/api/notices");
    expect(res.status).toBe(401);
  });

  it("401s a GET by id with no session", async () => {
    const res = await request(app).get("/api/notices/64b7f9a1f9a1f9a1f9a1f9a1");
    expect(res.status).toBe(401);
  });

  it("401s a POST with no session", async () => {
    const res = await request(app).post("/api/notices").send({ title: "X" });
    expect(res.status).toBe(401);
  });

  it("401s a PATCH with no session", async () => {
    const res = await request(app).patch("/api/notices/64b7f9a1f9a1f9a1f9a1f9a1").send({ title: "X" });
    expect(res.status).toBe(401);
  });

  it("401s a DELETE with no session", async () => {
    const res = await request(app).delete("/api/notices/64b7f9a1f9a1f9a1f9a1f9a1");
    expect(res.status).toBe(401);
  });

  it("allows a GET with any authenticated role, even one not in writeRoles", async () => {
    const cookie = await loginAs(app, "teacher");
    const res = await request(app).get("/api/notices").set("Cookie", cookie);
    expect(res.status).toBe(200);
  });

  it("403s a write from a role not in writeRoles", async () => {
    // /api/notices writeRoles is ["admin", "library"] — teacher isn't allowed to write.
    const cookie = await loginAs(app, "teacher");
    const res = await request(app).post("/api/notices").set("Cookie", cookie).send({ title: "X" });
    expect(res.status).toBe(403);
  });

  it("allows a write from a role in writeRoles", async () => {
    const cookie = await loginAs(app, "library");
    const res = await request(app).post("/api/notices").set("Cookie", cookie).send({ title: "X" });
    expect(res.status).toBe(201);
  });

  it("allows any authenticated role to write where no writeRoles is configured (/leave)", async () => {
    const cookie = await loginAs(app, "student-accountant");
    const res = await request(app).post("/api/leave").set("Cookie", cookie).send({ reason: "Fever" });
    expect(res.status).toBe(201);
  });

  it("lets main-accountant and student-accountant write /students, matching their real StudentAdmission.jsx forms", async () => {
    for (const role of ["main-accountant", "student-accountant"]) {
      const cookie = await loginAs(app, role);
      const res = await request(app).post("/api/students").set("Cookie", cookie).send({ name: `Test ${role}`, class: "5" });
      expect(res.status).toBe(201);
    }
  });

  it("lets main-accountant write /notices and /events, matching its own Notices.jsx/Events.jsx", async () => {
    const cookie = await loginAs(app, "main-accountant");
    const notice = await request(app).post("/api/notices").set("Cookie", cookie).send({ title: "X", audience: "All Classes" });
    expect(notice.status).toBe(201);
    const event = await request(app).post("/api/events").set("Cookie", cookie).send({ title: "X", date: "2026-01-01", status: "Planning" });
    expect(event.status).toBe(201);
  });

  it("lets main-accountant write /staff-onboarding and /non-teaching-onboarding, matching its own applicant-intake forms", async () => {
    const cookie = await loginAs(app, "main-accountant");
    const teacher = await request(app)
      .post("/api/staff-onboarding")
      .set("Cookie", cookie)
      .send({
        staffId: "APP-T-1", fullName: "X", father: "X", mother: "X", dob: "2000-01-01", gender: "Male",
        caste: "X", category: "General", mobile: "9876543210", email: "x@x.com", aadhaar: "1", pan: "1",
        currentAddress: "X", permanentAddress: "X", subject: "Maths", classGrade: "5", experience: "1-2 years",
        certifications: "X", computerSkill: "Basic",
      });
    expect(teacher.status).toBe(201);
    const nonTeaching = await request(app)
      .post("/api/non-teaching-onboarding")
      .set("Cookie", cookie)
      .send({
        staffId: "APP-NT-1", fullName: "X", father: "X", mother: "X", dob: "2000-01-01", gender: "Male",
        caste: "X", category: "General", maritalStatus: "Single", mobile: "9876543210", emergencyContact: "1",
        aadhaar: "1", pan: "1", currentAddress: "X", permanentAddress: "X", department: "Office",
        workExp: "1-2 years", shift: "Day Shift", qualification: "Graduate", skills: "X",
      });
    expect(nonTeaching.status).toBe(201);
  });
});
