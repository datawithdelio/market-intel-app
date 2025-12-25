const express = require("express");
const router = express.Router();

router.use("/central-bank", require("./centralBank"));
router.use("/regime", require("./regime"));

module.exports = router;
