import express from "express";

import dairyCtrl from "../../controllers/dairy.js";

import { validateBody } from "../../decorators/index.js";

import { daySchema, dayInfoSchema, dayStingSchema, deleteSchema } from "../../models/Day.js";

import authenticate from "../../middlewars/authenticate.js";

const daySchemaValidate = validateBody(daySchema);
const dayInfoSchemaValidate = validateBody(dayInfoSchema);
const dayStringValidate = validateBody(dayStingSchema);
const deleteSchemaValidate = validateBody(deleteSchema);

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

dairyRouter.patch(
    "/addProduct",
    authenticate,
    dayInfoSchemaValidate,
    dairyCtrl.addProduct
);

dairyRouter.delete(
    "/deleteSmth",
    authenticate,
    deleteSchemaValidate,
    dairyCtrl.deleteSmth
)

export default dairyRouter;