import express from "express";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";

import { getUser, createUser } from "./database.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.post("/register", (req, res) => {
  const { user_name, user_password } = req.body;
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
        res.status(400).send({ error: err });
      }
    });
});

app.post("/login", async (req, res) => {
  const { user_name, user_password } = req.body;

  const user = await getUser(user_name);

  if (!user) res.status(400).send({ error: "User doesn't exist!" });

  const dbPassword = user.user_password;

  bcrypt.compare(user_password, dbPassword).then((match) => {
    if (!match) {
      console.log("not match");
      res.status(400).send({ error: "Wrong password!" });
    } else {
      res.send("Logged in");
    }
  });
});

app.listen(3000, () => {
  console.log("Server is running");
});
