import { Schema, model } from "mongoose";
import DateExtension from "@joi/date";
import JoiImport from "joi";
const Joi = JoiImport.extend(DateExtension);
import { handleSaveError, runValidatorsAtUpdate } from "./hooks.js";

const UserCalculates = new Schema(
  {
    height: {
      type: Number,
      required: true,
      min: 150,
    },
    currentWeight: {
      type: Number,
      required: true,
      min: 35,
    },
    desiredWeight: {
      type: Number,
      required: true,
      min: 35,
    },
    birthday: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return new Date() - new Date(value) > 18 * 365 * 24 * 60 * 60 * 1000;
        },
        message: "Must be older than 18 years",
      },
    },
    blood: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4],
    },
    sex: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
    levelActivity: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4, 5],
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user",
      unique: true,
    },
    BMR: {
      type: Number,
      required: true,
    },
    dailyExerciseTime: {
      type: Number,
      required: true,
    },
  },
  { versionKey: false }
);

UserCalculates.post("save", handleSaveError);

UserCalculates.pre("findOneAndUpdate", runValidatorsAtUpdate);

UserCalculates.post("findOneAndUpdate", handleSaveError);

export const userStatSchema = Joi.object({
  height: Joi.number().min(150).max(300).required().messages({
    "any.required": 'Missing required "height" field',
  }),
  currentWeight: Joi.number().min(35).max(300).required().messages({
    "any.required": `"currentWeight" is a required field`,
  }),
  desiredWeight: Joi.number().min(35).max(300).required().messages({
    "any.required": 'Missing required "desiredWeight" field',
  }),
  birthday: Joi.date()
    .format("YYYY-MM-DD")
    .max("now")
    .required()
    .messages({
      "any.required": 'Missing required "birthday" field',
    })
    .custom((value, helpers) => {
      const age = new Date().getFullYear() - new Date(value).getFullYear();
      if (age < 18) {
        return helpers.message("Must be older than 18 years");
      }

      return value;
    })
    .messages({
      "any.required": 'Missing required "birthday" field',
    }),
  blood: Joi.number().valid(1, 2, 3, 4).required().messages({
    "any.required": 'Missing required "blood" field',
  }),
  sex: Joi.string().valid("male", "female").required().messages({
    "any.required": 'Missing required "sex" field',
  }),
  levelActivity: Joi.number().valid(1, 2, 3, 4, 5).required().messages({
    "any.required": 'Missing required "levelActivity" field',
  }),
});

export const userStatUpdateSchema = Joi.object({
  height: Joi.number().min(150).max(300),
  currentWeight: Joi.number().min(35).max(300),
  desiredWeight: Joi.number().min(35).max(300),
  birthday: Joi.date()
    .format("YYYY-MM-DD")
    .max("now")
    .custom((value, helpers) => {
      const age = new Date().getFullYear() - new Date(value).getFullYear();
      if (age < 18) {
        return helpers.message("Must be older than 18 years");
      }
      return value;
    }),
  blood: Joi.number().valid(1, 2, 3, 4),
  sex: Joi.string().valid("male", "female"),
  levelActivity: Joi.number().valid(1, 2, 3, 4, 5),
});

const UserData = model("calculate", UserCalculates);

export default UserData;
