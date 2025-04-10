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

module.exports = {
  createEnquiry,
};
