import express from "express";
import dairyCtrl from "../../controllers/dairy.js";
import { validateBody } from "../../decorators/index.js";
import { daySchema, dayInfoSchema, dayStingSchema, deleteSchema } from "../../models/Day.js";
import { authenticate, isEmptyBody }  from "../../middlewares/index.js";


const daySchemaValidate = validateBody(daySchema);
const dayInfoSchemaValidate = validateBody(dayInfoSchema);
const dayStringValidate = validateBody(dayStingSchema);
const deleteSchemaValidate = validateBody(deleteSchema);

const dairyRouter = express.Router();

dairyRouter.get(
    "/getInfo",
    authenticate,
    dairyCtrl.getInfo
)

dairyRouter.patch(
    "/addExercise",
    authenticate,
    isEmptyBody,
    dayInfoSchemaValidate,
    dairyCtrl.addExercise
)

dairyRouter.patch(
    "/addProduct",
    authenticate,
    isEmptyBody,
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