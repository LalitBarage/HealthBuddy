const express = require("express");
const {
  appliedScheme,
  getAppliedScheme,
  updateAppliedScheme,
  deleteAppliedScheme,
  getAppliedSchemeHospital,
} = require("../controllers/schemeController");
const router = express.Router();

router.post("/applyScheme", appliedScheme);
router.put("/updateAppliedScheme/:apscid", updateAppliedScheme);
router.get("/getAppliedSchemePid/:pid", getAppliedScheme);
router.delete("/deleteAppliedScheme/:apscid", deleteAppliedScheme);
router.get("/getAppliedSchemeByHid/:hid", getAppliedSchemeHospital);

module.exports = router;
