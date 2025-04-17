const db = require("../config/db");

const findSchemeBySubDist = async (subDist) => {
  try {
    const schemes = await db.query(
      `SELECT * FROM applied_schemes WHERE sub_Dist = $1`,
      [subDist]
    );
    return schemes.rows;
  } catch (error) {
    console.error("Error in findSchemeBySubDist:", error);
    throw error;
  }
};

const updateSchemeStatusById = async (apscid, status) => {
  try {
    const result = await db.query(
      `UPDATE applied_schemes SET status = $1 WHERE apscid = $2`,
      [status, apscid]
    );
    return result;
  } catch (error) {
    console.error("Error in updateSchemeStatusById:", error);
    throw error;
  }
};

module.exports = {
  findSchemeBySubDist,
  updateSchemeStatusById,
};
