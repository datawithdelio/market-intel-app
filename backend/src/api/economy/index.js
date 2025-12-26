const express = require("express");
const router = express.Router();

// Central Bank routes
router.use("/central-bank", require("./centralBank"));
// Regime routes
router.use("/regime", require("./regime"));
// News routes
router.use("/news", require("./news"));

module.exports = router;
