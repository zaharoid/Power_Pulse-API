import Diary from "../models/Diary.js";
import Exercise from "../models/Exercise.js";
import Product from "../models/Product.js";

const createNewDay = async (
  req,
  usersDiary,
  burnedCalories,
  consumedCalories
) => {
  const { time, weight, date } = req.body;
  const { id } = req.params;

  const newDay = time
    ? {
        date,
        exercises: [{ time, exercise: id, burnedCalories }],
      }
    : {
        date,
        products: [{ weight, product: id, consumedCalories }],
      };

  await Diary.findByIdAndUpdate(
    usersDiary._id,
    { $push: { days: newDay } },
    { new: true, useFindAndModify: false }
  );
};

export default createNewDay;
