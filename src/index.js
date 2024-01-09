import express from "express";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import cors from "cors";

import {
  getUser,
  createUser,
  addTodoItem,
  getTodoListForUser,
  deleteTodoitemForUser,
} from "./database.js";
import { createTokens, validateToken } from "./JWT.js";

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.post("/register", async (req, res) => {
  const { user_name, user_password } = req.body;
  const user = await getUser(user_name);
  if (user) res.send({ UserError: "User taken!" });
  else {
    bcrypt
      .hash(user_password, 10)
      .then((hash) => {
        createUser(user_name, hash);
      })
      .then(() => {
        res.send("user register");
      })
      .catch((err) => {
        if (err) {
          res.send({ error: err });
        }
      });
  }
});

app.post("/login", async (req, res) => {
  const { user_name, user_password } = req.body;

  const user = await getUser(user_name);

  if (!user) return res.send({ UserError: "User doesn't exist!" });

  const dbPassword = user.user_password;

  bcrypt.compare(user_password, dbPassword).then((match) => {
    if (!match) {
      res.send({ UserError: "Wrong password!" });
    } else {
      const accessToken = createTokens(user);

      res.send(accessToken);
    }
  });
});

app.post("/addtodo", validateToken, async (req, res) => {
  const { todo_item } = req.body;
  const user_name = req.userName;
  await addTodoItem(user_name, todo_item);
  res.send("todo added");
});

app.get("/todos", validateToken, async (req, res) => {
  const userName = req.userName;
  const todoList = await getTodoListForUser(userName);
  res.send({ user_name: userName, todo_list: todoList });
});

app.post("/deletetodo", validateToken, async (req, res) => {
  const { todo_item } = req.body;
  const user_name = req.userName;
  await deleteTodoitemForUser(user_name, todo_item);
  res.send("todo deleted");
});

app.listen(3000, () => {
  console.log("Server is running");
});
