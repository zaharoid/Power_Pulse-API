import mongoose from 'mongoose';

import Exercise from "./Exercise.js"

const DaySchema = mongoose.Schema({
    data: {
        type: Date,
        required: true,
    },

    exercise: {
        type: Array,
        required: false
    }
})

const Day = mongoose.model("day", DaySchema);
export default Day;

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