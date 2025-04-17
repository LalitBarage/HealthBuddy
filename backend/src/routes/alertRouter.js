const express = require("express");
const {
  addCampaign,
  getCampaignsController,
  deleteCampaign,
  getAlerts,
} = require("../controllers/alertController");
const router = express.Router();

router.post("/addCampaign", addCampaign);
router.get("/getCampaigns", getCampaignsController);
router.delete("/deleteCampaign/:id", deleteCampaign);
router.get("/getAlerts/:location", getAlerts);

module.exports = router;
