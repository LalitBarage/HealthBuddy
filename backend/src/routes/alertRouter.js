const express = require("express");
const {
  addCampaign,
  getCampaignsController,
} = require("../controllers/alertController");
const router = express.Router();

router.post("/addCampaign", addCampaign);
router.get("/getCampaigns", getCampaignsController);

module.exports = router;
