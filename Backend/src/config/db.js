const mongoose = require("mongoose");
const { mongoUri } = require("./env");

async function connectDB(uri = mongoUri) {
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  return mongoose.connection;
}

module.exports = connectDB;
