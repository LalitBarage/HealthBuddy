const express = require("express");
const { addCampaign } = require("../controllers/alertController");
const router = express.Router();

router.get("/addCampaign", addCampaign);

module.exports = router;
