import moment from "moment";
import Diary from "../models/Diary.js";

const createNewDay = async (req, usersDiary) => {
  const newDay = {
      date: moment().format("DD.MM.YYYY"),
      ...req.body,
    };

    await Diary.findByIdAndUpdate(
      usersDiary._id,
      { $push: { data: newDay } },
      { new: true, useFindAndModify: false }
);
}

 
export default createNewDay;