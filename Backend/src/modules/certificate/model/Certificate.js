const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["excellence", "academic", "sports", "participation"],
      required: true,
    },
    issuer: { type: String, trim: true },
    date: { type: Date, required: true },
    fileUrl: { type: String, trim: true }, // placeholder — real upload is out of scope
  },
  { timestamps: true }
);

module.exports = mongoose.model("Certificate", certificateSchema);
