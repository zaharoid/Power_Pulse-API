import Dairy from "../models/Dairy.js";
import { daySchema } from "../models/Day.js";

import { validationResult } from "express-validator";

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import moment from "moment";

import { ctrlWrapper } from "../decorators/index.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const createDay = async (req, res) => {
    const token = req.headers["authorization"].split(" ")[1];
    const userId = jwt.verify(token, JWT_SECRET).id;

    try {
        const usersDairy = await Dairy.findOne({ owner: userId });

        // Проверка уникальности даты внутри списка data
        const existingDay = usersDairy.data.find(day => moment(day.date, 'DD.MM.YYYY').isSame(moment(req.body.date), 'day'));

        if (existingDay) {
            // Объект с такой датой уже существует, отправляем ошибку
            return res.status(400).json({ error: "День із зазначеною датою вже існує" });
        }

        // Валидация данных с использованием схемы Joi
        const validationResult = daySchema.validate(req.body);

        if (validationResult.error) {
            console.error('Ошибка валидации:', validationResult.error.details);
            return res.status(400).json({ error: "Неправильний формат даних" });
        }

        // Округление момента времени до начала дня
        const roundedDate = moment(req.body.date).startOf('day');

        // Форматирование даты в нужный формат "дд.мм.гггг"
        const formattedDate = roundedDate.format('DD.MM.YYYY');

        const newData = { ...validationResult.value, date: formattedDate };

        await Dairy.findByIdAndUpdate(
            usersDairy._id,
            { $push: { data: newData } },
            { new: true, useFindAndModify: false }
        );

        return  res.status(200).json(true);
    } catch (error) {
        console.error("Ошибка при выполнении запроса:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const inputInfoInDay = async (req, res) => {
    const token = req.headers["authorization"].split(" ")[1];
    const userId = jwt.verify(token, JWT_SECRET).id;

    try {
        const usersDairy = await Dairy.findOne({ owner: userId });

        // Format the current date using moment
        const formattedDate = moment().format('DD.MM.YYYY');

        // Find the day with the formatted date
        const existingDay = usersDairy.data.find(day => day.date === formattedDate);

        // If the day exists, update it with new information
        if (existingDay) {
            const inputData = { ...req.body };

            // Update the existing day with new information
            await Dairy.updateOne(
                { 'data.date': formattedDate },
                { $push: { 'data.$.doneExercises': inputData.doneExercises, 'data.$.eatedProducts': inputData.eatedProducts, 'data.$.burnedCalories': inputData.burnedCalories, 'data.$.sportTime': inputData.sportTime } }
            );
        } else {
            // If the day does not exist, create a new one
            const newData = {
                date: formattedDate,
                ...req.body
            };

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

export default {
    createDay: ctrlWrapper(createDay),
    inputInfo: ctrlWrapper(inputInfoInDay),
};
