import moment from "moment";
import Diary from "../models/Diary.js";

const createNewDay = async (
  req,
  usersDiary,
  burnedCalories,
  consumedCalories
) => {
  const { time, weight, date } = req.body;
  const { id } = req.params;

  const newDay = req.body.time
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
  ).populate("days.exercises.exercise");
};

export default createNewDay;
