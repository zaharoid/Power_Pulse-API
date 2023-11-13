import express from "express";
import {authenticate, isEmptyBody,} from "../../middlewars/index.js";
import calcUserController from "../../controllers/calcUserController.js";





const calcUserRouter = express.Router();
// calcUserRouter.get('/', authenticate, calcUserController.schow);
calcUserRouter.get('/', authenticate, calcUserController.calculateCalories);

calcUserRouter.post('/', authenticate, isEmptyBody, calcUserController.add);
calcUserRouter.put('/:calcId', authenticate, calcUserController.updateById);

export default calcUserRouter;

