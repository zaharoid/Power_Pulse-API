import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleSaveError, runValidatorsAtUpdate } from "./hooks.js";

const emailRegexp = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

const invalidEmailField = "The email must be a string.";
const requiredEmailField = "The email field is required.";
const emptyEmailField = "The email must not be empty.";
const invalidEmailPattern = "The email must be in format test@gmail.com.";

const emailMessages = {
  'string.base': invalidEmailField,
  'any.required': requiredEmailField,
  'string.empty': emptyEmailField,
  'string.pattern.base': invalidEmailPattern}

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
    verify:{
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
       default: "",
    }
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleSaveError);
userSchema.pre("findOneAndUpdate", runValidatorsAtUpdate);
userSchema.post("findOneAndUpdate", handleSaveError);

export const userSignupSchema = Joi.object({
  name: Joi.string().required().message('Name is required'),
  email: Joi.string().pattern(emailRegexp).required().empty(false).messages(emailMessages),
  password: Joi.string().min(6).required().message('Password must be at least 6 characters long'),
});

export const userSigninSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().empty(false).messages(emailMessages),
  password: Joi.string().min(6).required().message('Password must be at least 6 characters long'),
});

export const userUpdateSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).empty(false).messages(emailMessages),
  name: Joi.string().message('Name must be a string'),
});

const User = model("user", userSchema);

export default User;

/*
  email: Joi.string().pattern(emailRegexp).required().empty(false).messages({
    'string.base': 'The email must be a string.',
    'any.required': 'The email field is required.',
    'string.empty': 'The email must not be empty.',
    'string.pattern.base': 'The email must be in format test@gmail.com.',
  })
  */