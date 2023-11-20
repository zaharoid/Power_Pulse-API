import express from "express";
import { authenticate, isEmptyBody } from "../../middlewares/index.js";
import userDataController from "../../controllers/userData.js";
import { userStatSchema, userStatUpdateSchema } from "../../models/userData.js";
import validateBody from "../../decorators/validateBody.js";

const userStatSchemaValidate = validateBody(userStatSchema);
const userStatUpdateSchemaValidate = validateBody(userStatUpdateSchema);

const userDataRouter = express.Router();
userDataRouter.get("/", authenticate, userDataController.calculateCalories);
userDataRouter.post(
  "/",
  authenticate,
  userStatSchemaValidate,
  isEmptyBody,
  userDataController.add
);
userDataRouter.put(
  "/:calcId",
  authenticate,
  userStatUpdateSchemaValidate,
  userDataController.updateById
);

export default userDataRouter;
