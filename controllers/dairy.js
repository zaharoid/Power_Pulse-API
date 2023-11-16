import Dairy from "../models/Dairy.js";

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import moment from "moment";

import { ctrlWrapper } from "../decorators/index.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const addExercise = async (req, res) => {
    const token = req.headers["authorization"].split(" ")[1];
    const userId = jwt.verify(token, JWT_SECRET).id;

    const usersDairy = await Dairy.findOne({ owner: userId });
    // Format the current date using moment
    const formattedDate = moment().format('DD.MM.YYYY');

    // Find the day with the formatted date
    const existingDay = await Dairy.findOne({ owner: userId, "data.date": formattedDate });

    // If the day exists, update it with new information
    if (existingDay) {
        // Check if the exercise with the specified ID already exists for the date
        const exerciseId = req.body.doneExercises.id;
        const existingExercise = existingDay.data.find(entry => entry.date === formattedDate).doneExercises.find(exercise => exercise.id === exerciseId);
        if (existingExercise){
            await Dairy.findOneAndUpdate(
                { owner: userId, "data.date": formattedDate },
                { $inc: { "data.$[dateEntry].doneExercises.$[exerciseEntry].time": req.body.doneExercises.time } },
                {
                    new: true,
                    arrayFilters: [
                        { "dateEntry.date": formattedDate },
                        { "exerciseEntry.id": exerciseId }
                    ]
                }
            );
            
            return res.status(200).json({ message: "Update successful" });
        } const newExercise = await Dairy.findOneAndUpdate(
            { owner: userId, "data.date": formattedDate },
            { $push: { "data.$.doneExercises": {...req.body.doneExercises} } },
            { new: true, useFindAndModify: false }
        );
        const addedExercise = newExercise.data.find(entry => entry.date === formattedDate).doneExercises.slice(-1)[0];

        return res.status(201).json(addedExercise);
    } else {
        // If the day does not exist, create a new one
        const newDate = {
            date: moment().format('DD.MM.YYYY'),
            ...req.body,
        };

        await Dairy.findByIdAndUpdate(
            usersDairy._id,
            { $push: { data: newDate } },
            { new: true, useFindAndModify: false }
        );
    }

    return res.status(200).json(true);
};

const addProduct = async (req, res) => {
        const token = req.headers["authorization"].split(" ")[1];
        const userId = jwt.verify(token, JWT_SECRET).id;

        const usersDairy = await Dairy.findOne({ owner: userId });
        // Format the current date using moment
        const formattedDate = moment().format('DD.MM.YYYY');

        // Find the day with the formatted date
        const existingDay = await Dairy.findOne({ owner: userId, "data.date": formattedDate });

        // If the day exists, update it with new information
        if (existingDay) {
            const productId = req.body.products.id;
            const existingProductIndex = existingDay.data.findIndex(entry => entry.date === formattedDate);
            
            if (existingProductIndex !== -1) {
                const productIndex = existingDay.data[existingProductIndex].products.findIndex(product => product.id === productId);

                if (productIndex !== -1) {
                    // Update the weight of the existing product
                    await Dairy.findOneAndUpdate(
                        { owner: userId, "data.date": formattedDate },
                        { $inc: { ["data." + existingProductIndex + ".products." + productIndex + ".weight"]: req.body.products.weight } },
                        { new: true, useFindAndModify: false }
                    );

                    return res.status(200).json({ message: "Update successful" });
                } else {
                    // Add a new product if the product ID doesn't exist
                    const newProduct = await Dairy.findOneAndUpdate(
                        { owner: userId, "data.date": formattedDate },
                        { $push: { ["data." + existingProductIndex + ".products"]: { ...req.body.products } } },
                        { new: true, useFindAndModify: false }
                    );

                    const addedProduct = newProduct.data[existingProductIndex].products.slice(-1)[0];
                    return res.status(201).json(addedProduct);
                }
            }
        } else {
            // If the day does not exist, create a new one
            const newDate = {
                date: moment().format('DD.MM.YYYY'),
                products: [{ ...req.body.products }],
            };

            await Dairy.findByIdAndUpdate(
                usersDairy._id,
                { $push: { data: newDate } },
                { new: true, useFindAndModify: false }
            );

            const addedProduct = newDate.products[0];
            return res.status(201).json(addedProduct);
        }
};


const getInfoAboutDay = async (req, res) => {
    const token = req.headers["authorization"].split(" ")[1];
    const userId = jwt.verify(token, JWT_SECRET).id;

    try {
        const dateOfDay = req.body.date;
        const day = await Dairy.findOne({ owner: userId, "data.date": dateOfDay }, { "data.$": 1 });

        if (!day) {
            return res.status(200).json({ message: "Day is empty" });
        } else {
            return res.status(200).json({...day.toObject()});
        }
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const deleteItemById = async (req, res) => {
    
        const token = req.headers["authorization"].split(" ")[1];
        const userId = jwt.verify(token, JWT_SECRET).id;

        const itemId = req.body.id; // Assuming the item ID is passed in the request parameters
        const dateToDelete = req.body.date; // Assuming the date is passed in the request parameters

        const usersDairy = await Dairy.findOne({ owner: userId });

        if (!usersDairy) {
            return res.status(404).json({ error: "Dairy not found" });
        }

        const updatedDairy = await Dairy.findOneAndUpdate(
            { owner: userId, "data.date": dateToDelete },
            {
                $pull: {
                    "data.$.doneExercises": { id: itemId },
                    "data.$.products": { id: itemId },
                },
            },
            { new: true }
        );
        if (!updatedDairy) {
            return res.status(404).json({ error: "Item not found on the specified date" });
        }

        return res.status(200).json({ message: "Item deleted successfully" });
};

export default {
    addExercise: ctrlWrapper(addExercise),
    addProduct: ctrlWrapper(addProduct),
    getInfo: ctrlWrapper(getInfoAboutDay),
    deleteSmth: ctrlWrapper(deleteItemById)
};
