const express = require("express");
const router = express.Router();
const {
  addEnquiry,
  getEnquiries,
} = require("../controllers/enquiryController");

router.post("/addEnquiry", addEnquiry);
router.get("/getEnquiries", getEnquiries);

module.exports = router;
