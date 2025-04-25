require("dotenv").config();
const axios = require("axios");
const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);

const otpStore = new Map();

const {
  createEnquiry,
  getEnquiries,
  updateEnquiry,
  getUserMobileNo,
  getEnquiryByHid,
  deleteEnquiryByEid,
  getEnquiryByPid,
} = require("../models/enquiryModel");

const addEnquiry = async (req, res) => {
  const { pid, hid, diseases, pincode } = req.body;

  if (!pid || !hid || !diseases || !pincode) {
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
    const enquiry = await createEnquiry({
      pid,
      hid,
      diseases,
      pincode,
      sub_dist,
      dist,
      state,
    });
    return res
      .status(201)
      .json(enquiry, { message: "Enquiry created successfully" });
  } catch (error) {
    console.error("Error creating enquiry:", error.message);
    return res.status(500).json({ error: "Failed to create enquiry" });
  }
};

const getAllEnquiries = async (req, res) => {
  try {
    const result = await getEnquiries();

    if (result.length === 0) {
      return res.status(404).json({ message: "No enquiries found" });
    }

    return res
      .status(200)
      .json(result, { message: "Enquiries fetched successfully" });
  } catch (error) {
    console.error("Error fetching enquiries:", error.message);
    return res.status(500).json({ error: "Failed to fetch enquiries" });
  }
};

const getAllEnquiriesByHid = async (req, res) => {
  const { hid } = req.params;

  try {
    const result = await getEnquiryByHid(hid);

    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "No enquiries found for this hid" });
    }

    return res
      .status(200)
      .json(result, { message: "Enquiries fetched successfully" });
  } catch (error) {
    console.error("Error fetching enquiries:", error.message);
    return res.status(500).json({ error: "Failed to fetch enquiries" });
  }
};

const editEnquiry = async (req, res) => {
  const { eid } = req.params;
  const { pid, hid, diseases, pincode } = req.body;

  if (!pid || !hid || !diseases || !pincode) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const updatedEnquiry = await updateEnquiry(eid, {
      pid,
      hid,
      diseases,
      pincode,
    });

    if (!updatedEnquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    return res
      .status(200)
      .json(updatedEnquiry, { message: "Enquiry updated successfully" });
  } catch (error) {
    console.error("Error updating enquiry:", error.message);
    return res.status(500).json({ error: "Failed to update enquiry" });
  }
};

const getUserMobile = async (req, res) => {
  const { pid } = req.params;

  try {
    const result = await getUserMobileNo(pid);

    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(result, { message: "User mobile fetched" });
  } catch (error) {
    console.error("Error fetching user mobile:", error.message);
    return res.status(500).json({ error: "Failed to fetch user mobile" });
  }
};
const deleteEnquiry = async (req, res) => {
  const { eid } = req.params;

  try {
    const result = await deleteEnquiryByEid(eid);

    if (!result) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    return res.status(200).json({ message: "Enquiry deleted successfully" });
  } catch (error) {
    console.error("Error deleting enquiry:", error.message);
    return res.status(500).json({ error: "Failed to delete enquiry" });
  }
};

const getAllEnquiriesByPid = async (req, res) => {
  const { pid } = req.params;

  try {
    const result = await getEnquiryByPid(pid);

    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "No enquiries found for this pid" });
    }

    return res
      .status(200)
      .json(result, { message: "Enquiries fetched successfully" });
  } catch (error) {
    console.error("Error fetching enquiries:", error.message);
    return res.status(500).json({ error: "Failed to fetch enquiries" });
  }
};

const getOtp = async (req, res) => {
  const { pid } = req.params;

  try {
    const result = await getUserMobileNo(pid);

    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }

    const OTP = Math.floor(100000 + Math.random() * 900000);
    const smsText = `Your OTP is ${OTP}. Please do not share it with anyone.`;

    await client.messages.create({
      body: smsText,
      from: twilioPhone,
      to: `+91${result}`,
    });

    const expiresAt = Date.now() + 5 * 60 * 1000;
    otpStore.set(pid, { otp: OTP.toString(), expiresAt });

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error.message);
    return res.status(500).json({ error: "Failed to send OTP" });
  }
};

const verifyOtp = (req, res) => {
  const { pid, otp } = req.params;

  const stored = otpStore.get(pid);

  if (!stored) {
    return res.status(400).json({ message: "No OTP found or OTP expired" });
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(pid); // Expired OTP
    return res.status(400).json({ message: "OTP expired" });
  }

  if (stored.otp === otp) {
    otpStore.delete(pid); // Remove used OTP
    return res.status(200).json({ message: "OTP verified successfully" });
  } else {
    return res.status(400).json({ message: "Incorrect OTP" });
  }
};

module.exports = {
  addEnquiry,
  getAllEnquiries,
  editEnquiry,
  getUserMobile,
  getAllEnquiriesByHid,
  deleteEnquiry,
  getAllEnquiriesByPid,
  getOtp,
  verifyOtp,
};
