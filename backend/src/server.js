require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Import routes
const centralBankRoutes = require("./api/economy/centralBank");

const app = express();

// Allow your Next.js dev ports
app.use(cors({ origin: ["http://localhost:3000", "http://localhost:3001"] }));
app.use(express.json());

// ✅ Friendly root route (health check)
app.get("/", (req, res) => {
  res.send("OK ✅ Backend is running. Try /api/economy/central-bank");
});

// 🔌 Mount API routes
app.use("/api/economy", centralBankRoutes);

// 🔢 Port
const PORT = Number(process.env.PORT || 4000);

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
