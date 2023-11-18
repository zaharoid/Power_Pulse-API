import { Schema, model } from "mongoose";

const exerciseFilterSchema = new Schema({
  filter: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  imgURL: {
    type: String,
    required: true,
  }
}, { versionKey: false });

const ExerciseFilter = model("filter", exerciseFilterSchema);
export default ExerciseFilter;