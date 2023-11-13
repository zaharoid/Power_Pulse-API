import { HttpErr } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken"; 
const { JWT_SECRET } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(HttpErr(401, "Not authorized"));
  }

  const token = authorization.split(" ")[1];
  if (!token) {
    return next(HttpErr(401, "Not authorized"));
  }

  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id);
    if (!user) {
      return next(HttpErr(401, "Not authorized"));
    }

    req.user = user;
    next();
  } catch {
    next(HttpErr(401, "Not authorized"));
  }
};

export default ctrlWrapper(authenticate);