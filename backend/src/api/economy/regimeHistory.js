const express = require("express");
const router = express.Router();

const { getRegimeHistory } = require("../../controllers/economy/regimeHistory.controller");

// GET /api/economy/regime/history?economy=US&months=24
router.get("/history", getRegimeHistory);

module.exports = router;
