import express from "express";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import cors from "cors";

import { getUser, createUser } from "./database.js";
import { createTokens, validateToken } from "./JWT.js";

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.post("/register", (req, res) => {
  const { user_name, user_password } = req.body;
  const user = getUser(user_name);
  if (user) res.send({ UserError: "User taken!" });
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
});

app.post("/login", async (req, res) => {
  const { user_name, user_password } = req.body;

  const user = await getUser(user_name);

  if (!user) res.send({ UserError: "User doesn't exist!" });

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

app.get("/todos", validateToken, (req, res) => {
  res.send("User Authenticated");
});

app.listen(3000, () => {
  console.log("Server is running");
});
