import Joi from "joi";

const dateSchema = Joi.object({
    date: Joi.string().regex(/^\d{2}\.\d{2}\.\d{4}$/).length(10).required()
});



const addExerciseSchema = Joi.object({
    date: Joi.string(),
    doneExercises: Joi.object({
        id: Joi.string().length(24).required(),
        time: Joi.number().required()
    }),
})

const addProductSchema = Joi.object({
    date: Joi.string(),
    products: Joi.object({
        id: Joi.string().length(24).required(),
        weight: Joi.number().required()
    }),
})

const deleteSchema = Joi.object({
    id: Joi.string().length(24).required(),
    date: Joi.string().regex(/^\d{2}\.\d{2}\.\d{4}$/).length(10).required()
})

export { dateSchema, addExerciseSchema, addProductSchema, deleteSchema };

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