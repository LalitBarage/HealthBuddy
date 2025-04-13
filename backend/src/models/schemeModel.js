const db = require("../config/db");

const addApplyScheme = async ({
  scid,
  pid,
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
    "INSERT INTO applied_schemes (scid, pid, income_cert_url, caste_cert_url, ele_bill_url, bank_passbook_url, pincode, sub_dist, dist, state) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING apscid, scid, pid, income_cert_url, caste_cert_url, ele_bill_url, bank_passbook_url, pincode, sub_dist, dist, state",
    [
      scid,
      pid,
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

module.exports = {
  addApplyScheme,
};
