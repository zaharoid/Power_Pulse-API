import Dairy from "../models/Dairy.js";
import { daySchema } from "../models/Day.js";

import { validationResult } from "express-validator";

import validateBody from "../decorators/validateBody.js";

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import moment from "moment";

import { ctrlWrapper } from "../decorators/index.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const inputInfoInDay = async (req, res) => {
    const token = req.headers["authorization"].split(" ")[1];
    const userId = jwt.verify(token, JWT_SECRET).id;

    try {
        const usersDairy = await Dairy.findOne({ owner: userId });

        // Format the current date using moment
        const formattedDate = moment().format('DD.MM.YYYY');

        // Find the day with the formatted date
        const existingDay = await Dairy.findOne({ owner: userId, "data.date": formattedDate });

        // If the day exists, update it with new information
        if (existingDay) {
            // Check if the exercise with the specified ID already exists for the date
            const exerciseId = req.body.doneExercises[0].id;
            const existingExercise = existingDay.data.find(entry => entry.date === formattedDate).doneExercises.find(exercise => exercise.id === exerciseId);
            if (existingExercise){
                await Dairy.findOneAndUpdate(
                    { "data.date": formattedDate },
                    { $inc: { "data.$[dateEntry].doneExercises.$[exerciseEntry].time": req.body.doneExercises[0].time } },
                    {
                        new: true,
                        arrayFilters: [
                            { "dateEntry.date": formattedDate },
                            { "exerciseEntry.id": exerciseId }
                        ]
                    }
                );
                return res.status(200).json({ message: "Update successful" });
            } await Dairy.findOneAndUpdate(
                { "data.date": formattedDate },
                { $push: { "data.$.doneExercises": {...req.body.doneExercises[0]} } },
                { new: true, useFindAndModify: false }
            );
    
            return res.status(200).json({ message: "Exercise added successfully" });
        } else {
            // If the day does not exist, create a new one
            console.log(formattedDate);
            const newData = {
                date: moment().format('DD.MM.YYYY'),
                ...req.body,
            };
            console.log(newData);

            await Dairy.findByIdAndUpdate(
                usersDairy._id,
                { $push: { data: newData } },
                { new: true, useFindAndModify: false }
            );
        }

        return res.status(200).json(true);
    } catch (error) {
        console.error("Ошибка при выполнении запроса:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const getInfoAboutDay = async (req, res) => {
    console.log("1");
    const token = req.headers["authorization"].split(" ")[1];
    console.log("2");
    const userId = jwt.verify(token, JWT_SECRET).id;
    console.log("3");
    console.log("4");
    try {
        console.log("5");
        const dateOfDay = req.body.date;
        const day = await Dairy.findOne({ owner: userId }).findOne({ "data.date": dateOfDay });
        console.log("6");
        console.log(dateOfDay, userId);
        console.log(day);
        if(!day){
            console.log("7");
            console.log("Day is empty");
            return res.status(200).json({ message: "Day is empty" });
        } else{
            console.log("8");
            console.log({...day})
            console.log("9");
            return res.status(200).json({...day.toObject()});
        }
    } catch (error) {
        console.error("Ошибка при выполнении запроса:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
} 

export default {
    inputInfo: ctrlWrapper(inputInfoInDay),
    getInfo: ctrlWrapper(getInfoAboutDay)
};
