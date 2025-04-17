const db = require("../config/db");

const createCampaign = async (
  name,
  description,
  image_url,
  startDate,
  endDate,
  link
) => {
  try {
    const result = await db.query(
      "INSERT INTO campaigns (title, description, image_url, start_date, end_date, link) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [name, description, image_url, startDate, endDate, link]
    );

    return result.rows[0];
  } catch (err) {
    throw new Error(err.message);
  }
};

const getCampaigns = async () => {
  try {
    const result = await db.query("SELECT * FROM campaigns");
    return result.rows;
  } catch (err) {
    throw new Error("Error fetching campaigns: " + err.message);
  }
};

const deleteCampaignById = async (id) => {
  try {
    const result = await db.query("DELETE FROM campaigns WHERE id = $1", [id]);

    return result;
  } catch (err) {
    throw new Error("Error deleting campaign: " + err.message);
  }
};

module.exports = { createCampaign, getCampaigns, deleteCampaignById };
