import User from "../models/User.js";
import { HttpErr, cloudinary, sendEmail } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import Diary from "../models/Diary.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fs from "fs/promises";
import { nanoid } from "nanoid";
import UserData from "../models/userData.js";

dotenv.config();

const { JWT_SECRET, BASE_URL } = process.env;

const signup = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpErr(409, `${email} already in use`);
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = await cloudinary.url("avatars/avatar", {
    width: 250,
    height: 250,
    crop: "fill",
  });
  const verificationCode = nanoid();
  const newUser = await User.create({
    ...req.body,
    avatarURL,
    password: hashPassword,
    verificationCode,
  });

  const emailParams = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="https://adoppp.github.io/react-app-team-4/verify"> Click verify email</a>`,
  };
  await sendEmail(emailParams);

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
      verify: newUser.verify,
      createdAt: newUser.createdAt,
      avatarURL,
    },
    token,
    verificationCode,
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user.verify) {
    throw HttpErr(401, "Email not verify");
  }
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

  let userInfo;

  userInfo = await UserData.findOne({ owner: user._id });

  if (!userInfo) {
    userInfo = {};
  }

  res.json({
    userData: {
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      avatar: user.avatarURL,
    },
    token,
    userInfo,
  });
};
const getCurrent = async (req, res) => {
  const { email, name, avatarURL, _id: owner, createdAt } = req.user;

  let userInfo;

  userInfo = await UserData.findOne({ owner });

  if (!userInfo) {
    userInfo = {};
  }

  res.json({
    userData: {
      name,
      email,
      avatarURL,
      createdAt,
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
const verifyEmail = async (req, res) => {
  const { verificationCode } = req.params;
  const user = await User.findOne({ verificationCode });
  if (!user) {
    throw HttpErr(401, "Email not found");
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationCode: "",
  });
  res.json({
    verify: user.verify,
  });
};

const resendVerify = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpErr(404, "User not found");
  }

  if (user.verify) {
    throw HttpErr(400, "Verification has already been passed");
  }

  const emailParams = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationCode}"> Click verify email</a>`,
  };

  await sendEmail(emailParams);

  res.json({ message: "Verification email sent" });
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateUserInfo: ctrlWrapper(updateUserInfo),
  addAvatar: ctrlWrapper(addAvatar),
  verifyEmail: ctrlWrapper(verifyEmail),
  resendVerify: ctrlWrapper(resendVerify),
};
