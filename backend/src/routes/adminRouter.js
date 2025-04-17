const express = require("express");
const {
  getSchemeBySubDist,
  updateSchemeStatus,
} = require("../controllers/adminController");
const router = express.Router();

router.get("/getSchemeBySubDist/:subDist", getSchemeBySubDist);
router.put("/updateSchemeStatus/:apscid", updateSchemeStatus);

module.exports = router;
