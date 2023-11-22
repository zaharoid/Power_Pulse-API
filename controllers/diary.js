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

  const existingDiary = await Diary.findOne({
    owner: userId,
  });

  const burnedCalories = ((exerciseToAdd.burnedCalories / 3) * time).toFixed(1);
  const existingDiaryByDay = await Diary.findOne({
    owner: userId,
    "days.date": date,
  });

  if (existingDiaryByDay) {
    const existingExercise = existingDiaryByDay.days
      .find((day) => day.date === date)
      .exercises.find(({ exercise }) => exercise.toString() === id);

    if (existingExercise) {
      await Diary.findOneAndUpdate(
        { owner: userId, "days.date": date },
        {
          $inc: {
            "days.$[dateEntry].exercises.$[exerciseEntry].time": time,
            "days.$[dateEntry].exercises.$[exerciseEntry].burnedCalories":
              burnedCalories,
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
      { owner: userId, "days.date": date },

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

  const exercise = await Exercise.findById(id, "-time -burnedCalories");

  return res.status(201).json({ exercise, time, burnedCalories });
};

const addProduct = async (req, res) => {
  const { _id: userId } = req.user;
  const { weight, date } = req.body;
  const burnedCalories = 0;
  const { id } = req.params;

  const productToAdd = await Product.findById(id);

  if (!productToAdd) {
    throw HttpErr(400, "Product not found.");
  }

  const consumedCalories = (
    (productToAdd.calories / productToAdd.weight) *
    weight
  ).toFixed(1);

  const existingDiary = await Diary.findOne({
    owner: userId,
  });

  const existingDiaryByDay = await Diary.findOne({
    owner: userId,
    "days.date": date,
  });

  if (existingDiaryByDay) {
    const existingDayIndex = existingDiaryByDay.days.findIndex(
      (entry) => entry.date === date
    );
    if (existingDayIndex !== -1) {
      const productIndex = existingDiaryByDay.days[
        existingDayIndex
      ].products.findIndex(({ product }) => product.toString() === id);

      if (productIndex !== -1) {
        await Diary.findOneAndUpdate(
          { owner: userId, "days.date": date },
          {
            $inc: {
              [`days.${existingDayIndex}.products.${productIndex}.weight`]:
                weight,
              [`days.${existingDayIndex}.products.${productIndex}.consumedCalories`]:
                consumedCalories,
            },
          },
          { new: true, useFindAndModify: false }
        );

        return res.status(200).json({ message: "Update successful" });
      }
      await Diary.findOneAndUpdate(
        { owner: userId, "days.date": date },
        {
          $push: {
            ["days." + existingDayIndex + ".products"]: {
              product: id,
              weight,
              consumedCalories,
            },
          },
        },
        { new: true, useFindAndModify: false }
      );
    }
  } else {
    await createNewDay(req, existingDiary, burnedCalories, consumedCalories);
  }

  return res
    .status(201)
    .json({ product: productToAdd, weight, consumedCalories });
};

const getInfoAboutDay = async (req, res) => {
  const { _id: owner } = req.user;
  const { date } = req.query;
  if (date) {
    const day = await Diary.findOne(
      { owner, "days.date": date },
      { "days.$": 1 }
    )
      .populate("days.exercises.exercise")
      .populate("days.products.product");

    if (!day) return res.status(200).json({ message: "Day is empty" });
    return res.status(200).json(day);
  }

  const diary = await Diary.findOne({ owner });

  return res.status(200).json(diary);
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
      .status(400)
      .json({ error: "Item not found on the specified date" });
  }

  return res.status(200).json({ message: "Delete successful" });
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
      .status(400)
      .json({ error: "Item not found on the specified date" });
  }

  return res.status(200).json({ message: "Delete successful" });
};

export default {
  addExercise: ctrlWrapper(addExercise),
  addProduct: ctrlWrapper(addProduct),
  getInfo: ctrlWrapper(getInfoAboutDay),
  deleteExerciseById: ctrlWrapper(deleteExerciseById),
  deleteProductById: ctrlWrapper(deleteProductById),
};
