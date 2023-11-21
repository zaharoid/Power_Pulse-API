import moment from "moment";
import Diary from "../models/Diary.js";

const createNewDay = async (req, usersDiary, burnedCalories) => {
  const { time, weight } = req.body;
  const { id } = req.params;

  const newDay = req.body.time
    ? {
        date: moment().format("DD.MM.YYYY"),
        exercises: [{ time, exercise: id, burnedCalories }],
      }
    : {
        date: moment().format("DD.MM.YYYY"),
        products: [{ weight, product: id }],
      };

  await Diary.findByIdAndUpdate(
    usersDiary._id,
    { $push: { days: newDay } },
    { new: true, useFindAndModify: false }
  );
};

export default createNewDay;
