import express from "express";

import authController from "../../controllers/auth.js";

import { isEmptyBody, authenticate, upload } from "../../middlewares/index.js";

import { validateBody } from "../../decorators/index.js";

import {
  userSignupSchema,
  userSigninSchema,
  userUpdateSchema,
} from "../../models/User.js";

const userSignupValidate = validateBody(userSignupSchema);
const userSigninValidate = validateBody(userSigninSchema);
const userUpdateValidate = validateBody(userUpdateSchema);

const authRouter = express.Router();

authRouter.get("/current", authenticate, authController.getCurrent);
authRouter.post(
  "/signup",
  isEmptyBody,
  userSignupValidate,
  authController.signup
);
authRouter.post(
  "/signin",
  isEmptyBody,
  userSigninValidate,
  authController.signin
);
authRouter.patch(
  "/avatar",
  authenticate,
  upload.single("avatar"),
  authController.updateAvatar
);
authRouter.post("/logout", authenticate, authController.logout);

authRouter.patch(
  "/info",
  authenticate,
  isEmptyBody,
  userUpdateValidate,
  authController.updateUserInfo
);

authRouter.post(
  "/avatar",
  authenticate,
  upload.single("avatar"),
  authController.addAvatar
);

export default authRouter;
