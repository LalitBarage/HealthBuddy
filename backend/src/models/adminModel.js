const db = require("../config/db");

const findSchemeBySubDist = async (subDist) => {
  try {
    const schemes = await db.query(
      `SELECT * FROM applied_schemes WHERE sub_dist = $1`,
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

const findHospitalBySubDist = async (subDist) => {
  try {
    const hospitals = await db.query(
      `SELECT * FROM hospital_admin WHERE sub_dist = $1`,
      [subDist]
    );
    return hospitals.rows;
  } catch (error) {
    console.error("Error in findHospitalBySubDist:", error);
    throw error;
  }
};

const updateHospitalStatusById = async (hid, status) => {
  try {
    const result = await db.query(
      `UPDATE hospital_admin SET status = $1 WHERE hid = $2`,
      [status, hid]
    );
    return result;
  } catch (error) {
    console.error("Error in updateHospitalStatusById:", error);
    throw error;
  }
};

const addAlertToDatabase = async (message, severity, location) => {
  try {
    const result = await db.query(
      `INSERT INTO alerts (message, severity, location) VALUES ($1, $2, $3)`,
      [message, severity, location]
    );
    return result;
  } catch (error) {
    console.error("Error in addAlertToDatabase:", error);
    throw error;
  }
};

const deleteAlertById = async (id) => {
  try {
    const result = await db.query(`DELETE FROM alerts WHERE id = $1`, [id]);
    return result;
  } catch (error) {
    console.error("Error in deleteAlertById:", error);
    throw error;
  }
};

const findDiseaseCountBySubDist = async (sub_dist) => {
  try {
    const result = await db.query(`SELECT * FROM enquiry WHERE sub_dist = $1`, [
      sub_dist,
    ]);
    return result.rows;
  } catch (error) {
    console.error("Error in findDiseaseCountBySubDist:", error);
    throw error;
  }
};

const addNewScheme = async (
  scname,
  eligibility,
  description,
  sub_dist,
  dist,
  state
) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    // Step 1: Insert new scheme
    await client.query(
      `INSERT INTO schemes (scname, eligibility, description, sub_dist, dist, state) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [scname, eligibility, description, sub_dist, dist, state]
    );

    // Step 2: Fetch mobile numbers from patients in the same sub_dist
    const result = await client.query(
      `SELECT pmobileno FROM patient WHERE sub_dist = $1`,
      [sub_dist]
    );

    await client.query("COMMIT");
    return result.rows; // array of mobile numbers
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error in addNewScheme:", error);
    throw error;
  } finally {
    client.release();
  }
};

const hideById = async (scid, status) => {
  try {
    const result = await db.query(
      `UPDATE schemes SET status = $1 WHERE scid = $2`,
      [status, scid]
    );
    return result;
  } catch (error) {
    console.error("Error in hideById:", error);
    throw error;
  }
};

const deleteSchemeById = async (scid) => {
  try {
    const result = await db.query(`DELETE FROM schemes WHERE scid = $1`, [
      scid,
    ]);
    return result;
  } catch (error) {
    console.error("Error in deleteSchemeById:", error);
    throw error;
  }
};

module.exports = {
  findSchemeBySubDist,
  updateSchemeStatusById,
  findHospitalBySubDist,
  updateHospitalStatusById,
  addAlertToDatabase,
  findDiseaseCountBySubDist,
  deleteAlertById,
  addNewScheme,
  hideById,
  deleteSchemeById,
};
