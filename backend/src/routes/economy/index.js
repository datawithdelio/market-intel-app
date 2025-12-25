const router = require("express").Router();
const { getIndicators } = require("../../controllers/economy.controller");

// GET /api/economy/indicators
router.get("/indicators", getIndicators);

module.exports = router;
