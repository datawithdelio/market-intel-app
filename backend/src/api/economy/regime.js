const express = require("express");
const router = express.Router();

const { getRegime } = require("../../controllers/economy/regime.controller");

// GET /api/economy/regime
router.get("/", getRegime);

module.exports = router;
