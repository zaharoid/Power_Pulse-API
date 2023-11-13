import {HttpErr} from "../helpers/index.js";
import MongusModel, {userCalcSchema} from "../models/calcUser.js"
import {ctrlWrapper} from "../decorators/index.js";

 const schow = async(req, res)=>{
    const {error, value} = userCalcSchema.validate(req.body);
        if(error){
            return res.status(400).json({error: error.details[0].message})
        }
res.status(200).json({message: 'Validation success', data: value})
}

const add = async (req, res) => {
    
    const {_id: owner} = req.user;
    const result = await MongusModel.create({...req.body, owner});
    res.status(201).json(result)
}

const calculateCalories = async (req, res) => {
    const {_id: owner} = req.user;
    try {
        const calculations = await MongusModel.find({owner});
        const { height, currentWeight, desiredWeight, birthday, blood, sex, levelActivity} = calculations[0];
        // console.log('0000000', height, currentWeight, birthday, blood, sex, levelActivity )
        const activityCoefficients = { 1: 1.2, 2: 1.375, 3: 1.55, 4: 1.725, 5: 1.9 };
        const activityCoefficient = activityCoefficients[levelActivity];

        const isMale = sex === "male";
        const baseMetabolicRate = isMale
            ? 10 * currentWeight + 6.25 * height - 5 * (new Date(birthday)).getFullYear() + 5
            : 10 * currentWeight + 6.25 * height - 5 * (new Date(birthday)).getFullYear() - 161;

        const dailyCalories = baseMetabolicRate * activityCoefficient;
        const dailyExerciseTime = 110;

        res.status(200).json({
            dailyCalories,
            dailyExerciseTime,
        });
    } catch (error) {
        console.error('Error calculating calories:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export default {
    schow: ctrlWrapper(schow),
    add: ctrlWrapper(add),
    calculateCalories: ctrlWrapper(calculateCalories),
   
}

