import express from "express";

import dairyCtrl from "../../controllers/dairy.js";

const dairyRouter = express.Router();

dairyRouter.post(
    "/createDay",
    dairyCtrl.createDay
);

export default dairyRouter;