const mongoose = require("mongoose");
const { getAcademicYear } = require("../../../utils/academicYear");

const staffSchema = new mongoose.Schema(
  {
    employeeCode: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    staffType: { type: String, enum: ["teaching", "non-teaching"], required: true },
    designation: { type: String, required: true, trim: true },
    department: { type: String, trim: true },
    classesAssigned: { type: [String], default: [] },
    mobile: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    joiningDate: { type: Date, required: true },
    monthlySalary: { type: Number, required: true, min: 0 },
    academicYear: { type: String },
    status: { type: String, enum: ["Active", "On Leave", "Inactive"], default: "Active" },
  },
  { timestamps: true }
);

staffSchema.pre("save", function setAcademicYear(next) {
  if (this.isModified("joiningDate") || !this.academicYear) {
    this.academicYear = getAcademicYear(this.joiningDate || Date.now());
  }
  next();
});

// "X Years Y Months" — computed on demand, never stored (Phase 1 mapping: Staff.experience).
staffSchema.methods.experience = function experience(asOf = new Date()) {
  const start = new Date(this.joiningDate);
  const end = new Date(asOf);
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return `${years} Years ${months} Months`;
};

module.exports = mongoose.model("Staff", staffSchema);
