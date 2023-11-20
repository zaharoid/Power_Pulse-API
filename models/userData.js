import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleSaveError, runValidatorsAtUpdate } from "./hooks.js";
import moment from "moment";
const UserCalculates = new Schema({
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
});

UserCalculates.post("save", handleSaveError);

UserCalculates.pre("findOneAndUpdate", runValidatorsAtUpdate);

UserCalculates.post("findOneAndUpdate", handleSaveError);

export const userStatSchema = Joi.object({
  height: Joi.number().min(150).required(),
  currentWeight: Joi.number().min(35).required(),
  desiredWeight: Joi.number().min(35).required(),
  birthday: Joi.date()
    .max("now")
    .iso()
    .required()
    .custom((value, helpers) => {
      const age = new Date().getFullYear() - new Date(value).getFullYear();
      if (age < 18) {
        return helpers.message("Користувач повинен бути старше 18 років");
      }
      return value;
    }),
  blood: Joi.number().valid(1, 2, 3, 4).required(),
  sex: Joi.string().valid("male", "female").required(),
  levelActivity: Joi.number().valid(1, 2, 3, 4, 5).required(),
});

export const userStatUpdateSchema = Joi.object({
  height: Joi.number().min(150),
  currentWeight: Joi.number().min(35),
  desiredWeight: Joi.number().min(35),
  birthday: Joi.date()
    .max("now")
    .iso()
    .custom((value, helpers) => {
      const age = new Date().getFullYear() - new Date(value).getFullYear();
      if (age < 18) {
        return helpers.message("Користувач повинен бути старше 18 років");
      }
      return value;
    }),
  blood: Joi.number().valid(1, 2, 3, 4),
  sex: Joi.string().valid("male", "female"),
  levelActivity: Joi.number().valid(1, 2, 3, 4, 5),
});

const UserData = model("calculate", UserCalculates);

export default UserData;
