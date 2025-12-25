const router = require("express").Router();

router.use("/economy", require("./economy"));

module.exports = router;
