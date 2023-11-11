import express from "express";

import authController from "../../controllers/auth-controller.js";

import { isEmptyBody } from "../../middlewars/index.js";

import { validateBody } from "../../decorators/index.js";

import { userSignupSchema, userSigninSchema } from "../../models/User.js";

const userSignupValidate = validateBody(userSignupSchema);
const userSigninValidate = validateBody(userSigninSchema);

const authRouter = express.Router();
// authRouter.use(authenticate);
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

export default authRouter;
