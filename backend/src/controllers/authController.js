require("dotenv").config();
const axios = require("axios");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  createUser,
  createHospital,
  getHospitalByEmail,
  getUserByPaddhar,
} = require("../models/userModel");

const registerUser = async (req, res) => {
  const { pFirstName, pLastName, addhar, dob, mobileno, gender, pincode } =
    req.body;

  if (
    !pFirstName ||
    !pLastName ||
    !addhar ||
    !dob ||
    !mobileno ||
    !gender ||
    !pincode
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  let sub_dist, dist, state;

  try {
    const postOfficeURL = `${process.env.PINCODE_API}/${pincode}`;
    const response = await axios.get(postOfficeURL);
    const postOffices = response.data[0]?.PostOffice;

    if (!postOffices || postOffices.length === 0) {
      return res.status(404).json({ error: "Invalid or unsupported pincode" });
    }

    const locationInfo = postOffices[0];
    sub_dist = locationInfo.Block;
    dist = locationInfo.District;
    state = locationInfo.State;
  } catch (error) {
    console.error("Pincode API Error:", error.message);
    return res
      .status(500)
      .json({ error: "Failed to fetch location from pincode" });
  }

  try {
    const existing = await getUserByPaddhar(addhar);
    if (existing) return res.status(400).json({ error: "User already exists" });

    const patient = await createUser({
      pFirstName,
      pLastName,
      addhar,
      dob,
      mobileno,
      gender,
      pincode,
      sub_dist,
      dist,
      state,
    });

    res.status(201).json({ patient });
  } catch (err) {
    res.status(500).json({ error: "Server error", err: err.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await getUserByEmail(email);
    if (!user)
      return res.status(400).json({ error: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ error: "Invalid email or password" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const registerHospital = async (req, res) => {
  const { email, password, hospitalName, pincode, mobileNo, documentUrl } =
    req.body;

  if (
    !email ||
    !password ||
    !hospitalName ||
    !pincode ||
    !mobileNo ||
    !documentUrl
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  let sub_dist, dist, state;

  try {
    const postOfficeURL = `${process.env.PINCODE_API}/${pincode}`;
    const response = await axios.get(postOfficeURL);
    const postOffices = response.data[0]?.PostOffice;

    if (!postOffices || postOffices.length === 0) {
      return res.status(404).json({ error: "Invalid or unsupported pincode" });
    }

    const locationInfo = postOffices[0];
    sub_dist = locationInfo.Block;
    dist = locationInfo.District;
    state = locationInfo.State;
  } catch (error) {
    console.error("Pincode API Error:", error.message);
    return res
      .status(500)
      .json({ error: "Failed to fetch location from pincode" });
  }

  try {
    const existing = await getHospitalByEmail(email);
    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const hospital = await createHospital({
      hospitalName,
      email,
      password: hashed,
      pincode,
      mobileNo,
      sub_dist,
      dist,
      state,
      documentUrl,
    });

    return res.status(201).json({ hospital });
  } catch (error) {
    console.error("Error registering hospital:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const loginHospital = async (req, res) => {
  const { email, password } = req.body;

  try {
    const hospital = await getHospitalByEmail(email);
    if (!hospital)
      return res.status(400).json({ error: "Invalid email or password" });

    if (!hospital.status)
      return res.status(400).json({ error: "Hospital not approved yet" });

    const match = await bcrypt.compare(password, hospital.password);
    if (!match)
      return res.status(400).json({ error: "Invalid email or password" });

    const token = jwt.sign({ id: hospital.hid }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ hospital, token, message: "Login successful" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const logoutUser = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
  });

  res.status(200).json({ message: "Logout successful" });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  registerHospital,
  loginHospital,
};
