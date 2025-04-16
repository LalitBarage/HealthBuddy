const express = require("express");
const { addCampaign } = require("../models/alertModel");
const router = express.Router();

router.get("/addCampaign", addCampaign);

module.exports = router;
