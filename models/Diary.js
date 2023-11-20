import mongoose from 'mongoose';
import { Schema } from 'mongoose';
// import {exerciseSchema} from "./Exercise.js"

const exerciseSchema = new mongoose.Schema({
    id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'exercise',
    },
    time: Number,
}, {_id: false,});

const productsSchema = new mongoose.Schema({
    id: String,
    weight: Number,
}, {_id: false,});


const daySchema = new mongoose.Schema({
    date: String,
    doneExercises: [exerciseSchema],
    products: [productsSchema],
}, {_id: false,});

const DiarySchema = new mongoose.Schema({
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    data: [daySchema]
})

const Diary = mongoose.model("diary", DiarySchema);
export default Diary;
