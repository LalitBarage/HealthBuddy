require("dotenv").config();
const cors = require("cors");
const express = require("express");
const authRoutes = require("./src/routes/authRoutes");
const enquiryRoutes = require("./src/routes/enquiryRoutes");
const schemeRoutes = require("./src/routes/schemeRouter");
const alertRoutes = require("./src/routes/alertRouter");
const cookieParser = require("cookie-parser");
const verifyToken = require("./src/middlewares/authMiddleware");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5174",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/enquiry", verifyToken, enquiryRoutes);
app.use("/api/scheme", verifyToken, schemeRoutes);
app.use("/api/alert", verifyToken, alertRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
