const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    personId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "personType" },
    personType: { type: String, enum: ["Student", "Staff"], required: true },
    class: { type: String }, // denormalized, only meaningful for Student attendance
    date: { type: Date, required: true },
    status: { type: String, enum: ["present", "absent", "leave", "holiday"], required: true },
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    remarks: { type: String, trim: true },
  },
  { timestamps: true }
);

attendanceSchema.index({ personId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
