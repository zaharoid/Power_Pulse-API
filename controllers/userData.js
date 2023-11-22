import { HttpErr } from "../helpers/index.js";
import UserData, {
  userStatSchema,
  userStatUpdateSchema,
} from "../models/userData.js";
import { ctrlWrapper } from "../decorators/index.js";

const add = async (req, res) => {
  const { _id: owner } = req.user;

  const userData = await UserData.findOne({ owner });

  if (userData) {
    throw HttpErr(400, "User's data already exist");
  }

  const result = await UserData.create({ ...req.body, owner });
  res.status(201).json(result);
};

const calculateCalories = async (req, res) => {
  const { _id: owner } = req.user;

  const calculations = await UserData.find({ owner });
  if (!calculations) {
    throw HttpErr(400, "Calculations is empty");
  }

  const {
    height,
    currentWeight,
    desiredWeight,
    birthday,
    blood,
    sex,
    levelActivity,
  } = calculations[0];
  const activityCoefficients = {
    1: 1.2,
    2: 1.375,
    3: 1.55,
    4: 1.725,
    5: 1.9,
  };
  const activityCoefficient = activityCoefficients[levelActivity];
  const isMale = sex === "male";
  const baseMetabolicRate = isMale
    ? (10 * currentWeight +
        6.25 * height -
        5 * (new Date().getFullYear() - new Date(birthday).getFullYear()) +
        5) *
      activityCoefficient
    : (10 * currentWeight +
        6.25 * height -
        5 * (new Date().getFullYear() - new Date(birthday).getFullYear()) -
        161) *
      activityCoefficient;

  const dailyCalories = baseMetabolicRate * activityCoefficient;
  const dailyExerciseTime = 110;

  res.status(200).json({
    dailyCalories,
    dailyExerciseTime,
  });
};
const updateById = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await UserData.findOneAndUpdate({ owner }, req.body);
  console.log(result);

  if (!result) {
    throw HttpErr(400, "Calculations is empty");
  }
  res.json(result);
};

export default {
  add: ctrlWrapper(add),
  calculateCalories: ctrlWrapper(calculateCalories),
  updateById: ctrlWrapper(updateById),
};
