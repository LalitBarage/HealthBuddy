const db = require("../config/db");

const findSchemeBySubDist = async (subDist) => {
  try {
    const schemes = await db.query(
      `SELECT * FROM schemes WHERE sub_Dist = $1`,
      [subDist]
    );
    return schemes.rows;
  } catch (error) {
    console.error("Error in findSchemeBySubDist:", error);
    throw error;
  }
};

module.exports = {
  findSchemeBySubDist,
};
