const mongoose = require("mongoose");

const installmentSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    dueDate: { type: Date, required: true },
    paidAmount: { type: Number, default: 0, min: 0 },
    paidDate: { type: Date },
    status: { type: String, enum: ["Paid", "Pending", "Overdue"], default: "Pending" },
  },
  { _id: true }
);

const studentFeeSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    academicYear: { type: String, required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    installments: { type: [installmentSchema], default: [] },
  },
  { timestamps: true }
);

studentFeeSchema.index({ studentId: 1, academicYear: 1 }, { unique: true });

// Computed, never independently stored — replaces the frontend's redundant
// stored `pending`/`feeStatus` fields (Phase 1 mapping).
studentFeeSchema.virtual("paid").get(function paid() {
  return this.installments.reduce((sum, i) => sum + i.paidAmount, 0);
});
studentFeeSchema.virtual("due").get(function due() {
  return Math.max(0, this.totalAmount - this.paid);
});
studentFeeSchema.virtual("status").get(function status() {
  if (this.due <= 0) return "Paid";
  const overdue = this.installments.some(
    (i) => i.status !== "Paid" && new Date(i.dueDate) < new Date()
  );
  return overdue ? "Overdue" : "Pending";
});
studentFeeSchema.set("toJSON", { virtuals: true });
studentFeeSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("StudentFee", studentFeeSchema);
