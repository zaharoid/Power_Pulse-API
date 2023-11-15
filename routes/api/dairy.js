import express from "express";

import dairyCtrl from "../../controllers/dairy.js";

import { validateBody } from "../../decorators/index.js";

import { daySchema, dayInfoSchema, dayStingSchema } from "../../models/Day.js";

import authenticate from "../../middlewars/authenticate.js";

const daySchemaValidate = validateBody(daySchema);
const dayInfoSchemaValidate = validateBody(dayInfoSchema);
const dayStringValidate = validateBody(dayStingSchema);

const dairyRouter = express.Router();

dairyRouter.get(
    "/getInfo",
    authenticate,
    dayStringValidate,
    dairyCtrl.getInfo
)

dairyRouter.patch(
    "/addExercise",
    authenticate,
    dayInfoSchemaValidate,
    dairyCtrl.addExercise
)

export default dairyRouter;