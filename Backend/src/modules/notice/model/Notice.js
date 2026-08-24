const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },
    priority: { type: String, enum: ["high", "medium", "low"], default: "medium" },
    audience: { type: [String], default: ["All"] },
    category: { type: String, enum: ["event", "academic", "holiday", "urgent"] },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notice", noticeSchema);
