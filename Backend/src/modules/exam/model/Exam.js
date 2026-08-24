const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true, trim: true },
    class: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, trim: true },
    room: { type: String, trim: true },
    syllabus: { type: String, trim: true },
    status: { type: String, enum: ["upcoming", "completed"], default: "upcoming" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exam", examSchema);
