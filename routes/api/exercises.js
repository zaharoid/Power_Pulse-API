import express from "express";
import { authenticate } from "../../middlewares/index.js";
import exercisesController from "../../controllers/exercises.js";

const router = express.Router();

router.get('/', authenticate, exercisesController.getAllExercises);
router.get('/details', authenticate, exercisesController.getAllDetails);

export default router;


