const express = require("express");
const router = express.Router();
const {
  addEnquiry,
  getAllEnquiries,
} = require("../controllers/enquiryController");

router.post("/addEnquiry", addEnquiry);
router.get("/getAllEnquiries", getAllEnquiries);

module.exports = router;
