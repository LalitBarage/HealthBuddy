require("dotenv").config();
const axios = require("axios");
const { createEnquiry, getEnquiries } = require("../models/enquiryModel");

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

module.exports = {
  addEnquiry,
  getAllEnquiries,
};
