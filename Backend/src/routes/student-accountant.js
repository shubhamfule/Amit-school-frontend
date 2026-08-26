// Student Accountant portal — this portal owns no model of its own (see
// Student-account.js). Every model it uses (Student, Notice, Event,
// Transaction, StudentFeeRecord, Book, BookIssue, BookReturn, LibraryFine,
// LibraryClearance) already gets its one canonical route set from
// Admin.routes.js / Main-accountant.routes.js, so there is nothing new to
// mount here. See tests/student-accountant.routes.test.js.

const { Router } = require("express");


const router = Router();

module.exports = router;
