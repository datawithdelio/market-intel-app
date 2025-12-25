const express = require("express");
const router = express.Router();

router.use("/", require("../../api/economy/centralBank")); // ✅ exposes /central-bank

module.exports = router;
