const db = require("../config/db");

const createCampaign = async (
  name,
  description,
  image_url,
  startDate,
  endDate,
  link,
  subdist
) => {
  try {
    const result = await db.query(
      "INSERT INTO campaigns (title, description, image_url, start_date, end_date, link, sub_dist) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [name, description, image_url, startDate, endDate, link, subdist]
    );

    return result.rows[0];
  } catch (err) {
    throw new Error(err.message);
  }
};

const getCampaigns = async (subdist) => {
  try {
    const result = await db.query(
      "SELECT * FROM campaigns WHERE sub_dist = $1",
      [subdist]
    );
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

const getAlertsByLocation = async (location) => {
  try {
    const result = await db.query("SELECT * FROM alerts WHERE location = $1", [
      location,
    ]);

    return result.rows;
  } catch (err) {
    throw new Error("Error fetching alerts: " + err.message);
  }
};

const getAlertNotificationByLocation = async (location) => {
  try {
    const result = await db.query(
      "SELECT * FROM alerts WHERE location = $1 AND created_at >= NOW() - INTERVAL '7 days'",
      [location]
    );
    return result.rows;
  } catch (err) {
    throw new Error("Error fetching alerts: " + err.message);
  }
};

const getBannerByLocation = async (location) => {
  try {
    const result = await db.query(
      "SELECT image_url FROM campaigns WHERE sub_dist = $1 AND created_at >= NOW() - INTERVAL '7 days'",
      [location]
    );
    return result.rows;
  } catch (err) {
    throw new Error("Error fetching alerts: " + err.message);
  }
};

module.exports = {
  createCampaign,
  getCampaigns,
  deleteCampaignById,
  getAlertsByLocation,
  getAlertNotificationByLocation,
  getBannerByLocation,
};
