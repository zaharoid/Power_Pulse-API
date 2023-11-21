import moment from "moment";

import Diary from "../models/Diary.js";
import Product from "../models/Product.js";
import Exercise from "../models/Exercise.js";
import { ctrlWrapper } from "../decorators/index.js";
import { HttpErr, createNewDay } from "../helpers/index.js";

const addExercise = async (req, res) => {
  const { _id: userId } = req.user;
  const { id } = req.params;
  const { time, date } = req.body;

  const exerciseToAdd = await Exercise.findById(id);

  if (!exerciseToAdd) {
    throw HttpErr(400, "Exercise not found.");
  }

  const burnedCalories = (exerciseToAdd.burnedCalories / 3) * time;

  // const formattedDate = moment().format("DD.MM.YYYY");
  const existingDiary = await Diary.findOne({
    owner: userId,
    "days.date": formattedDate,
  });

  if (existingDiary) {
    const existingExercise = existingDiary.days
      .find((day) => day.date === date)
      .exercises.find(({ exercise }) => exercise.toString() === id);

    if (existingExercise) {
      await Diary.findOneAndUpdate(
        { owner: userId, "days.date": date },
        {
          $inc: {
            "days.$[dateEntry].exercises.$[exerciseEntry].time": time,
          },
        },
        {
          new: true,
          arrayFilters: [
            { "dateEntry.date": date },
            { "exerciseEntry.exercise": id },
          ],
        }
      );

      return res.status(200).json({ message: "Update successful" });
    }
    await Diary.findOneAndUpdate(
      { owner: userId, "days.date": formattedDate },
      {
        $push: {
          "days.$.exercises": {
            exercise: id,
            time: req.body.time,
            burnedCalories,
          },
        },
      },
      { new: true, useFindAndModify: false }
    );
  } else {
    await createNewDay(req, existingDiary, burnedCalories);
  }

  return res.status(201).json({ id, time, burnedCalories });
};

const addProduct = async (req, res) => {
  const { _id: userId } = req.user;
  const { id } = req.params;

  const formattedDate = moment().format("DD.MM.YYYY");

  const existingDiary = await Diary.findOne({
    owner: userId,
    "days.date": formattedDate,
  });

  if (existingDiary) {
    const existingDayIndex = existingDiary.days.findIndex(
      (entry) => entry.date === formattedDate
    );
    if (existingDayIndex !== -1) {
      const productIndex = existingDiary.days[
        existingDayIndex
      ].products.findIndex(({ product }) => product.toString() === id);

      if (productIndex !== -1) {
        await Diary.findOneAndUpdate(
          { owner: userId, "days.date": formattedDate },
          {
            $inc: {
              [`days.${existingDayIndex}.products.${productIndex}.weight`]:
                req.body.weight,
            },
          },
          { new: true, useFindAndModify: false }
        );

        return res.status(200).json({ message: "Update successful" });
      }
      await Diary.findOneAndUpdate(
        { owner: userId, "days.date": formattedDate },
        {
          $push: {
            ["days." + existingDayIndex + ".products"]: {
              product: id,
              ...req.body,
            },
          },
        },
        { new: true, useFindAndModify: false }
      );
    }
  } else {
    await createNewDay(req, usersDiary);
  }
  return res.status(201).json({ product: id, ...req.body });
};

const getInfoAboutDay = async (req, res) => {
  const { _id: userId } = req.user;

  const dateOfDay = req.body.date;
  const day = await Diary.findOne(
    { owner: userId, "days.date": dateOfDay },
    { "days.$": 1 }
  ).populate();

  if (!day) return res.status(200).json({ message: "Day is empty" });
  return res.status(200).json(day);
};

const deleteExerciseById = async (req, res) => {
  const { _id: userId } = req.user;
  const { id } = req.params;
  const { date } = req.body;

  const updatedDiary = await Diary.findOneAndUpdate(
    {
      owner: userId,
      "days.date": date,
      "days.exercises.exercise": id,
    },
    {
      $pull: {
        "days.$.exercises": { exercise: id },
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
  const { id } = req.params;
  const { date } = req.body;

  const updatedDiary = await Diary.findOneAndUpdate(
    {
      owner: userId,
      "days.date": date,
      "days.products.product": id,
    },
    {
      $pull: {
        "days.$.products": { product: id },
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
