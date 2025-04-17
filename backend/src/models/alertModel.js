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

    // Return the inserted campaign data instead of responding here
    return result.rows[0]; // Assuming `rows[0]` is the newly created campaign
  } catch (err) {
    throw new Error(err.message); // Rethrow error for the controller to handle
  }
};

const getCampaigns = async () => {
  try {
    const result = await db.query("SELECT * FROM campaigns"); // Fetch all campaigns
    return result.rows; // Return the rows (campaigns) from the query
  } catch (err) {
    throw new Error("Error fetching campaigns: " + err.message); // Handle any errors
  }
};

module.exports = { createCampaign, getCampaigns };
