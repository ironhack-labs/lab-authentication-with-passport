const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const courseSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true,
      enum: ["Web Development", "UX/UI"]
    },
    model: {
      type: String,
      required: true,
      enum: ["Full Time", "Part Time"]
    },
    version: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);
module.exports = mongoose.model("Course", courseSchema);