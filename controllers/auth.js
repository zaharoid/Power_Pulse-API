import User from "../models/User.js";
import { HttpErr, cloudinary } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import Diary from "../models/Diary.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import gravatar from "gravatar";
import fs from "fs/promises";
import UserData from "../models/userData.js";

dotenv.config();

const { JWT_SECRET } = process.env;

const signup = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpErr(409, `${email} already in use`);
  }
  const hashPassword = await bcrypt.hash(password, 10);

  const avatarURL = gravatar.url(email);

  const newUser = await User.create({
    ...req.body,
    avatarURL: `${avatarURL}?s=250`,
    password: hashPassword,
  });

  await Diary.create({ owner: newUser._id });

  const payload = {
    id: newUser._id,
  };

  const token = await jwt.sign(payload, JWT_SECRET);

  await User.findByIdAndUpdate(newUser._id, { token });

  res.status(201).json({
    user: {
      email: newUser.email,
      name: newUser.name,
      avatarURL: `${avatarURL}?s=250`,
    },
    token,
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
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

  res.json({
    user: {
      name: user.name,
      email: user.email,
    },
    token,
  });
};
const getCurrent = async (req, res) => {
  const { email, name, avatarURL, _id: owner } = req.user;

  const userInfo = await UserData.findOne({ owner });

  res.json({
    userData: {
      name,
      email,
      avatarURL,
    },

    userInfo,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json({ message: "No content" });
};

const updateUserInfo = async (req, res) => {
  const { _id } = req.user;

  const user = await User.findByIdAndUpdate({ _id }, req.body);

  if (!user) {
    throw HttpErr(404);
  }
  res.status(200).json({
    name: user.name,
    email: user.email,
  });
};

const addAvatar = async (req, res) => {
  const { _id } = req.user;

  const { url: avatarURL } = await cloudinary.uploader.upload(req.file.path, {
    folder: "avatars",
  });

  await fs.unlink(req.file.path);

  await User.findByIdAndUpdate(_id, { avatarURL });

  res.status(200).json({
    avatarURL,
  });
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateUserInfo: ctrlWrapper(updateUserInfo),
  addAvatar: ctrlWrapper(addAvatar),
};
