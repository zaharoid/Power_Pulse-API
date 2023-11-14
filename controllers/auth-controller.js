import User from "../models/User.js";
import { HttpErr } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import Dairy from "../models/Dairy.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const { JWT_SECRET } = process.env;

const signup = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpErr(409, `${email} already in use`);
  }
  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ ...req.body, password: hashPassword });
  await Dairy.create({ owner: newUser._id })
  
  res.status(201).json({
    name: newUser.name,
    email: newUser.email,
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  console.log(1);
  const user = await User.findOne({ email });
  console.log(2);
  if (!user) {
    throw HttpErr(401, "Email or password invalid");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  
  if (!passwordCompare) {
    throw HttpErr(401, "Email or password invalid");
  }

  const payload = {
    id: user._id,
  };
  const token = await jwt.sign(payload, JWT_SECRET);
  await User.findByIdAndUpdate(user._id, { token });
  // , { expiresIn: "23h" }

  res.json({
    token,
  });
};
export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
};
