const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  registerHospital,
  loginHospital,
  userProfile,
  changePassword,
  loginSubDistAdmin,
} = require("../controllers/authController");
const verifyToken = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/registerUser", registerUser);
router.post("/loginUser", loginUser);
router.get("/userProfile/:paddhar", verifyToken, userProfile);
router.post("/logout", verifyToken, logoutUser);
router.put("/changePassword/:paddhar", verifyToken, changePassword);

router.post("/registerHospital", registerHospital);
router.post("/loginHospital", loginHospital);

router.post("/loginSubDistAdmin", loginSubDistAdmin);

module.exports = router;
