import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleSaveError, runValidatorsAtUpdate } from "./hooks.js";
const calcUserSchema = new Schema({

  height: {
    type: Number,
    required: true,
    min: 150
  },
  currentWeight: {
    type: Number,
    required: true,
    min: 35
  },
  desiredWeight: {
    type: Number,
    required: true,
    min: 35
  },
  birthday: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return new Date() - new Date(value) > 18 * 365 * 24 * 60 * 60 * 1000;
      },
      message: 'Must be older than 18 years'
    }
  },
  blood: {
    type: Number,
    required: true,
    enum: [1, 2, 3, 4]
  },
  sex: {
    type: String,
    required: true,
    enum: ['male', 'female']
  },
  levelActivity: {
    type: Number,
    required: true,
    enum: [1, 2, 3, 4, 5]
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user', //Примітка: 'user' - назва колекції, у якій зберігаються користувачі
    require: true,
  },
});


calcUserSchema.post("save", handleSaveError);

calcUserSchema.pre("findOneAndUpdate", runValidatorsAtUpdate);

calcUserSchema.post("findOneAndUpdate", handleSaveError);


export const userCalcSchema = Joi.object({
    height: Joi.number().min(150).required(),
    currentWeight: Joi.number().min(35).required(),
    desiredWeight: Joi.number().min(35).required(),
    birthday: Joi.date().max('now').iso().required().custom((value, helpers) => {
        // Власна перевірка для переконання, що користувач старше 18 років
        const age = new Date().getFullYear() - new Date(value).getFullYear();
        if (age < 18) {
            return helpers.message('Користувач повинен бути старше 18 років');
        }
        return value;
    }),
    blood: Joi.number().valid(1, 2, 3, 4).required(),
    sex: Joi.string().valid('male', 'female').required(),
    levelActivity: Joi.number().valid(1, 2, 3, 4, 5).required(),
})

const MongusModel = model('calculate', calcUserSchema);

export default MongusModel;


