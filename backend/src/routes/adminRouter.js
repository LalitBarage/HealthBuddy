const express = require("express");
const {
  getSchemeBySubDist,
  updateSchemeStatus,
  getHopitalBySubDist,
  updateHospitalStatus,
} = require("../controllers/adminController");
const router = express.Router();

router.get("/getSchemeBySubDist/:subDist", getSchemeBySubDist);
router.put("/updateSchemeStatus/:apscid", updateSchemeStatus);

router.get("/getHospitalRequests", getHopitalBySubDist);
router.put("/updateHospitalStatus/:hid", updateHospitalStatus);

module.exports = router;
