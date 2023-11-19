import { HttpErr } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import Exercise from "../models/Exercise.js";
import ExerciseFilter from "../models/ExerciseFilter.js";

const getAllExercises = async (req, res) => {
  const r = await Exercise.find({});
  res.json(r);
};

const getAllDetails = async (req, res) => {
  const allExercises = await Exercise.find({}, "bodyPart equipment target");
  const bodyParts = [];
  const targets = [];
  const equipments = [];

  allExercises.forEach((exercise) => {
    if (!bodyParts.includes(exercise.bodyPart))
      bodyParts.push(exercise.bodyPart);
    if (!targets.includes(exercise.target)) targets.push(exercise.target);
    if (!equipments.includes(exercise.equipment))
      equipments.push(exercise.equipment);
  });
  res.json({ bodyParts, targets, equipments });
};

const getAllExerciseFilters = async (req, res) => {
  // const { type } = req.query;
  // if (!type) {
  //   throw HttpErr(400);
  // }
  const r = await ExerciseFilter.find();
  res.json(r);
};

export default {
  getAllExercises: ctrlWrapper(getAllExercises),
  getAllDetails: ctrlWrapper(getAllDetails),
  getAllExerciseFilters: ctrlWrapper(getAllExerciseFilters),
};
