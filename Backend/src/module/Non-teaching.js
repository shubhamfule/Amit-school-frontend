// Non-Teaching Accountant portal — consolidated Mongoose schemas.
//
// Scanned from src/modules/non-teaching-accountant/Accountant/* (salaryData.jsx,
// directoryData.jsx, attendanceStore.jsx, accountsData.jsx,
// NonTeachingRegistration.jsx). Scoped to non-teaching staff only — no
// students, no library (neither appears anywhere in this portal's files).
//
// Reuses LeaveApplication / Notice / Event from Admin.js, and Transaction /
// Expense / NonTeachingSalaryPayment / StaffAttendanceMark from
// main-accountant.js — all already compatible with this portal's real data.
// Only one model is genuinely new here: NonTeachingOnboarding.

const mongoose = require("mongoose");
const { Schema } = mongoose;
const { LeaveApplication, Notice, Event } = require("./Admin");
const { Transaction, Expense, NonTeachingSalaryPayment, StaffAttendanceMark } = require("./Main-accountant");

// ---- Non-Teaching Onboarding -------------------------------------------
// Matches TeacherRegistration... no — matches THIS portal's
// NonTeachingRegistration.jsx, which (like teaching-accountant's own
// TeacherRegistration.jsx) registers an already-hired employee with a real
// monthlySalary + joiningDate, plus religion/nationality — unlike
// main-accountant's version of the same form, which asks a prospective
// applicant for an "expected" salary/availability instead. Kept as its own
// document (linked by staffId into NonTeachingSalaryPayment) since it's
// one-time onboarding detail, not a payroll field.

const nonTeachingOnboardingSchema = new Schema(
  {
    staffId: { type: String, required: true, unique: true }, // role-scoped id, e.g. "C001" under "clerk"
    fullName: { type: String, required: true, trim: true },
    father: { type: String, required: true },
    mother: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    caste: { type: String, required: true },
    category: { type: String, enum: ["General", "OBC", "SC", "ST", "EWS"], required: true },
    // religion/nationality and monthlySalary/joiningDate below are not
    // required — main-accountant's own NonTeachingRegistration.jsx (a
    // prospective applicant's form) never collects religion/nationality at
    // all, and sends salaryExpect/availableToJoin instead of the latter two.
    religion: { type: String },
    nationality: { type: String },
    maritalStatus: { type: String, enum: ["Single", "Married"], required: true },
    email: { type: String },
    mobile: { type: String, required: true },
    emergencyContact: { type: String, required: true },
    aadhaar: { type: String, required: true },
    pan: { type: String, required: true },
    currentAddress: { type: String, required: true },
    permanentAddress: { type: String, required: true },

    empType: { type: String, default: "Non-Teaching" },
    department: {
      type: String,
      enum: ["Administration", "Accounts", "Office", "Transport", "Library", "Security"],
      required: true,
    },
    workExp: { type: String, required: true }, // e.g. "3-5 years" — free select, not numeric
    // main-accountant's own NonTeachingRegistration.jsx uses a different
    // shift vocabulary (Day/Night/Rotational) — kept alongside.
    shift: { type: String, enum: ["Morning Shift", "Afternoon Shift", "Day Shift", "Night Shift", "Rotational"], required: true },
    prevOrg: { type: String },

    monthlySalary: { type: Number, min: 0 }, // real figure, once actually hired
    joiningDate: { type: Date },
    salaryExpect: { type: String }, // main-accountant's applicant-intake naming for an expected salary
    availableToJoin: { type: Date }, // main-accountant's applicant-intake naming for joiningDate
    profile: { type: String }, // free-text "about yourself"

    qualification: {
      type: String,
      enum: ["Below 10th", "10th Pass", "12th Pass", "Graduate", "Post Graduate"],
      required: true,
    },
    skills: { type: String, required: true }, // e.g. "Driving, First Aid"

    // Document uploads — file references (URL/id), not raw file data.
    documents: {
      photo: String,
      signature: String,
      aadhaarDoc: String,
      eduDoc: String,
      license: String, // driving license — drivers only
      expCert: String,
      casteDoc: String,
      domicileDoc: String,
    },
  },
  { timestamps: true }
);

module.exports = {
  // reused from Admin.js
  LeaveApplication,
  Notice,
  Event,
  // reused from main-accountant.js
  Transaction,
  Expense,
  NonTeachingSalaryPayment,
  StaffAttendanceMark,
  // owned here
  NonTeachingOnboarding: mongoose.model("NonTeachingOnboarding", nonTeachingOnboardingSchema),
};
