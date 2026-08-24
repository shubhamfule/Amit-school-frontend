const mongoose = require("mongoose");

// Write-only audit ledger, populated by the Fee Payment / Salary Payment / Expense
// services at creation time — never edited directly (Phase 1 mapping decision).
const transactionSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["Fee Collection", "Salary Payment", "Expense"], required: true },
    refId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "refModel" },
    refModel: { type: String, enum: ["FeePayment", "SalaryPayment", "Expense"], required: true },
    name: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
    method: { type: String, trim: true },
    status: { type: String, enum: ["Completed", "Pending"], default: "Completed" },
    date: { type: Date, required: true, default: Date.now },
    class: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
