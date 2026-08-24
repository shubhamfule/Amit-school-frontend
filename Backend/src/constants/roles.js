const ROLES = [
  "admin",
  "library",
  "main-accountant",
  "non-teaching-accountant",
  "student-accountant",
  "teaching-accountant",
  "student",
  "teacher",
];

// Roles allowed to act as "accountant" across fee/salary/expense endpoints.
const ACCOUNTANT_ROLES = [
  "main-accountant",
  "non-teaching-accountant",
  "student-accountant",
  "teaching-accountant",
];

module.exports = { ROLES, ACCOUNTANT_ROLES };
