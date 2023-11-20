import express from "express";
import { authenticate } from "../../middlewares/index.js";
import exercisesController from "../../controllers/exercises.js";

const exercisesRouter = express.Router();

exercisesRouter.get("/", authenticate, exercisesController.getAllExercises);
exercisesRouter.get(
  "/details",
  authenticate,
  exercisesController.getAllDetails
);
exercisesRouter.get(
  "/filters",
  authenticate,
  exercisesController.getAllExerciseFilters
);

export default exercisesRouter;
