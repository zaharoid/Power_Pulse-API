import { Schema, model } from "mongoose";

const exerciseSchema = new Schema(
  {
    exercise: {
      type: Schema.Types.ObjectId,
      ref: "exercise",
      required: true,
    },
    time: {
      type: Number,
      required: true,
    },
    burnedCalories: {
      type: Number,
      required: true,
    },
  },
  { _id: false, versionKey: false }
);

const productSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    consumedCalories: {
      type: Number,
      required: true,
    },
  },
  { _id: false, versionKey: false }
);

const daySchema = new Schema(
  {
    date: {
      type: String,
      required: true,
    },
    exercises: [exerciseSchema],
    products: [productSchema],
  },
  { _id: false, versionKey: false }
);

const diarySchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    days: [daySchema],
  },
  { versionKey: false }
);

const Diary = model("diary", diarySchema);
export default Diary;
