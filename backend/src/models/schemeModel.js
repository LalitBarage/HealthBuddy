const db = require("../config/db");

const addApplyScheme = async ({
  scid,
  pid,
  hid,
  income_cert_url,
  caste_cert_url,
  ele_bill_url,
  bank_passbook_url,
  pincode,
  sub_dist,
  dist,
  state,
}) => {
  const result = await db.query(
    "INSERT INTO applied_schemes (scid, pid, hid, income_cert_url, caste_cert_url, ele_bill_url, bank_passbook_url, pincode, sub_dist, dist, state) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING apscid, scid, pid, hid, income_cert_url, caste_cert_url, ele_bill_url, bank_passbook_url, pincode, sub_dist, dist, state",
    [
      scid,
      pid,
      hid,
      income_cert_url,
      caste_cert_url,
      ele_bill_url,
      bank_passbook_url,
      pincode,
      sub_dist,
      dist,
      state,
    ]
  );
  return result.rows[0];
};

const getAppliedSchemeByPid = async (pid) => {
  const result = await db.query(
    "SELECT * FROM applied_schemes WHERE pid = $1",
    [pid]
  );
  return result.rows;
};

module.exports = {
  addApplyScheme,
  getAppliedSchemeByPid,
};
