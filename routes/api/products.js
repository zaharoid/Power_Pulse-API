import express from "express";
import { authenticate } from "../../middlewares/index.js";
import ctrl from "../../controllers/products.js";

const productsRouter = express.Router();

productsRouter.get("/", authenticate, ctrl.getAllProducts);

export default productsRouter;
