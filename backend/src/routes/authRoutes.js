const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  registerHospital,
  loginHospital,
} = require("../controllers/authController");
const verifyToken = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/registerUser", registerUser);
router.post("/loginUser", loginUser);
router.post("/logout", verifyToken, logoutUser);

router.post("/registerHospital", registerHospital);
router.post("/loginHospital", loginHospital); // Assuming loginHospital is similar to loginUser

module.exports = router;
