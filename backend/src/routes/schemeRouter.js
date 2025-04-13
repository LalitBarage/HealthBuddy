const express = require("express");
const { appliedScheme } = require("../controllers/schemeController");
const router = express.Router();

router.post("/applyScheme", appliedScheme);

module.exports = router;
