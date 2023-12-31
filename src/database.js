import mysql from "mysql2";

import dotenv from "dotenv";
dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

export async function getUsers() {
  const [rows] = await pool.query(`SELECT * FROM notes`);
  return rows;
}

export async function createUser(user_name, user_password) {
  await pool.query(
    `
  INSERT INTO users (user_name, user_password)
  VALUES (?, ?)
  `,
    [user_name, user_password]
  );
}

export async function getUser(user_name) {
  const [rows] = await pool.query(
    `SELECT *
    FROM users
    WHERE user_name = ?`,
    [user_name]
  );
  return rows[0];
}
