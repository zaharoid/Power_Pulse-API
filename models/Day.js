import Joi from "joi";

const dateSchema = Joi.object({
  date: Joi.string()
    .regex(/^\d{2}\.\d{2}\.\d{4}$/)
    .length(10)
    .required(),
});

const addExerciseSchema = Joi.object({
  date: Joi.string()
    .regex(/^\d{2}\.\d{2}\.\d{4}$/)
    .required()
    .messages({
      "any.required": "missing required date field",
      "string.pattern.base":
        '{{#label}} with value {:[.]} fails to match the required pattern, example: "20.11.2020"',
    }),
  time: Joi.number().required(),
});

const addProductSchema = Joi.object({
  date: Joi.string()
    .regex(/^\d{2}\.\d{2}\.\d{4}$/)
    .required()
    .messages({
      "any.required": "missing required date field",
      "string.pattern.base":
        '{{#label}} with value {:[.]} fails to match the required pattern, example: "20.11.2020"',
    }),

  weight: Joi.number().required(),
});

const deleteSchema = Joi.object({
  date: Joi.string()
    .regex(/^\d{2}\.\d{2}\.\d{4}$/)
    .length(10)
    .required(),
});

export { dateSchema, addExerciseSchema, addProductSchema, deleteSchema };
