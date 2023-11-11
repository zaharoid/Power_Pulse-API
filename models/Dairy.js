import mongoose from 'mongoose';

import Day from "./Day.js"

const DairySchema = new mongoose.Schema({
    owner: {
        type: String, // ID владельца
        required: [true, "Diary without owner? Something wrong is going on here. Fix this and come back:)"],
        unique: true
    },
    data: {
        type: Array
    }    
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