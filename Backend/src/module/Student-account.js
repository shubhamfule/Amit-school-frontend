// Student Accountant portal — consolidated Mongoose schemas.
//
// Scanned from src/modules/student-accountant/Accountant/* (salaryData.jsx,
// directoryData.jsx, accountsData.jsx, libraryData.jsx, eventsData.jsx,
// StudentManagement.jsx, StudentAdmission.jsx, StudentFeeCollection.jsx,
// FeeReceipt.jsx). This portal is scoped to students only — no staff/
// salary/expense data here, unlike the other accountant portals.
//
// Everything this portal needs already has an owner: Student/Notice/Event
// from Admin.js, and Transaction/StudentFeeRecord/Book/BookIssue/BookReturn/
// LibraryFine/LibraryClearance from main-accountant.js — its library data
// (libraryData.jsx) matches main-accountant's shape exactly, with no gaps
// to patch this time. Nothing new is defined here; this file only re-exports.

const { Student, Notice, Event } = require("./Admin");
const {
  Transaction,
  StudentFeeRecord,
  Book,
  BookIssue,
  BookReturn,
  LibraryFine,
  LibraryClearance,
} = require("./Main-accountant");

module.exports = {
  // reused from Admin.js
  Student,
  Notice,
  Event,
  // reused from main-accountant.js
  Transaction,
  StudentFeeRecord,
  Book,
  BookIssue,
  BookReturn,
  LibraryFine,
  LibraryClearance,
};
