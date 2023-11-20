// import { array } from "joi";
import { Schema, model } from "mongoose";
// import { exerciseSchema } from "./Exercise.js";
// import { productSchema } from "./Product.js";

const exerciseSchema = new Schema(
  {
    exercise: {
      type: Schema.Types.ObjectId,
      ref: "exercise",
      require: true,
    },
    time: {
      type: Number,
      require: true,
    },
  },
  { _id: false }
);

const productSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "product",
      require: true,
    },
    weight: {
      type: Number,
      require: true,
    },
  },
  { _id: false }
);

const daySchema = new Schema(
  {
    date: {
      type: String,
      require: true,
    },
    exercises: [exerciseSchema],
    products: [productSchema],
  },
  { _id: false }
);

const diarySchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
    require: true,
  },
  days: [daySchema],
});

const Diary = model("diary", diarySchema);
export default Diary;
