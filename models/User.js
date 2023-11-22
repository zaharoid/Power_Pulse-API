import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleSaveError, runValidatorsAtUpdate } from "./hooks.js";
const emailRegexp = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
const emailPatternMessage = "The email must be in format example123@mail.com";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      match: emailRegexp,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      minlength: 6,
      required: true,
    },
    avatarURL: {
      type: String,
    },
    token: {
      type: String,
      default: "",
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      default: "",
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleSaveError);
userSchema.pre("findOneAndUpdate", runValidatorsAtUpdate);
userSchema.post("findOneAndUpdate", handleSaveError);

export const userSignupSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": 'Missing required "name" field',
  }),
  email: Joi.string().pattern(emailRegexp).required().messages({
    "any.required": 'Missing required "email" field',
    "string.pattern.base": emailPatternMessage,
  }),
  password: Joi.string().min(6).required().messages({
    "any.required": 'Missing required "password" field',
  }),
});
export const userSigninSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    "any.required": 'Missing required "email" field',
    "string.pattern.base": emailPatternMessage,
  }),
  password: Joi.string().min(6).required().messages({
    "any.required": 'Missing required "password" field',
  }),
});

export const userUpdateSchema = Joi.object({
  name: Joi.string(),
});
const User = model("user", userSchema);

export default User;
