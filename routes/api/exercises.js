import express from "express";
import exercisesController from "../../controllers/exercises.js";

const router = express.Router();

router.get('/', exercisesController.getAllExercises);
router.get('/details', exercisesController.getAllDetails);

export default router;