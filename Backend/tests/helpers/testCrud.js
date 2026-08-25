const request = require("supertest");

// Exercises the full list/create/get/update/delete cycle a crudRouter(Model)
// mount is expected to support, against a real (in-memory) MongoDB.
function testCrud(getApp, { basePath, validPayload, updatePayload, updatedField }) {
  it(`GET ${basePath} starts empty`, async () => {
    const res = await request(getApp()).get(basePath);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual([]);
  });

  it(`POST ${basePath} creates a document`, async () => {
    const res = await request(getApp()).post(basePath).send(validPayload);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toBeDefined();
  });

  it(`GET ${basePath} lists the created document`, async () => {
    const create = await request(getApp()).post(basePath).send(validPayload);
    const res = await request(getApp()).get(basePath);
    expect(res.status).toBe(200);
    expect(res.body.data.some((d) => d._id === create.body.data._id)).toBe(true);
  });

  it(`GET ${basePath}/:id fetches one document`, async () => {
    const create = await request(getApp()).post(basePath).send(validPayload);
    const res = await request(getApp()).get(`${basePath}/${create.body.data._id}`);
    expect(res.status).toBe(200);
    expect(res.body.data._id).toBe(create.body.data._id);
  });

  it(`GET ${basePath}/:id 404s for a missing document`, async () => {
    const missingId = "64b7f9a1f9a1f9a1f9a1f9a1";
    const res = await request(getApp()).get(`${basePath}/${missingId}`);
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  if (updatePayload) {
    it(`PATCH ${basePath}/:id updates a document`, async () => {
      const create = await request(getApp()).post(basePath).send(validPayload);
      const res = await request(getApp())
        .patch(`${basePath}/${create.body.data._id}`)
        .send(updatePayload);
      expect(res.status).toBe(200);
      expect(res.body.data[updatedField]).toEqual(updatePayload[updatedField]);
    });
  }

  it(`DELETE ${basePath}/:id removes a document`, async () => {
    const create = await request(getApp()).post(basePath).send(validPayload);
    const del = await request(getApp()).delete(`${basePath}/${create.body.data._id}`);
    expect(del.status).toBe(204);

    const get = await request(getApp()).get(`${basePath}/${create.body.data._id}`);
    expect(get.status).toBe(404);
  });
}

module.exports = testCrud;
