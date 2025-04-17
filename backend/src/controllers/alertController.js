const {
  createCampaign,
  getCampaigns,
  deleteCampaignById,
} = require("../models/alertModel");

const addCampaign = async (req, res) => {
  const { name, description, image_url, startDate, endDate, link } = req.body;

  try {
    if (
      !name ||
      !description ||
      !image_url ||
      !startDate ||
      !endDate ||
      !link
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const campaign = await createCampaign(
      name,
      description,
      image_url,
      startDate,
      endDate,
      link
    );

    res.status(201).json({ campaign });
  } catch (err) {
    res.status(500).json({ error: "Server error", err: err.message });
  }
};

const getCampaignsController = async (req, res) => {
  try {
    const campaigns = await getCampaigns();

    if (campaigns.length === 0) {
      return res.status(404).json({ error: "No campaigns found" });
    }

    res.status(200).json({ campaigns });
  } catch (err) {
    res.status(500).json({ error: "Server error", err: err.message });
  }
};

const deleteCampaign = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await deleteCampaignById(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    res.status(200).json({ message: "Campaign deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error", err: err.message });
  }
};

module.exports = { addCampaign, getCampaignsController, deleteCampaign };
