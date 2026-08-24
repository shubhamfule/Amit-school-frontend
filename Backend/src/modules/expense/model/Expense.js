const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true, default: Date.now },
    expense: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["Utility", "Office", "Transport", "Maintenance", "Other"],
      default: "Other",
    },
    amount: { type: Number, required: true, min: 0.01 },
    mode: { type: String, enum: ["Cash", "Bank", "UPI"], required: true },
    paymentProof: { type: String },
    notes: { type: String, trim: true },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);
