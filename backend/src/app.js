const express = require("express");
const cors = require("cors");

const app = express();

const origins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(cors({ origin: origins.length ? origins : true }));
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api", require("./routes"));

module.exports = app;
