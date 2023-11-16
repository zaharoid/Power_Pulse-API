import express from "express";
import logger from "morgan";
import cors from "cors";

import authRouter from "./routes/api/auth.js";
import productsRouter from "./routes/api/products.js";

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json" assert { type: "json" };
import "dotenv/config";

import { default as exercisesRouter } from ".//routes/api/exercises.js";
import dairyRouter from "./routes/api/dairy.js";

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/exercises", exercisesRouter);
app.use("/api/dairy", dairyRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

export default app;
