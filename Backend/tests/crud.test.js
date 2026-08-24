const request = require("supertest");
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

async function registerAndLogin(role) {
  const creds = { username: `${role}-user`, email: `${role}@example.com`, password: "Passw0rd!", role };
  await request(app).post("/api/auth/register").send(creds);
  const login = await request(app)
    .post("/api/auth/login")
    .send({ identifier: creds.email, password: creds.password });
  return login.headers["set-cookie"];
}

// Notice: writeRoles = ["admin", "library"] — a good stand-in for the
// generic crudRouter/crudFactory pair (list/create/get/update/delete + the
// writeRoles 403 case).
describe("crudRouter / crudFactory (Notice)", () => {
  it("requires auth to list", async () => {
    const res = await request(app).get("/api/notices");
    expect(res.status).toBe(401);
  });

  it("lets an allowed role create, list, get, update and delete", async () => {
    const cookie = await registerAndLogin("admin");

    const create = await request(app)
      .post("/api/notices")
      .set("Cookie", cookie)
      .send({ title: "Holiday", date: "2026-09-01", body: "School closed" });
    expect(create.status).toBe(201);
    const id = create.body.data._id;

    const list = await request(app).get("/api/notices").set("Cookie", cookie);
    expect(list.status).toBe(200);
    expect(list.body.data).toHaveLength(1);

    const getOne = await request(app).get(`/api/notices/${id}`).set("Cookie", cookie);
    expect(getOne.status).toBe(200);
    expect(getOne.body.data.title).toBe("Holiday");

    const update = await request(app)
      .patch(`/api/notices/${id}`)
      .set("Cookie", cookie)
      .send({ title: "Updated Holiday" });
    expect(update.status).toBe(200);
    expect(update.body.data.title).toBe("Updated Holiday");

    const del = await request(app).delete(`/api/notices/${id}`).set("Cookie", cookie);
    expect(del.status).toBe(204);

    const getMissing = await request(app).get(`/api/notices/${id}`).set("Cookie", cookie);
    expect(getMissing.status).toBe(404);
  });

  it("blocks a role not in writeRoles from creating (403)", async () => {
    const cookie = await registerAndLogin("teacher");
    const res = await request(app)
      .post("/api/notices")
      .set("Cookie", cookie)
      .send({ title: "Should fail", date: "2026-09-01" });
    expect(res.status).toBe(403);
  });

  it("still lets a non-writeRoles role read (GET has no writeRoles guard)", async () => {
    const cookie = await registerAndLogin("teacher");
    const res = await request(app).get("/api/notices").set("Cookie", cookie);
    expect(res.status).toBe(200);
  });
});
