const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const { clientOrigin, nodeEnv } = require("./config/env");
const { notFound, errorHandler } = require("./middleware/error");
const routes = require("./routes");

const app = express();

app.use(cors({ origin: clientOrigin, credentials: true }));
app.use(express.json());
app.use(cookieParser());
if (nodeEnv === "development") app.use(morgan("dev"));

app.get("/health", (req, res) => res.json({ success: true, data: { status: "ok" } }));

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
