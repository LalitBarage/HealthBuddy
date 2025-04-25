require("dotenv").config();
const axios = require("axios");
const {
  findSchemeBySubDist,
  updateSchemeStatusById,
  findHospitalBySubDist,
  updateHospitalStatusById,
  addAlertToDatabase,
  findDiseaseCountBySubDist,
  addNewScheme,
  deleteAlertById,
  hideById,
  deleteSchemeById,
} = require("../models/adminModel");

const getSchemeBySubDist = async (req, res) => {
  const { subDist } = req.params;
  try {
    if (!subDist) {
      return res.status(400).json({ message: "Sub-district ID is required" });
    }

    const schemes = await findSchemeBySubDist(subDist);
    if (!schemes) {
      return res.status(404).json({ message: "Sub-district not found" });
    }
    return res.status(200).json({ schemes });
  } catch (error) {
    console.error("Error fetching sub-district:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateSchemeStatus = async (req, res) => {
  const { apscid } = req.params;
  const { status } = req.body;

  try {
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const result = await updateSchemeStatusById(apscid, status);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Scheme not found" });
    }

    return res
      .status(200)
      .json({ message: "Scheme status updated successfully" });
  } catch (error) {
    console.error("Error updating scheme status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getHopitalBySubDist = async (req, res) => {
  const { subDist } = req.params;
  try {
    if (!subDist) {
      return res.status(400).json({ message: "Sub-district ID is required" });
    }

    const hospitals = await findHospitalBySubDist(subDist);
    if (!hospitals) {
      return res.status(404).json({ message: "Sub-district not found" });
    }
    return res.status(200).json({ hospitals });
  } catch (error) {
    console.error("Error fetching sub-district:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateHospitalStatus = async (req, res) => {
  const { hid } = req.params;
  const { status } = req.body;

  try {
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const result = await updateHospitalStatusById(hid, status);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    return res
      .status(200)
      .json({ message: "Hospital status updated successfully" });
  } catch (error) {
    console.error("Error updating hospital status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const addAlert = async (req, res) => {
  const { message, severity, location } = req.body;

  try {
    if (!message || !severity || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const result = await addAlertToDatabase(message, severity, location);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Failed to add alert" });
    }

    return res.status(200).json({ message: "Alert added successfully" });
  } catch (error) {
    console.error("Error adding alert:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteAlert = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await deleteAlertById(id);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Alert not found" });
    }

    return res.status(200).json({ message: "Alert deleted successfully" });
  } catch (error) {
    console.error("Error deleting alert:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getDiseaseCount = async (req, res) => {
  const { sub_dist } = req.params;
  try {
    if (!sub_dist) {
      return res.status(400).json({ message: "Sub-district ID is required" });
    }

    const diseaseCount = await findDiseaseCountBySubDist(sub_dist);
    if (!diseaseCount) {
      return res.status(404).json({ message: "Sub-district not found" });
    }
    return res.status(200).json({ diseaseCount });
  } catch (error) {
    console.error("Error fetching disease count:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const addScheme = async (req, res) => {
  const { scname, elligibility, description, pincode } = req.body;

  if (!scname || !pincode || !elligibility || !description) {
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
    const scheme = await addNewScheme({
      scname,
      elligibility,
      description,
      sub_dist,
      dist,
      state,
    });

    if (!scheme) {
      return res.status(404).json({ message: "Failed to add scheme" });
    }

    return res.status(200).json({ message: "Scheme added successfully" });
  } catch (error) {
    console.error("Error adding scheme:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const hideScheme = async (req, res) => {
  const { scid } = req.params;
  const { status } = req.body;

  try {
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const result = await hideById(scid, status);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Scheme not found" });
    }

    return res
      .status(200)
      .json({ message: "Scheme status updated successfully" });
  } catch (error) {
    console.error("Error updating scheme status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteScheme = async (req, res) => {
  const { scid } = req.params;

  try {
    const result = await deleteSchemeById(scid);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Scheme not found" });
    }

    return res.status(200).json({ message: "Scheme deleted successfully" });
  } catch (error) {
    console.error("Error deleting scheme:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getSchemeBySubDist,
  updateSchemeStatus,
  getHopitalBySubDist,
  updateHospitalStatus,
  addAlert,
  getDiseaseCount,
  deleteAlert,
  addScheme,
  hideScheme,
  deleteScheme,
};
