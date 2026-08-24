// Shared mongodb-memory-server lifecycle helpers for the test suite. Each
// test file gets its own in-process Mongo instance (jest isolates modules
// per test file, so mongoose's model registry never collides across files).

const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongod;

async function setupTestDB() {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
}

async function teardownTestDB() {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (mongod) await mongod.stop();
}

async function clearTestDB() {
  const { collections } = mongoose.connection;
  await Promise.all(Object.values(collections).map((c) => c.deleteMany({})));
}

module.exports = { setupTestDB, teardownTestDB, clearTestDB };
