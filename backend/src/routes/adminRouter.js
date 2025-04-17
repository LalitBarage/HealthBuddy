const express = require("express");
const {
  getSchemeBySubDist,
  updateSchemeStatus,
  getHopitalBySubDist,
  updateHospitalStatus,
  addAlert,
  getDiseaseCount,
} = require("../controllers/adminController");
const router = express.Router();

router.get("/getSchemeBySubDist/:subDist", getSchemeBySubDist);
router.put("/updateSchemeStatus/:apscid", updateSchemeStatus);

router.get("/getHospitalRequests/:subDist", getHopitalBySubDist);
router.put("/updateHospitalStatus/:hid", updateHospitalStatus);

router.post("/addAlert", addAlert);

router.get("/diseaseCount", getDiseaseCount);

module.exports = router;
