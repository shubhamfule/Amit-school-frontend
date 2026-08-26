// Teaching Accountant portal — consolidated Mongoose schemas.
//
// Scanned from src/modules/teaching-accountant/Accountant/* (salaryData.jsx,
// directoryData.jsx, attendanceStore.jsx, accountsData.jsx, libraryData.jsx,
// eventsData.jsx, TeacherRegistration.jsx). This portal is scoped to teaching
// staff only — no student or non-teaching data here.
//
// Reuses Staff / LeaveApplication / Notice / Event from Admin.js, and
// Transaction / Expense / TeacherSalaryPayment / StaffAttendanceMark / Book /
// BookIssue / BookReturn / LibraryFine / LibraryClearance from
// main-accountant.js — all of which this portal's real data fits (after the
// compatibility fixes made in main-accountant.js: Leave status, optional
// bookId/bookName, fineAmount). Nothing is redefined here except the one
// model genuinely new to this portal.

const mongoose = require("mongoose");
const { Schema } = mongoose;
const { Staff, LeaveApplication, Notice, Event } = require("./Admin");
const {
  Transaction,
  Expense,
  TeacherSalaryPayment,
  StaffAttendanceMark,
  Book,
  BookIssue,
  BookReturn,
  LibraryFine,
  LibraryClearance,
} = require("./Main-accountant");

// ---- Staff Onboarding --------------------------------------------------
// Matches TeacherRegistration.jsx in THIS portal. Unlike main-accountant's
// version (a prospective applicant's "expected salary" / "available to
// join"), this form registers an already-hired teacher directly with a real
// monthlySalary + joiningDate, and additionally collects religion,
// nationality, maritalStatus and emergencyContact, which neither Admin.Staff
// nor main-accountant's registration form have. Kept as its own document
// (linked by staffId) rather than folded into Admin.Staff, since Staff's
// flat payroll fields (name/type/mobile/role/classes/joiningDate/
// monthlySalary) already have a single owner and this is a superset of
// one-time onboarding detail, not a payroll field.

const staffOnboardingSchema = new Schema(
  {
    staffId: { type: String, required: true, unique: true, ref: "Staff" }, // e.g. "T001"
    fullName: { type: String, required: true, trim: true },
    father: { type: String, required: true },
    mother: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    caste: { type: String, required: true },
    category: { type: String, enum: ["General", "OBC", "SC", "ST", "EWS"], required: true },
    // religion/nationality/maritalStatus/emergencyContact and monthlySalary/
    // joiningDate below are not required — main-accountant's own
    // TeacherRegistration.jsx (a prospective applicant's form) never
    // collects the former at all, and sends salaryExpect/availableToJoin
    // instead of the latter two.
    religion: { type: String },
    nationality: { type: String },
    maritalStatus: { type: String, enum: ["Single", "Married"] },
    mobile: { type: String, required: true },
    emergencyContact: { type: String },
    email: { type: String, required: true },
    aadhaar: { type: String, required: true },
    pan: { type: String, required: true },
    currentAddress: { type: String, required: true },
    permanentAddress: { type: String, required: true },

    subject: { type: String, required: true },
    classGrade: { type: String, required: true },
    experience: { type: String, required: true }, // e.g. "3-5 years" — free select, not numeric
    prevSchool: { type: String },
    designation: { type: String }, // at previous institution
    duration: { type: String }, // at previous institution

    monthlySalary: { type: Number, min: 0 }, // real figure, once actually hired
    joiningDate: { type: Date },
    salaryExpect: { type: String }, // main-accountant's applicant-intake naming for an expected salary
    availableToJoin: { type: Date }, // main-accountant's applicant-intake naming for joiningDate
    profile: { type: String }, // free-text "about yourself"

    // Educational Qualification table — one row per exam type.
    qualifications: {
      ssc: { board: String, year: String, pct: String, division: String },
      hsc: { board: String, year: String, pct: String, division: String },
      grad: { board: String, year: String, pct: String, division: String },
      pg: { board: String, year: String, pct: String, division: String },
      bed: { board: String, year: String, pct: String, division: String },
    },
    certifications: { type: String, required: true },
    computerSkill: { type: String, enum: ["Basic", "Intermediate", "Advanced"], required: true },
    software: { type: String },
    ctet: { type: String, enum: ["Qualified", "Not Qualified", "Not Applicable"] },
    tet: { type: String, enum: ["Qualified", "Not Qualified", "Not Applicable"] },

    // Document uploads — file references (URL/id), not raw file data.
    documents: {
      photo: String,
      idProof: String,
      signature: String,
      panDoc: String,
      resume: String,
      addressProof: String,
      sscDoc: String,
      hscDoc: String,
      degreeDoc: String,
      pgDoc: String,
      bedDoc: String,
      tetDoc: String,
      casteDoc: String,
      domicileDoc: String,
    },
  },
  { timestamps: true }
);

module.exports = {
  // reused from Admin.js
  Staff,
  LeaveApplication,
  Notice,
  Event,
  // reused from main-accountant.js
  Transaction,
  Expense,
  TeacherSalaryPayment,
  StaffAttendanceMark,
  Book,
  BookIssue,
  BookReturn,
  LibraryFine,
  LibraryClearance,
  // owned here
  StaffOnboarding: mongoose.model("StaffOnboarding", staffOnboardingSchema),
};
