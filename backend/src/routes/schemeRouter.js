const express = require("express");
const {
  appliedScheme,
  getAppliedScheme,
} = require("../controllers/schemeController");
const router = express.Router();

router.post("/applyScheme", appliedScheme);
router.get("/getAppliedScheme", getAppliedScheme);

module.exports = router;
