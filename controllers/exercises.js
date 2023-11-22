import { HttpErr } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import Exercise from "../models/Exercise.js";
import ExerciseFilter from "../models/ExerciseFilter.js";

const getAllExercises = async (req, res) => {
  const exercises = await Exercise.find({});
  res.json(exercises);
};

const getAllExerciseFilters = async (req, res) => {
  const exerciseFilters = await ExerciseFilter.find();
  res.json(exerciseFilters);
};

export default {
  getAllExercises: ctrlWrapper(getAllExercises),
  getAllExerciseFilters: ctrlWrapper(getAllExerciseFilters),
};
