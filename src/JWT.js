import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const createTokens = (user) => {
  const accessToken = jwt.sign(
    { username: user.user_name },
    process.env.JWT_SECRET
  );

  return accessToken;
};

export const validateToken = (req, res, next) => {
  const authorizationHeader = req.headers["authorization"];
  const accessToken = authorizationHeader.split(" ")[1];

  if (accessToken === "null") {
    return res.send({ UserError: "User not Authenticated!" });
  }

  try {
    const validToken = jwt.verify(accessToken, process.env.JWT_SECRET);
    if (validToken) {
      req.authenticated = true;
      req.userName = validToken.username;
      return next();
    }
  } catch (err) {
    return res.status(400).send({ error: err });
  }
};
