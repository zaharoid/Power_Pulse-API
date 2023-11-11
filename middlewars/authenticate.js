import { HttpErr } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import User from "../models/User.js";

const { JWT_SECRET } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization } = req.body;
  const { bearer, token } = authorization.split(" ");
  if (bearer !== "Bearer") {
    throw HttpErr(401);
  }
  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id);
    if (!user) {
      throw HttpErr(401);
    }
    next();
  } catch {
    next(HttpErr(401));
  }
};
export default ctrlWrapper(authenticate);
