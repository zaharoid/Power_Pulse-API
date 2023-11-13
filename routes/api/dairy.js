import express from "express";

import dairyCtrl from "../../controllers/dairy.js";

import { validateBody } from "../../decorators/index.js";

import { daySchema } from "../../models/Day.js";
import { dayInfoSchema } from "../../models/Day.js";

const daySchemaValidate = validateBody(daySchema);
const dayInfoSchemaValidate = validateBody(dayInfoSchema);

const dairyRouter = express.Router();

dairyRouter.post(
    "/createDay",
    daySchemaValidate,
    dairyCtrl.createDay
);

dairyRouter.patch(
    "/inputInfo",
    dayInfoSchemaValidate,
    dairyCtrl.inputInfo
)

export default dairyRouter;