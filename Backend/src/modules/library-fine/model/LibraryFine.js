const mongoose = require("mongoose");

const libraryFineSchema = new mongoose.Schema(
  {
    issueId: { type: mongoose.Schema.Types.ObjectId, ref: "BookIssue", required: true },
    overdueDays: { type: Number, default: 0, min: 0 },
    overdueFineAmount: { type: Number, default: 0, min: 0 },
    damageType: {
      type: String,
      enum: ["No Damage", "Torn Pages", "Missing Pages", "Water Damage", "Lost Book"],
      default: "No Damage",
    },
    damageFineAmount: { type: Number, default: 0, min: 0 },
    remarks: { type: String, trim: true },
    status: { type: String, enum: ["Pending", "Cleared"], default: "Pending" },
    clearedAt: { type: Date },
  },
  { timestamps: true }
);

// Never stored — confirmed by the frontend's own code comment that this is always computed.
libraryFineSchema.virtual("totalFine").get(function totalFine() {
  return this.overdueFineAmount + this.damageFineAmount;
});
libraryFineSchema.set("toJSON", { virtuals: true });
libraryFineSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("LibraryFine", libraryFineSchema);
