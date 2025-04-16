const db = require("../config/db");

const createUser = async ({
  pFirstName,
  pLastName,
  addhar,
  dob,
  mobileno,
  gender,
  pincode,
  sub_dist,
  dist,
  state,
  password,
}) => {
  const result = await db.query(
    "INSERT INTO patient (pname_firstname, pname_lastname, paddhar, pmobileno, dob, gender, pincode, sub_dist, dist, state, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING pid, pname_firstname, pname_lastname, paddhar, pmobileno, dob, gender, pincode, sub_dist, dist, state",
    [
      pFirstName,
      pLastName,
      addhar,
      mobileno,
      dob,
      gender,
      pincode,
      sub_dist,
      dist,
      state,
      password,
    ]
  );
  return result.rows[0];
};

const getUserByPaddhar = async (paddhar) => {
  const result = await db.query("SELECT * FROM patient WHERE paddhar = $1", [
    paddhar,
  ]);
  return result.rows[0];
};

const createHospital = async ({
  hospitalName,
  email,
  password,
  pincode,
  mobileNo,
  sub_dist,
  dist,
  state,
  documentUrl,
}) => {
  const result = await db.query(
    "INSERT INTO hospital_admin (hname, hmobileno, hemail, password, pincode, sub_dist, dist, state, document_url) VALUES ($1, $2, $3, $4, $5, $6, $7 ,$8, $9) RETURNING hid, hname, hmobileno, hemail, password, pincode, sub_dist, dist, state, document_url",
    [
      hospitalName,
      mobileNo,
      email,
      password,
      pincode,
      sub_dist,
      dist,
      state,
      documentUrl,
    ]
  );
  return result.rows[0];
};

const getHospitalByEmail = async (email) => {
  const result = await db.query(
    "SELECT * FROM hospital_admin WHERE hemail = $1",
    [email]
  );
  return result.rows[0];
};

const updateUserPassword = async (paddhar, password) => {
  const result = await db.query(
    "UPDATE patient SET password = $1 WHERE paddhar = $2 RETURNING *",
    [password, paddhar]
  );
  return result.rows[0];
};

const getSubDistAdminByEmail = async (email) => {
  const result = await db.query(
    "SELECT * FROM sub_dist_admin WHERE email = $1",
    [email]
  );
  return result.rows[0];
};

module.exports = {
  createUser,
  getUserByPaddhar,
  createHospital,
  getHospitalByEmail,
  updateUserPassword,
  getSubDistAdminByEmail,
};
