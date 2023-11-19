import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
    id: String,
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

const DairySchema = new mongoose.Schema({
    owner: {
        type: String, // ID владельца
        required: true,
        unique: true
    },
    data: [daySchema]
})

const Dairy = mongoose.model("diaries", DairySchema);
export default Dairy;
