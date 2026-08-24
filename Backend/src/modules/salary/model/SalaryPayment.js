const mongoose = require("mongoose");

const salaryPaymentSchema = new mongoose.Schema(
  {
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true },
    month: { type: String, required: true }, // "YYYY-MM"
    grossAmount: { type: Number, required: true, min: 0 },
    workingDays: { type: Number, required: true, min: 0 },
    presentDays: { type: Number, required: true, min: 0 },
    netAmount: { type: Number, required: true, min: 0 },
    paidAmount: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ["Paid", "Partial", "Pending"], default: "Pending" },
    paidAt: { type: Date },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

salaryPaymentSchema.index({ staffId: 1, month: 1 }, { unique: true });

salaryPaymentSchema.virtual("pending").get(function pending() {
  return Math.max(0, this.netAmount - this.paidAmount);
});
salaryPaymentSchema.set("toJSON", { virtuals: true });
salaryPaymentSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("SalaryPayment", salaryPaymentSchema);
