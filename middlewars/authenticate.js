import { HttpErr } from "../helpers/index.js";

import { ctrlWrapper } from "../decorators/index.js";

import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    throw HttpErr(401);
  }

  if (!token) {
    return next(HttpErr(401, "Not authorized"));
  }

  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id);
    if (!user || !user.token) {
      throw HttpErr(401);
    }
    req.user = user;
    next();
  } catch (error) {
    next(HttpErr(401));
  }
};


export default ctrlWrapper(authenticate)
