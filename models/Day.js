import Joi from "joi";

const daySchema = Joi.object({
    date: Joi.date().required(),
});

const dayStingSchema = Joi.object({
    date: Joi.string().regex(/^\d{2}\.\d{2}\.\d{4}$/).length(10).required()
})

const dayInfoSchema = Joi.object({
    date: Joi.date(),
    doneExercises: Joi.array().allow(null),
    eatedProducts: Joi.array().allow(null),
    burnedCalories: Joi.number().allow(null).min(0),
    sportTime: Joi.number().allow(null).min(0),
})

export { daySchema, dayInfoSchema, dayStingSchema };

/*
day{
    data: data
    ex:{
        {id: 92475678234, reps: 1231},
        {id: 92475678234, reps: 1231},
        {id: 92475678234, reps: 1231},
        {id: 92475678234, reps: 1231}
    },
    products:{
        [id: 2873462387468234, weight: 100]
    },
    kcalConsumed: lalala,
    kcalBurned: okeokeoke


}

rice = findOne( id: 2873462387468234 )
allKcal = rice.weight * ( rice.kcal / 100 )
*/