import moment from "moment";

import Diary from "../models/Diary.js";
import { ctrlWrapper } from "../decorators/index.js";
import { createNewDay } from "../helpers/index.js";

const addExercise = async (req, res) => {
  const { _id: userId } = req.user;
  const usersDiary = await Diary.findOne({ owner: userId });

  const formattedDate = moment().format("DD.MM.YYYY");
  const existingDiary = await Diary.findOne({
    owner: userId,
    "days.date": formattedDate,
  });

  if (existingDiary) {
    const { exerciseId } = req.body;

    const existingExercise = existingDiary.days
      .find((entry) => entry.date === formattedDate)
      .exercises.find((exercise) => exercise.id === exerciseId);

    if (existingExercise) {
      console.log(existingExercise);

      await Diary.findOneAndUpdate(
        { owner: userId, "days.date": formattedDate },
        {
          $inc: {
            "days.$[dateEntry].exercises.$[exerciseEntry].time":
              req.body.exercises.time,
          },
        },
        {
          new: true,
          arrayFilters: [
            { "dateEntry.date": formattedDate },
            { "exerciseEntry.exercise": exerciseId },
          ],
        }
      );

      return res.status(200).json({ message: "Update successful" });
    }

    await Diary.findOneAndUpdate(
      { owner: userId, "days.date": formattedDate },
      { $push: { "days.$.exercises": { ...req.body.exercises } } },
      { new: true, useFindAndModify: false }
    );
  } else {
    await createNewDay(req, usersDiary);
  }

  return res.status(201).json(req.body.exercises);
};

const addProduct = async (req, res) => {
  const { _id: userId } = req.user;

  console.log(1);
  const usersDiary = await Diary.findOne({ owner: userId });
  const formattedDate = moment().format("DD.MM.YYYY");

  const existingDay = await Diary.findOne({
    owner: userId,
    "days.date": formattedDate,
  });
  console.log(2);

  if (existingDay) {
    const productId = req.body.products.product;
    const existingProductIndex = existingDay.days.findIndex(
      (entry) => entry.date === formattedDate
    );

    if (existingProductIndex !== -1) {
      console.log(3);
      const productIndex = existingDay.days[
        existingProductIndex
      ].products.findIndex((product) => product.id === productId);

      if (productIndex !== -1) {
        // Update the weight of the existing product
        await Diary.findOneAndUpdate(
          { owner: userId, "days.date": formattedDate },
          {
            $inc: {
              [`days.${existingProductIndex}.products.${productIndex}.weight`]:
                req.body.products.weight,
            },
          },
          { new: true, useFindAndModify: false }
        );

        return res.status(200).json({ message: "Update successful" });
      }
      console.log(4);
      // Add a new product if the product ID doesn't exist
      await Diary.findOneAndUpdate(
        { owner: userId, "days.date": formattedDate },
        {
          $push: {
            ["days." + existingProductIndex + ".products"]: {
              ...req.body.products,
            },
          },
        },
        { new: true, useFindAndModify: false }
      );
      console.log(5);
    }
  } else {
    await createNewDay(req, usersDiary);
  }
  return res.status(201).json({ ...req.body });
};

const getInfoAboutDay = async (req, res) => {
  const { _id: userId } = req.user;

  const dateOfDay = req.body.date;
  const day = await Diary.findOne(
    { owner: userId, "days.date": dateOfDay },
    { "days.$": 1 }
  ).populate();

  if (!day) return res.status(404).json({ message: "Day is empty" });
  return res.status(200).json(day);
};

const deleteExerciseById = async (req, res) => {
  const { _id: userId } = req.user;
  const itemId = req.body.id;
  const dateToDelete = req.body.date;

  const updatedDiary = await Diary.findOneAndUpdate(
    {
      owner: userId,
      "days.date": dateToDelete,
      "days.exercises.exercise": itemId,
    },
    {
      $pull: {
        "days.$.exercises": { exercise: itemId },
      },
    }
  );
  if (!updatedDiary) {
    return res
      .status(404)
      .json({ error: "Item not found on the specified date" });
  }

  return res.status(200).json({ message: "Item deleted successfully" });
};

const deleteProductById = async (req, res) => {
  const { _id: userId } = req.user;
  const itemId = req.body.id;
  const dateToDelete = req.body.date;

  const updatedDiary = await Diary.findOneAndUpdate(
    {
      owner: userId,
      "days.date": dateToDelete,
      "days.products.product": itemId,
    },
    {
      $pull: {
        "days.$.products": { product: itemId },
      },
    }
  );
  if (!updatedDiary) {
    return res
      .status(404)
      .json({ error: "Item not found on the specified date" });
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
