require("dotenv").config();
const cors = require("cors");
const express = require("express");
const authRoutes = require("./src/routes/authRoutes");
const enquiryRoutes = require("./src/routes/enquiryRoutes");
const schemeRoutes = require("./src/routes/schemeRouter");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/enquiry", enquiryRoutes);
app.use("/api/scheme", schemeRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
