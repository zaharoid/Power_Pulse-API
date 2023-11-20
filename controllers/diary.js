import moment from "moment";

import Diary from "../models/Diary.js";
import { ctrlWrapper } from "../decorators/index.js";
import { createNewDay } from "../helpers/index.js";

const addExercise = async (req, res) => {

  const { _id: userId } = req.user;
  const usersDiary = await Diary.findOne({ owner: userId });

  const formattedDate = moment().format("DD.MM.YYYY");
  const existingDay = await Diary.findOne({ owner: userId, "data.date": formattedDate });
  
  if (existingDay) {

    const exerciseId = req.body.doneExercises.id;
    const existingExercise = existingDay.data
      .find((entry) => entry.date === formattedDate)
      .doneExercises.find((exercise) => exercise.id === exerciseId);
    
    if (existingExercise) {

      await Diary.findOneAndUpdate(
        { owner: userId, "data.date": formattedDate },
        {
          $inc: {
            "data.$[dateEntry].doneExercises.$[exerciseEntry].time":
              req.body.doneExercises.time,
          },
        },
        {
          new: true,
          arrayFilters: [
            { "dateEntry.date": formattedDate },
            { "exerciseEntry.id": exerciseId },
          ],
        }
      );

      return res.status(200).json({ message: "Update successful" });
    }
    await Diary.findOneAndUpdate(
      { owner: userId, "data.date": formattedDate },
      { $push: { "data.$.doneExercises": { ...req.body.doneExercises } } },
      { new: true, useFindAndModify: false }
    );
  } else {
    await createNewDay(req, usersDiary);
  }

  return res.status(201).json(req.body.doneExercises);
};

const addProduct = async (req, res) => {
  const { _id: userId } = req.user;

  const usersDiary = await Diary.findOne({ owner: userId });
  const formattedDate = moment().format("DD.MM.YYYY");

  const existingDay = await Diary.findOne({ owner: userId, "data.date": formattedDate});
  
  if (existingDay) {
    const productId = req.body.products.id;
    const existingProductIndex = existingDay.data.findIndex((entry) => entry.date === formattedDate);

    if (existingProductIndex !== -1) {
      const productIndex = existingDay.data[
        existingProductIndex
      ].products.findIndex((product) => product.id === productId);

      if (productIndex !== -1) {
        // Update the weight of the existing product
        await Diary.findOneAndUpdate(
          { owner: userId, "data.date": formattedDate },
          {
            $inc: { [`data.${existingProductIndex}.products.${productIndex}.weight`]: req.body.products.weight},
          },
          { new: true, useFindAndModify: false }
        );

        return res.status(200).json({ message: "Update successful" });
      }
      // Add a new product if the product ID doesn't exist
      await Diary.findOneAndUpdate(
        { owner: userId, "data.date": formattedDate },
        {
          $push: {
            ["data." + existingProductIndex + ".products"]: {
              ...req.body.products,
            },
          },
        },
        { new: true, useFindAndModify: false }
      );
    }
  } else {
    await createNewDay(req, usersDiary);
  }
  return res.status(201).json({ ...req.body });
};

const getInfoAboutDay = async (req, res) => {
  const { _id: userId } = req.user;

  const dateOfDay = req.body.date;
  const day = await Diary.findOne({ owner: userId, "data.date": dateOfDay },{ "data.$": 1 }).populate();

  if (!day) return res.status(404).json({ message: "Day is empty" });
  return res.status(200).json(day);
};

const deleteExerciseById = async (req, res) => {
  const { _id: userId } = req.user;
  const itemId = req.body.id; 
  const dateToDelete = req.body.date;

  const updatedDiary = await Diary.findOneAndUpdate(
    { owner: userId, "data.date": dateToDelete, "data.doneExercises.id": itemId },
    {
      $pull: {
        "data.$.doneExercises": { id: itemId },
      },
    }
  );
  if (!updatedDiary) {
    return res.status(404).json({ error: "Item not found on the specified date" });
  }

  return res.status(200).json({ message: "Item deleted successfully" });
};

const deleteProductById = async (req, res) => {
  const { _id: userId } = req.user;
  const itemId = req.body.id; 
  const dateToDelete = req.body.date;

  const updatedDiary = await Diary.findOneAndUpdate(
    { owner: userId, "data.date": dateToDelete, "data.products.id": itemId },
    {
      $pull: {
        "data.$.products": { id: itemId },
      },
    }
  );
  if (!updatedDiary) {
    return res.status(404).json({ error: "Item not found on the specified date" });
  }

  return res.status(200).json({ message: "Item deleted successfully" });
};

export default {
  addExercise: ctrlWrapper(addExercise),
  addProduct: ctrlWrapper(addProduct),
  getInfo: ctrlWrapper(getInfoAboutDay),
  deleteExerciseById: ctrlWrapper(deleteExerciseById),
  deleteProductById: ctrlWrapper(deleteProductById),
};
