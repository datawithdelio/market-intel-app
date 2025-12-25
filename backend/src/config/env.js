require("dotenv").config();

const PORT = Number(process.env.PORT || 8000);

const CORS_ORIGINS = (process.env.CORS_ORIGINS || "http://localhost:3000,http://localhost:3001")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const FRED_API_KEY = process.env.FRED_API_KEY || "";

module.exports = {
  PORT,
  CORS_ORIGINS,
  FRED_API_KEY,
};
