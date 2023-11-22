import Joi from "joi";

const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
const requiredMessage = "missing required date field";
const patternMessage = '{{#label}} with value "{:[.]}" fails to match the required pattern, example: "20.11.2020"';

const dateSchema = Joi.object({
  date: Joi.string()
    .regex(dateRegex)
    .length(10)
    .required()
});

const addExerciseSchema = Joi.object({
  date: Joi.string()
    .regex(dateRegex)
    .required()
    .messages({
      "any.required": requiredMessage,
      "string.pattern.base": patternMessage,
    }),
  time: Joi.number().required(),
});

const addProductSchema = Joi.object({
  date: Joi.string()
    .regex(dateRegex)
    .required()
    .messages({
      "any.required": requiredMessage,
      "string.pattern.base": patternMessage,
    }),
  weight: Joi.number().required(),
});

const deleteSchema = Joi.object({
  date: Joi.string()
    .regex(dateRegex)
    .length(10)
    .required(),
});

export { dateSchema, addExerciseSchema, addProductSchema, deleteSchema };
