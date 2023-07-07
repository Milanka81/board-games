const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const connection = require("../database/db");
const { promisify } = require("util");
const { executeQuery } = require("../utils/utils");

exports.tokenVerify = (req, res, next) => {
  if (!req.headers.jwt)
    return res.status(401).json({ message: "Invalid or expired token" });
  try {
    const token = req.headers.jwt;
    const secret = process.env.JWT_SECRET;

    const verify = jwt.verify(token, secret);
    req.userId = verify.id;
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
  next();
};

// const sendToken = (result, id, statusCode, res) => {
//   const token = jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_TIME_EXPIRE,
//   });

//   const cookieOptions = {
//     expires: new Date(
//       Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
//     ),
//     httpOnly: true,
//   };

//   if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

//   res.cookie("JWT", token, cookieOptions);

//   res.status(statusCode).json({
//     auth: true,
//     icon: "success",
//     message: "Successful registration!",
//     status: "success",
//     token,
//     data: {
//       result,
//     },
//   });
// };

const generateResetToken = (userId) => {
  const secret = process.env.PASSWORD_RESET_SECRET;
  const token = jwt.sign({ userId }, secret, {
    expiresIn: "5m",
  });
  return token;
};

exports.register = async (req, res) => {
  try {
    const {
      firstName: first_name,
      lastName: last_name,
      username,
      password,
      email,
    } = req.body;
    const role = "user";
    let passHash = await bcryptjs.hash(password, 8);

    connection.query(
      `SELECT username FROM user WHERE username = ?`,
      [username],
      (err, data) => {
        if (err) {
          throw err;
        }
        if (data[0]) {
          res.send({
            error: true,
            icon: "error",
            message: "Username is already in use",
          });
          return;
        }

        connection.query(
          `SELECT email FROM user WHERE email = ?`,
          [email],
          (err, result) => {
            if (err) {
              throw err;
            }
            if (result[0]) {
              res.send({
                error: true,
                icon: "error",
                message: "Email is already in use",
              });
              return;
            }
            connection.query(
              "INSERT INTO user SET ?",
              {
                first_name,
                last_name,
                username,
                password: passHash,
                email,
                role,
              },
              (error, result) => {
                if (error) {
                  console.log(error);
                }

                res.send({
                  icon: "success",
                  message: "Successful registration!",
                });
              }
            );
          }
        );
      }
    );
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

exports.login = (req, res) => {
  const { username, password } = req.body;

  connection.query(
    "SELECT * FROM user WHERE username = ?",
    [username],
    async (err, result) => {
      if (err) {
        throw err;
      }

      if (!result.length > 0) {
        console.log("nema username");
        res.send({ auth: false, message: "Wrong credentials" });
        return;
      }

      const isPasswordValid = await bcryptjs.compare(
        password,
        result[0].password
      );

      if (!isPasswordValid) {
        console.log("neispravna sifra");
        res.send({ auth: false, message: "Wrong credentials" });
        return;
      }

      const secret = process.env.JWT_SECRET;
      const id = result[0].user_id;
      const token = jwt.sign({ id }, secret, {
        expiresIn: process.env.JWT_TIME_EXPIRE,
      });
      result[0].password = undefined;
      res.json({ auth: true, token, result });
    }
  );
};

exports.forgotPassword = async (req, res) => {
  const email = req.body.email;

  try {
    connection.query(
      `SELECT email, password, user_id FROM user WHERE email = ?`,
      [email],
      async (err, result) => {
        if (err) {
          throw err;
        }
        if (!result[0])
          return res.send({
            error: true,
            icon: "error",
            message: "Invalid Email",
          });

        const id = result[0].user_id;

        const resetToken = generateResetToken(id);

        const link = `http://localhost:3000/reset-password/${id}/${resetToken}`;
        res.send(link);
      }
    );
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

exports.resetPassword = (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  connection.query(
    `SELECT user_id, password FROM user WHERE user_id = ?`,
    [id],
    async (err, result) => {
      if (err) {
        throw err;
      }
      if (!result[0]) {
        return res.send({
          error: true,
          icon: "error",
          message: "User doesn't exist",
        });
      }
      const id = result[0].user_id;
      const secret = process.env.PASSWORD_RESET_SECRET;

      try {
        const verify = jwt.verify(token, secret);
        if (verify.userId === id) {
          let passHash = await bcryptjs.hash(password, 8);

          const sql = `UPDATE user SET password = ? WHERE user_id = ${verify.userId} `;
          executeQuery(res, sql, passHash);
        }
      } catch (error) {
        return res.status(401).json({ message: error.message });
      }
    }
  );
};
