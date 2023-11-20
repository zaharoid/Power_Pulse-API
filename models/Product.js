import { Schema, model } from "mongoose";

export const productSchema = new Schema(
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
      type: String,
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

const Products = model("product", productSchema);

export default Products;
