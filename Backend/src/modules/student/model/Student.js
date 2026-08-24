const mongoose = require("mongoose");

const guardianSchema = new mongoose.Schema(
  {
    name: String,
    occupation: String,
    qualification: String,
    phone: String,
    email: String,
  },
  { _id: false }
);

const studentSchema = new mongoose.Schema(
  {
    admissionNo: { type: String, required: true, unique: true, trim: true },
    rollNo: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    class: { type: String, required: true },
    section: { type: String, trim: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    dob: { type: Date },
    father: guardianSchema,
    mother: guardianSchema,
    contact: { type: String, trim: true },
    address: { type: String, trim: true },
    admissionDate: { type: Date, required: true },
    academicYear: { type: String },
    guardianVerification: {
      documentsVerified: { type: Boolean, default: false },
      kycComplete: { type: Boolean, default: false },
      lastUpdatedAt: { type: Date },
    },
    status: { type: String, enum: ["Active", "Inactive", "Pending"], default: "Active" },
  },
  { timestamps: true }
);

studentSchema.index({ class: 1, rollNo: 1 }, { unique: true });

const { getAcademicYear } = require("../../../utils/academicYear");
studentSchema.pre("save", function setAcademicYear(next) {
  if (this.isModified("admissionDate") || !this.academicYear) {
    this.academicYear = getAcademicYear(this.admissionDate || Date.now());
  }
  next();
});

module.exports = mongoose.model("Student", studentSchema);
