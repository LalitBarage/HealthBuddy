const express = require("express");
const {
  addCampaign,
  getCampaignsController,
  deleteCampaign,
  getAlerts,
  getAlertNotification,
} = require("../controllers/alertController");
const router = express.Router();

router.post("/addCampaign/:subdist", addCampaign);
router.get("/getCampaigns/:subdist", getCampaignsController);
router.delete("/deleteCampaign/:id", deleteCampaign);
router.get("/getAlerts/:location", getAlerts);
router.get("/getAlertNotification/:location", getAlertNotification);

module.exports = router;
