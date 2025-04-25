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
  getOtp,
  verifyOtp,
} = require("../controllers/enquiryController");

router.post("/addEnquiry", addEnquiry);
router.get("/getAllEnquiries", getAllEnquiries);
router.put("/updateEnquiry/:eid", editEnquiry);
router.get("/getUserMobile/:pid", getUserMobile);
router.get("/getAllEnquiries/:hid", getAllEnquiriesByHid);
router.delete("/deleteEnquiry/:eid", deleteEnquiry);
router.get("/getEnquiryByPid/:pid", getAllEnquiriesByPid);

router.get("/getOtp/:pid", getOtp);
router.get("/checkOtp/:pid/:otp", verifyOtp);

module.exports = router;
