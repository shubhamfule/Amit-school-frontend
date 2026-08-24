const mongoose = require("mongoose");

const markSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam" },
    testName: { type: String, trim: true },
    subject: { type: String, required: true, trim: true },
    term: { type: String, enum: ["unit1", "unit2", "term1", "term2", "final"] },
    marksObtained: { type: Number, required: true, min: 0 },
    maxMarks: { type: Number, default: 100, min: 1 },
  },
  { timestamps: true }
);

// Computed, never stored (Phase 1 mapping: grade/status derived from marksObtained/maxMarks).
function gradeFor(pct) {
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B";
  if (pct >= 60) return "C";
  return "D";
}

markSchema.virtual("percentage").get(function percentage() {
  return Math.round((this.marksObtained / this.maxMarks) * 100 * 100) / 100;
});
markSchema.virtual("grade").get(function grade() {
  return gradeFor(this.percentage);
});
markSchema.virtual("status").get(function status() {
  if (this.percentage < 35) return "fail";
  return this.percentage >= 60 ? "pass" : "average";
});
markSchema.set("toJSON", { virtuals: true });
markSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Mark", markSchema);
