const { createCampaign, getCampaigns } = require("../models/alertModel");

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

    // Call the createCampaign function and get the result
    const campaign = await createCampaign(
      name,
      description,
      image_url,
      startDate,
      endDate,
      link
    );

    // Send the response
    res.status(201).json({ campaign });
  } catch (err) {
    // Handle errors here
    res.status(500).json({ error: "Server error", err: err.message });
  }
};

const getCampaignsController = async (req, res) => {
  try {
    const campaigns = await getCampaigns(); // Fetch campaigns from the model

    if (campaigns.length === 0) {
      return res.status(404).json({ error: "No campaigns found" }); // Handle if no campaigns are found
    }

    // Send the fetched campaigns back in the response
    res.status(200).json({ campaigns });
  } catch (err) {
    // Handle any errors
    res.status(500).json({ error: "Server error", err: err.message });
  }
};

module.exports = { addCampaign, getCampaignsController };
