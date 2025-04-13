const express = require("express");
const router = express.Router();
const {
  addEnquiry,
  getAllEnquiries,
  editEnquiry,
  getUserMobile,
  getAllEnquiriesByHid,
} = require("../controllers/enquiryController");

router.post("/addEnquiry", addEnquiry);
router.get("/getAllEnquiries", getAllEnquiries);
router.put("/updateEnquiry/:id", editEnquiry);
router.get("/getUserMobile/:id", getUserMobile);
router.get("/getAllEnquiries/:hid", getAllEnquiriesByHid); // Assuming you want to get a specific enquiry by ID

module.exports = router;
