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

export async function addTodoItem(user_name, todo_item) {
  await pool.query(
    `
  INSERT INTO todos (user_name, todo_item)
  VALUES (?, ?)
  `,
    [user_name, todo_item]
  );
}

export async function getTodoListForUser(user_name) {
  const [rows] = await pool.query(
    `SELECT todo_item
    FROM todos
    WHERE user_name = ?`,
    [user_name]
  );
  return rows;
}

export async function deleteTodoitemForUser(user_name, todo_item) {
  await pool.query(
    `DELETE
    FROM todos
    WHERE user_name = ? AND todo_item = ?`,
    [user_name, todo_item]
  );
}
