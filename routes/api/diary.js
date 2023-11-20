import express from "express";
import diaryCtrl from "../../controllers/diary.js";
import { validateBody } from "../../decorators/index.js";
import { dateSchema, addExerciseSchema, addProductSchema, deleteSchema } from "../../models/Day.js";
import { authenticate, isEmptyBody }  from "../../middlewares/index.js";


const dateSchemaValidate = validateBody(dateSchema);
const addExerciseSchemaValidate = validateBody(addExerciseSchema);
const addProductSchemaValidate = validateBody(addProductSchema);
const deleteSchemaValidate = validateBody(deleteSchema);

const diaryRouter = express.Router();

diaryRouter.get(
    "/day",
    authenticate,
    isEmptyBody,
    dateSchemaValidate,
    diaryCtrl.getInfo
)

diaryRouter.patch(
    "/exercise",
    authenticate,
    isEmptyBody,
    
    diaryCtrl.addExercise
)

diaryRouter.patch(
    "/product",
    authenticate,
    isEmptyBody,
    addProductSchemaValidate,
    diaryCtrl.addProduct
);

diaryRouter.delete(
    "/exercise",
    authenticate,
    isEmptyBody,
    deleteSchemaValidate,
    diaryCtrl.deleteExerciseById
)

diaryRouter.delete(
    "/product",
    authenticate,
    isEmptyBody,
    deleteSchemaValidate,
    diaryCtrl.deleteProductById
)

export default diaryRouter;