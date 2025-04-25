const express = require("express");
const {
  getSchemeBySubDist,
  updateSchemeStatus,
  getHopitalBySubDist,
  updateHospitalStatus,
  addAlert,
  getDiseaseCount,
  deleteAlert,
  addScheme,
} = require("../controllers/adminController");
const router = express.Router();

router.get("/getSchemeBySubDist/:subDist", getSchemeBySubDist);
router.put("/updateSchemeStatus/:apscid", updateSchemeStatus);

router.get("/getHospitalRequests/:subDist", getHopitalBySubDist);
router.put("/updateHospitalStatus/:hid", updateHospitalStatus);

router.post("/addAlert", addAlert);
router.delete("/deleteAlert/:id", deleteAlert);
router.get("/diseaseCount/:sub_dist", getDiseaseCount);

router.post("/addScheme", addScheme);

module.exports = router;
