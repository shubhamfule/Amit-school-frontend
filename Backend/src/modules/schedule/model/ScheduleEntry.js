const mongoose = require("mongoose");

const scheduleEntrySchema = new mongoose.Schema(
  {
    dayOfWeek: {
      type: String,
      enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      required: true,
    },
    startTime: { type: String, required: true, trim: true }, // "HH:mm"
    endTime: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    class: { type: String, required: true },
    room: { type: String, trim: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true },
    status: { type: String, enum: ["Upcoming", "Ongoing", "Completed"], default: "Upcoming" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ScheduleEntry", scheduleEntrySchema);
