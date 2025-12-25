const express = require("express");
const router = express.Router();

// Central Bank routes
router.use("/economy", require("../api/economy"));
// Regime routes
router.use("/economy", require("../api/economy/regime"));

module.exports = router;
