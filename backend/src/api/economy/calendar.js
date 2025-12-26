const express = require("express");
const router = express.Router();

const { getCalendar } = require("../../controllers/economy/calendar.controller");

// GET /api/economy/calendar?economy=US&days=7
router.get("/", getCalendar);

module.exports = router;
