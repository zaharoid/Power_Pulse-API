import Joi from "joi";


const userCalcSchama = Joi.object({
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


   export default userCalcSchama;


