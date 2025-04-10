const db = require("../config/db");

const createUser = async ({ name, email, password }) => {
  const result = await db.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
    [name, email, password]
  );
  return result.rows[0];
};

const getUserByEmail = async (email) => {
  const result = await db.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
};

const createHospital = async ({ name, email, password }) => {
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

module.exports = { createUser, getUserByEmail, createHospital };
