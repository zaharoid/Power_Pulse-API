import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
    id: String,
    time: Number,
}, {_id: false,});

const daySchema = new mongoose.Schema({
    date: String,
    doneExercises: [exerciseSchema],
}, {_id: false,});

const DairySchema = new mongoose.Schema({
    owner: {
        type: String, // ID владельца
        required: [true, "Diary without owner? Something wrong is going on here. Fix this and come back:)"],
        unique: true
    },
    data: [daySchema]
})

const Dairy = mongoose.model("diaries", DairySchema);
export default Dairy;

/*

dairy{
    user1(id8173674){
        day1{
            data: 10.11.2023,
            exersice: {id: 2384729, reps: 10},
            products: {id: 87368716387, weight: 100kg}
        }
        day2{
            
        }
    }
    user1{
        day1{
            ...
        }
    }
}

*/