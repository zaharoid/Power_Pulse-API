import express from "express";
import { authenticate, isEmptyBody } from "../../middlewares/index.js";
import userDataController from "../../controllers/userData.js";
import authController from "../../controllers/auth.js";
import { userStatSchema, userStatUpdateSchema } from "../../models/userData.js";
import { userUpdateSchema } from "../../models/User.js";
import validateBody from "../../decorators/validateBody.js";

const userUpdateSchemaValidate = validateBody(userUpdateSchema);
const userStatSchemaValidate = validateBody(userStatSchema);
const userStatUpdateSchemaValidate = validateBody(userStatUpdateSchema);

const userDataRouter = express.Router();
userDataRouter.post(
  "/",
  authenticate,
  isEmptyBody,
  userStatSchemaValidate,
  userDataController.add
);
userDataRouter.patch(
  "/",
  isEmptyBody,
  authenticate,
  userStatUpdateSchemaValidate,
  userDataController.updateById
);
userDataRouter.patch(
  "/info",
  authenticate,
  isEmptyBody,
  userUpdateSchemaValidate,
  authController.updateUserInfo
);

export default userDataRouter;
