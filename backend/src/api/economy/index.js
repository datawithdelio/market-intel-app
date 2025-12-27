const express = require("express");
const router = express.Router();

// Central Bank routes
router.use("/central-bank", require("./centralBank"));
// Central Bank Timeline routes
router.use("/central-bank/timeline", require("./centralBankTimeline"));
// Regime routes
router.use("/regime", require("./regime"));
// Regime History routes
router.use("/regime/history", require("./regimeHistory"));
// News routes
router.use("/news", require("./news"));
// Calendar routes
router.use("/calendar", require("./calendar"));


module.exports = router;
