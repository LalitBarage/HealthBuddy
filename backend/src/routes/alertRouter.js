const express = require("express");
const {
  addCampaign,
  getCampaignsController,
  deleteCampaign,
  getAlerts,
  getAlertNotification,
  getBanner,
} = require("../controllers/alertController");
const router = express.Router();

router.post("/addCampaign/:subdist", addCampaign);
router.get("/getCampaigns/:subdist", getCampaignsController);
router.delete("/deleteCampaign/:id", deleteCampaign);
router.get("/getAlerts/:location", getAlerts);
router.get("/getAlertNotification/:location", getAlertNotification);
router.get("/getBanner/:location", getBanner);

module.exports = router;
