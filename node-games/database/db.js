const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config({ path: "./env/.env" });

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_DATABASE = process.env.DB_DATABASE;

const connection = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
});

connection.connect((err) => {
  if (err) throw ("error 💥💥💥", err);
  console.log("DB connected successfully");
});

module.exports = connection;
