const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    class: { type: String, required: true },
    dueDate: { type: Date, required: true },
    description: { type: String, trim: true },
    status: { type: String, enum: ["Active", "Completed", "Archived"], default: "Active" },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assignment", assignmentSchema);
