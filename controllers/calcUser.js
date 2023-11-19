import { HttpErr } from "../helpers/index.js";
import MongusModel, { userCalcSchema, userCalcUpdateSchema } from "../models/calcUser.js";
import { ctrlWrapper } from "../decorators/index.js";

const add = async (req, res) => {
  const { error } = userCalcSchema.validate(req.body);
    if (error) {
      throw HttpErr(400, error.message);
    }
  const { _id: owner } = req.user;
  const result = await MongusModel.create({ ...req.body, owner });
  res.status(201).json(result);
};

const calculateCalories = async (req, res) => {
  const { _id: owner } = req.user;
  try {
    const calculations = await MongusModel.find({ owner });
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
      ? 10 * currentWeight +
        6.25 * height -
        5 * new Date(birthday).getFullYear() +
        5
      : 10 * currentWeight +
        6.25 * height -
        5 * new Date(birthday).getFullYear() -
        161;

    const dailyCalories = baseMetabolicRate * activityCoefficient;
    const dailyExerciseTime = 110;

    res.status(200).json({
      dailyCalories,
      dailyExerciseTime,
    });
  } catch (error) {
    console.error("Error calculating calories:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const updateById = async (req, res, next) => {
  try {
    const { error } = userCalcUpdateSchema.validate(req.body);
    if (error) {
      throw HttpErr(400, error.message);
    }
    const { calcId } = req.params;
    const result = await MongusModel.findByIdAndUpdate(calcId, req.body);

    if (!result) {
      throw HttpErr(400, "Not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export default {
  add: ctrlWrapper(add),
  calculateCalories: ctrlWrapper(calculateCalories),
  updateById: ctrlWrapper(updateById),
};
