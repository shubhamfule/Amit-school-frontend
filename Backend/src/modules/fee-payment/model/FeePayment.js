const mongoose = require("mongoose");

const feePaymentSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    studentFeeId: { type: mongoose.Schema.Types.ObjectId, ref: "StudentFee", required: true },
    installmentId: { type: mongoose.Schema.Types.ObjectId, required: true },
    installmentLabel: { type: String, required: true },
    amount: { type: Number, required: true, min: 0.01 },
    method: { type: String, enum: ["Online", "Bank Transfer", "Cash", "UPI"], required: true },
    paidAt: { type: Date, required: true, default: Date.now },
    receiptNo: { type: String, unique: true },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FeePayment", feePaymentSchema);
