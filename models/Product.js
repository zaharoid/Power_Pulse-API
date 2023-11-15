import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    weight: {
      type: Number,
      required: true,
    },
    calories: {
      type: Number,
      required: true,
    },
    category: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    groupBloodNotAllowed: {
      type: Object,
    },
  },
  { versionKey: false, timestamps: true }
);

const Products = model("products", productSchema);

export default Products;
