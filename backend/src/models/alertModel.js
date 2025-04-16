const db = require("../config/db");

const addCampaign = async (
  name,
  description,
  image_url,
  startDate,
  endDate,
  link
) => {
  try {
    const campaign = await db.query(
      "INSERT INTO campaigns (name, description, image_url, startDate, endDate, link) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [name, description, image_url, startDate, endDate, link]
    );

    res.status(201).json({ campaign });
  } catch (err) {
    res.status(500).json({ error: "Server error", err: err.message });
  }
};

module.exports = {
  addCampaign,
};
