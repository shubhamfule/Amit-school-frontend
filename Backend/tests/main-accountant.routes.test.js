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

describe("/api/transactions", () => {
  testCrud(() => app, {
    basePath: "/api/transactions",
    validPayload: { date: "2026-01-01", name: "Ravi", amount: 5000, type: "Fee Collection" },
    updatePayload: { status: "Completed" },
    updatedField: "status",
    getCookie: () => cookie,
  });
});

describe("/api/teacher-salary", () => {
  testCrud(() => app, {
    basePath: "/api/teacher-salary",
    validPayload: { staffId: "T001", name: "Meena Rao", designation: "Teacher", salary: 30000 },
    updatePayload: { paid: 15000 },
    updatedField: "paid",
    getCookie: () => cookie,
  });
});

describe("/api/non-teaching-salary", () => {
  testCrud(() => app, {
    basePath: "/api/non-teaching-salary",
    validPayload: { roleKey: "clerk", staffId: "C001", name: "Suresh", designation: "Clerk", salary: 15000 },
    updatePayload: { paid: 7500 },
    updatedField: "paid",
    getCookie: () => cookie,
  });

  it("enforces the (roleKey, staffId) unique index with 409", async () => {
    const payload = { roleKey: "clerk", staffId: "C002", name: "A", designation: "Clerk", salary: 15000 };
    await request(app).post("/api/non-teaching-salary").set("Cookie", cookie).send(payload);
    const res = await request(app).post("/api/non-teaching-salary").set("Cookie", cookie).send(payload);
    expect(res.status).toBe(409);
  });
});

describe("/api/student-fees", () => {
  testCrud(() => app, {
    basePath: "/api/student-fees",
    validPayload: { roll: "R001", name: "Asha", class: "5", total: 10000 },
    updatePayload: { paid: 5000 },
    updatedField: "paid",
    getCookie: () => cookie,
  });

  it("rejects a duplicate roll with 409", async () => {
    const payload = { roll: "R002", name: "Dup", class: "5", total: 10000 };
    await request(app).post("/api/student-fees").set("Cookie", cookie).send(payload);
    const res = await request(app).post("/api/student-fees").set("Cookie", cookie).send(payload);
    expect(res.status).toBe(409);
  });
});

describe("/api/expenses", () => {
  testCrud(() => app, {
    basePath: "/api/expenses",
    validPayload: { date: "2026-01-01", expense: "Chalk", category: "Office", amount: 200, mode: "Cash" },
    updatePayload: { amount: 250 },
    updatedField: "amount",
    getCookie: () => cookie,
  });

  it("rejects an invalid category enum", async () => {
    const res = await request(app)
      .post("/api/expenses")
      .set("Cookie", cookie)
      .send({
        date: "2026-01-01",
        expense: "X",
        category: "NotACategory",
        amount: 100,
        mode: "Cash",
      });
    expect(res.status).toBe(400);
  });
});

describe("/api/staff-attendance", () => {
  testCrud(() => app, {
    basePath: "/api/staff-attendance",
    validPayload: { staffType: "teaching", personKey: "T001", date: "2026-01-01" },
    updatePayload: { status: "Absent" },
    updatedField: "status",
    getCookie: () => cookie,
  });

  it("enforces the (staffType, personKey, date) unique index with 409", async () => {
    const payload = { staffType: "teaching", personKey: "T002", date: "2026-01-02" };
    await request(app).post("/api/staff-attendance").set("Cookie", cookie).send(payload);
    const res = await request(app).post("/api/staff-attendance").set("Cookie", cookie).send(payload);
    expect(res.status).toBe(409);
  });
});

describe("/api/library (Book)", () => {
  testCrud(() => app, {
    basePath: "/api/library",
    validPayload: { title: "Introduction to Algebra" },
    updatePayload: { status: "Issued" },
    updatedField: "status",
    getCookie: () => cookie,
  });
});

describe("/api/book-issues", () => {
  testCrud(() => app, {
    basePath: "/api/book-issues",
    validPayload: {
      name: "Asha",
      userType: "Student",
      bookName: "Algebra",
      issueDate: "2026-01-01",
      dueDate: "2026-01-15",
    },
    updatePayload: { status: "Returned" },
    updatedField: "status",
    getCookie: () => cookie,
  });
});

describe("/api/book-returns", () => {
  testCrud(() => app, {
    basePath: "/api/book-returns",
    validPayload: { name: "Asha", userType: "Student", bookId: "BK-1", returnDate: "2026-01-10" },
    updatePayload: { condition: "Good" },
    updatedField: "condition",
    getCookie: () => cookie,
  });
});

describe("/api/library-fines", () => {
  testCrud(() => app, {
    basePath: "/api/library-fines",
    validPayload: { fineId: "FIN-001", name: "Asha", userType: "Student", bookId: "BK-1" },
    updatePayload: { status: "Paid" },
    updatedField: "status",
    getCookie: () => cookie,
  });

  it("rejects a duplicate fineId with 409", async () => {
    const payload = { fineId: "FIN-002", name: "A", userType: "Student", bookId: "BK-2" };
    await request(app).post("/api/library-fines").set("Cookie", cookie).send(payload);
    const res = await request(app).post("/api/library-fines").set("Cookie", cookie).send(payload);
    expect(res.status).toBe(409);
  });
});

describe("/api/library-clearances", () => {
  testCrud(() => app, {
    basePath: "/api/library-clearances",
    validPayload: { clearanceId: "CLR-001", name: "Asha", userType: "Student" },
    updatePayload: { status: "Cleared" },
    updatedField: "status",
    getCookie: () => cookie,
  });
});
