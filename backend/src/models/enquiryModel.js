const db = require("../config/db");

const createEnquiry = async ({
  pid,
  hid,
  diseases,
  pincode,
  sub_dist,
  dist,
  state,
}) => {
  const result = await db.query(
    "INSERT INTO enquiry (pid, hid, diseases, pincode, sub_dist, dist, state) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
    [pid, hid, diseases, pincode, sub_dist, dist, state]
  );
  return result.rows[0];
};

const getEnquiries = async () => {
  const result = await db.query("SELECT * FROM enquiry");
  return result.rows;
};

const getEnquiryByHid = async (hid) => {
  const result = await db.query("SELECT * FROM enquiry WHERE hid = $1", [hid]);
  return result.rows;
};

const updateEnquiry = async (eid, { pid, hid, diseases, pincode }) => {
  const result = await db.query(
    "UPDATE enquiry SET pid = $1, hid = $2, diseases = $3, pincode = $4 WHERE eid = $5 RETURNING *",
    [pid, hid, diseases, pincode, eid]
  );
  return result.rows[0];
};

const getUserMobileNo = async (pid) => {
  const result = await db.query(
    "SELECT pmobileno FROM patient WHERE pid = $1",
    [pid]
  );
  return result.rows[0].pmobileno;
};

const deleteEnquiryByEid = async (eid) => {
  const result = await db.query("DELETE FROM enquiry WHERE eid = $1", [eid]);
  return result.rowCount > 0;
};

module.exports = {
  createEnquiry,
  getEnquiries,
  updateEnquiry,
  getUserMobileNo,
  getEnquiryByHid,
  deleteEnquiryByEid,
};
