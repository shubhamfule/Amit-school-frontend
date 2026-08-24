const app = require("./app");
const connectDB = require("./config/db");
const { port } = require("./config/env");

async function start() {
  await connectDB();
  app.listen(port, () => {
    console.log(`Amit School backend listening on port ${port}`); // eslint-disable-line no-console
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err); // eslint-disable-line no-console
  process.exit(1);
});
