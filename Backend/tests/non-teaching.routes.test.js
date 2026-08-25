const app = require("../src/app");
const { connect, closeDatabase, clearDatabase } = require("./helpers/db");
const testCrud = require("./helpers/testCrud");

beforeAll(connect);
afterEach(clearDatabase);
afterAll(closeDatabase);

describe("/api/non-teaching-onboarding", () => {
  testCrud(() => app, {
    basePath: "/api/non-teaching-onboarding",
    validPayload: {
      staffId: "C101",
      fullName: "Suresh Kumar",
      father: "Ram Kumar",
      mother: "Sita Kumar",
      dob: "1988-01-01",
      gender: "Male",
      caste: "General",
      category: "General",
      religion: "Hindu",
      nationality: "Indian",
      maritalStatus: "Married",
      mobile: "9876543210",
      emergencyContact: "9876500000",
      aadhaar: "111122223333",
      pan: "ABCDE1234F",
      currentAddress: "123 Main St",
      permanentAddress: "123 Main St",
      department: "Office",
      workExp: "3-5 years",
      shift: "Morning Shift",
      monthlySalary: 15000,
      joiningDate: "2026-06-01",
      qualification: "12th Pass",
      skills: "Filing, Typing",
    },
    updatePayload: { monthlySalary: 16000 },
    updatedField: "monthlySalary",
  });
});
