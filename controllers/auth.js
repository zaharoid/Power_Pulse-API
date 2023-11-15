import User from "../models/User.js";
import { HttpErr } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import Dairy from "../models/Dairy.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Jimp from "jimp";
import path from "path";
import fs from "fs/promises";
dotenv.config();

const { JWT_SECRET } = process.env;

const posterPath = path.resolve("public", "avatars");


const signup = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpErr(409, `${email} already in use`);
  }
  const hashPassword = await bcrypt.hash(password, 10);
  if(req.file){
    const {path: oldPath, filename} = req.file;
    const newPath = path.join(posterPath, filename);
    await fs.rename(oldPath, newPath);
    const image = await Jimp.read(newPath);
    image.resize(250, 250);
    await image.writeAsync(newPath);
    const avatarURL = path.join('avatar', filename);
    const newUser = await User.create({...req.body, avatarURL, password, hashPassword});
  }

  const newUser = await User.create({ ...req.body, password: hashPassword });
  await Dairy.create({ owner: newUser._id })
  
  res.status(201).json({
    name: newUser.name,
    email: newUser.email,
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
  // , { expiresIn: "23h" }

  res.json({
    token,
  });
};
const getCurrent = async(req, res) => {
  const {email, name} = req.user;

  res.json({
    name,
    email, 
  })
};

const updateAvatar = async(req, res) => {
  const{email} = req.user;
  
  const {path: oldPath, filename} = req.file;

  const newPath = path.join(posterPath, filename)

  await fs.rename(oldPath, newPath);

  const image = await Jimp.read(newPath);
  image.resize(250, 250);
  await image.writeAsync(newPath);

  const avatarURL = path.join('avatar', filename);
  await User.findByIdAndUpdate({email}, {avatarURL}, {new: true})

  res.status(200).json({
    avatarURL
  })
}

const logout = async(req,  res) => {
  const {_id} = req.user;
  console.log('id', _id);
  await User.findByIdAndUpdate(_id, {token: ""});
  res.status(204).json({
    message: "Ok",
  });
}
export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateAvatar: ctrlWrapper(updateAvatar),
};
