import  express  from "express";

import authController from "../../controllers/auth-controller.js";

import { isEmptyBody } from "../../middlewars/index.js"

import { validateBody } from "../../decorators/index.js"; 

import { userSignupSchema, userSigninSchema} from "../../models/user.js";

const userSignupValidate = validateBody(userSignupSchema);

const authRouter = express.Router();

authRouter.post("/signup", isEmptyBody, userSignupValidate, authController.signup);

export default authRouter;