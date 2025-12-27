const express = require("express");
const router = express.Router();

const { getCentralBankTimeline } = require("../../controllers/economy/centralBankTimeline.controller");

// GET /api/economy/central-bank/timeline?economy=US&days=90
router.get("/timeline", getCentralBankTimeline);

module.exports = router;
