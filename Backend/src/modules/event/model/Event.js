const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    date: { type: Date, required: true },
    time: { type: String, trim: true },
    venue: { type: String, trim: true },
    type: {
      type: String,
      enum: ["due", "holiday", "meeting", "bookfair", "workshop", "academic", "sports"],
    },
    status: {
      type: String,
      enum: ["Scheduled", "Upcoming", "Completed", "Cancelled"],
      default: "Scheduled",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
