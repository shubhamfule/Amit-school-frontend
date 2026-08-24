const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, trim: true }, // N, LKG, UKG, 1..10
    label: { type: String, required: true, trim: true },
    sections: { type: [String], default: [] },
    classTeacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Class", classSchema);
