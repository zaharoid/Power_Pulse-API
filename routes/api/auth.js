import express from "express";

import authController from "../../controllers/auth.js";

import {
  isEmptyBody,
  authenticate,
  upload,
  isEmptyFileBody,
} from "../../middlewares/index.js";

import { validateBody } from "../../decorators/index.js";

import { userSignupSchema, userSigninSchema } from "../../models/User.js";

const userSignupValidate = validateBody(userSignupSchema);
const userSigninValidate = validateBody(userSigninSchema);

const authRouter = express.Router();

authRouter.get("/current", authenticate, authController.getCurrent);
authRouter.post(
  "/signup",
  isEmptyBody,
  userSignupValidate,
  authController.signup
);
authRouter.get("/verify/:verificationCode", authController.verifyEmail);
authRouter.post(
  "/signin",
  isEmptyBody,
  userSigninValidate,
  authController.signin
);

authRouter.post("/logout", authenticate, authController.logout);

authRouter.post(
  "/avatar",
  authenticate,
  upload.single("avatar"),
  isEmptyFileBody,
  authController.addAvatar
);

export default authRouter;
