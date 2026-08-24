const mongoose = require("mongoose");

const leaveApplicationSchema = new mongoose.Schema(
  {
    applicantId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "applicantType" },
    applicantType: { type: String, enum: ["Student", "Staff"], required: true },
    leaveType: {
      type: String,
      enum: [
        "Sick Leave",
        "Casual Leave",
        "Earned Leave",
        "Maternity/Paternity Leave",
        "Unpaid Leave",
        "Medical Leave",
        "Personal Leave",
        "Family Function",
        "Emergency",
        "Other",
      ],
      required: true,
    },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    reason: { type: String, required: true, trim: true },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    appliedOn: { type: Date, default: Date.now },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    code: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

// Computed, never stored — replaces the frontend's inconsistent stored/absent `days` field.
leaveApplicationSchema.virtual("days").get(function days() {
  const ms = new Date(this.toDate) - new Date(this.fromDate);
  return Math.max(1, Math.round(ms / 86400000) + 1);
});
leaveApplicationSchema.set("toJSON", { virtuals: true });
leaveApplicationSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("LeaveApplication", leaveApplicationSchema);
