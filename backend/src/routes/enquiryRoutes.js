const express = require("express");
const router = express.Router();
const {
  addEnquiry,
  getAllEnquiries,
  editEnquiry,
  getUserMobile,
  getAllEnquiriesByHid,
  deleteEnquiry,
  getAllEnquiriesByPid,
} = require("../controllers/enquiryController");

router.post("/addEnquiry", addEnquiry);
router.get("/getAllEnquiries", getAllEnquiries);
router.put("/updateEnquiry/:eid", editEnquiry);
router.get("/getUserMobile/:pid", getUserMobile);
router.get("/getAllEnquiries/:hid", getAllEnquiriesByHid);
router.delete("/deleteEnquiry/:eid", deleteEnquiry);
router.get("/getEnquiryByPid/:pid", getAllEnquiriesByPid);

module.exports = router;
