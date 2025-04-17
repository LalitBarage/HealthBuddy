const {
  findSchemeBySubDist,
  updateSchemeStatusById,
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
module.exports = {
  getSchemeBySubDist,
  updateSchemeStatus,
};
