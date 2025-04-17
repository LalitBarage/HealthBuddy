const express = require("express");
const {
  getSchemeBySubDist,
  updateSchemeStatus,
  getHopitalBySubDist,
  updateHospitalStatus,
  addAlert,
} = require("../controllers/adminController");
const router = express.Router();

router.get("/getSchemeBySubDist/:subDist", getSchemeBySubDist);
router.put("/updateSchemeStatus/:apscid", updateSchemeStatus);

router.get("/getHospitalRequests/:subDist", getHopitalBySubDist);
router.put("/updateHospitalStatus/:hid", updateHospitalStatus);

router.get("/addAlert", addAlert);

module.exports = router;
