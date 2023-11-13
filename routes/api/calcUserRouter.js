import express from "express";
import {authenticate, isEmptyBody,} from "../../middlewars/index.js";
import calcUserController from "../../controllers/calcUserController.js";

const calcUserRouter = express.Router();


calcUserRouter.get('/', calcUserController.schow);
calcUserRouter.post('/', authenticate, isEmptyBody, calcUserController.add);

export default calcUserRouter;

