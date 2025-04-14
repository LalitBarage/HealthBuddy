const db = require("../config/db");
const { updateAppliedScheme } = require("../controllers/schemeController");

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

const getAppliedSchemeByApscid = async (apscid) => {
  const result = await db.query(
    "SELECT * FROM applied_schemes WHERE apscid = $1",
    [apscid]
  );
  return result.rows[0];
};

const updateAppliedSchemeDoc = async (
  apscid,
  income_cert_url,
  caste_cert_url,
  ele_bill_url,
  bank_passbook_url
) => {
  const result = await db.query(
    "UPDATE applied_schemes SET income_cert_url = $1, caste_cert_url = $2, ele_bill_url = $3, bank_passbook_url = $4 WHERE apscid = $5 RETURNING *",
    [income_cert_url, caste_cert_url, ele_bill_url, bank_passbook_url, apscid]
  );
  return result.rows[0];
};

const deleteAppliedSchemeId = async (apscid) => {
  const result = await db.query(
    "DELETE FROM applied_schemes WHERE apscid = $1 RETURNING *",
    [apscid]
  );
  return result.rows[0];
};

module.exports = {
  addApplyScheme,
  getAppliedSchemeByPid,
  getAppliedSchemeByApscid,
  updateAppliedSchemeDoc,
  deleteAppliedSchemeId,
};
