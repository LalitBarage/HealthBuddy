const express = require("express");
const { getSchemeBySubDist } = require("../controllers/adminController");
const router = express.Router();

router.get("/getSchemeBySubDist/:subDist", getSchemeBySubDist);

module.exports = router;
