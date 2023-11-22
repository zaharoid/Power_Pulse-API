import { calculateBMR, HttpErr } from "../helpers/index.js";
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
  const calculations = calculateBMR(req.body);
  const result = await UserData.create({ ...req.body, ...calculations, owner });
  res.status(201).json(result);
};

const updateById = async (req, res) => {
  const { _id: owner } = req.user;

  const result = await UserData.findOneAndUpdate({ owner }, req.body);
  if (!result) {
    throw HttpErr(400, "Calculations is empty");
  }

  const calculations = calculateBMR(result);
  const calculatedResult = await UserData.findOneAndUpdate(
    { owner },
    calculations
  );
  res.json(calculatedResult);
};

export default {
  add: ctrlWrapper(add),
  updateById: ctrlWrapper(updateById),
};
