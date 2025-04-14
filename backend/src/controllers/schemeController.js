require("dotenv").config();
const axios = require("axios");
const {
  addApplyScheme,
  getAppliedSchemeByPid,
  getAppliedSchemeByApscid,
  updateAppliedSchemeDoc,
  deleteAppliedSchemeId,
} = require("../models/schemeModel");

const appliedScheme = async (req, res) => {
  const {
    scid,
    pid,
    hid,
    income_cert_url,
    caste_cert_url,
    ele_bill_url,
    bank_passbook_url,
    pincode,
  } = req.body;

  if (
    !scid ||
    !pid ||
    !hid ||
    !income_cert_url ||
    !caste_cert_url ||
    !ele_bill_url ||
    !bank_passbook_url ||
    !pincode
  ) {
    return res.status(400).json({ message: "All fields are required" });
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
    const scheme = await addApplyScheme({
      scid,
      pid,
      hid,
      income_cert_url,
      caste_cert_url,
      ele_bill_url,
      bank_passbook_url,
      pincode,
      sub_dist,
      dist,
      state,
    });
    return res.status(201).json(scheme, {
      message: "Scheme applied successfully",
    });
  } catch (error) {
    console.error("Error applying scheme:", error.message);
    return res.status(500).json({ error: "Failed to apply scheme" });
  }
};

const getAppliedScheme = async (req, res) => {
  const { pid } = req.body;

  if (!pid) {
    return res.status(400).json({ message: "PID is required" });
  }

  try {
    const schemes = await getAppliedSchemeByPid(pid);
    if (schemes.length === 0) {
      return res.status(404).json({ message: "No schemes found for this PID" });
    }
    return res.status(200).json(schemes);
  } catch (error) {
    console.error("Error fetching applied schemes:", error.message);
    return res.status(500).json({ error: "Failed to fetch applied schemes" });
  }
};

const updateAppliedScheme = async (req, res) => {
  const { apscid } = req.params;
  const { income_cert_url, caste_cert_url, ele_bill_url, bank_passbook_url } =
    req.body;

  if (!apscid) {
    return res.status(400).json({ message: "APSCID is required" });
  }

  try {
    const checkScheme = await getAppliedSchemeByApscid(apscid);
    if (!checkScheme) {
      return res.status(404).json({ message: "Scheme not found" });
    }

    const updateScheme = await updateAppliedSchemeDoc(
      apscid,
      income_cert_url,
      caste_cert_url,
      ele_bill_url,
      bank_passbook_url
    );
    if (!updateScheme) {
      return res.status(400).json({ message: "Failed to update scheme" });
    }
    return res.status(200).json(updateScheme, {
      message: "Scheme updated successfully",
    });
  } catch (error) {
    console.error("Error updating applied scheme:", error.message);
    return res.status(500).json({ error: "Failed to update applied scheme" });
  }
};

const deleteAppliedScheme = async (req, res) => {
  const { apscid } = req.params;

  if (!apscid) {
    return res.status(400).json({ message: "APSCID is required" });
  }

  try {
    const result = await deleteAppliedSchemeId(apscid);
    if (!result) {
      return res.status(404).json({ message: "Scheme not found" });
    }
    return res.status(200).json({ message: "Scheme deleted successfully" });
  } catch (error) {
    console.error("Error deleting applied scheme:", error.message);
    return res.status(500).json({ error: "Failed to delete applied scheme" });
  }
};

module.exports = {
  appliedScheme,
  getAppliedScheme,
  updateAppliedScheme,
  deleteAppliedScheme,
};
