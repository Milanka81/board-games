const { executeQuery } = require("../utils/utils");
const connection = require("../database/db");

exports.getCountUsers = (req, res) => {
  const sql = "SELECT count(*) as count FROM user";
  executeQuery(res, sql);
};

exports.getUserProfile = (req, res) => {
  const user_id = req.userId;
  const sql = `SELECT * FROM user WHERE user_id = ${user_id}`;
  executeQuery(res, sql);
};

exports.getUser = (req, res) => {
  const user_id = req.query.userId;
  const sql = `SELECT * FROM user WHERE user_id = ${user_id}`;
  executeQuery(res, sql);
};

exports.deleteUser = (req, res) => {
  const sql = `DELETE FROM user WHERE user_id = ${req.body.id}`;
  executeQuery(res, sql);
};

exports.editUser = (req, res) => {
  const {
    firstName: first_name,
    lastName: last_name,
    username,
    email,
    role,
  } = req.body.values;
  const id = req.body.id;

  connection.query(
    `SELECT * FROM user WHERE email = ?`,
    [email],
    (err, result) => {
      if (err) {
        throw err;
      }
      if (!result[0] || result[0].user_id === id) {
        const sql = `UPDATE user SET ? WHERE user_id = ${id}`;
        const values = {
          first_name,
          last_name,
          username,
          email,
          role,
        };
        executeQuery(res, sql, values);
      } else {
        res.send({
          error: true,
          icon: "error",
          message: "Email is already in use",
        });
      }
    }
  );
};
exports.getFilteredUsers = (req, res) => {
  const { page, limit, input, sortBy } = req.query;
  const offset = (page - 1) * limit;
  const sql = `SELECT user_id, first_name, last_name, username, email, role FROM user WHERE first_name LIKE "${input}%"
               OR last_name LIKE "${input}%"
               OR username LIKE "${input}%"
               OR email LIKE "${input}%"
               ORDER BY ${sortBy}
               LIMIT ${limit} OFFSET ${offset}
               `;
  executeQuery(res, sql);
};
