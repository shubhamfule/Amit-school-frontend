const app = require("../src/app");
const { connect, closeDatabase, clearDatabase } = require("./helpers/db");
const testCrud = require("./helpers/testCrud");

beforeAll(connect);
afterEach(clearDatabase);
afterAll(closeDatabase);

describe("/api/staff-onboarding", () => {
  testCrud(() => app, {
    basePath: "/api/staff-onboarding",
    validPayload: {
      staffId: "T101",
      fullName: "Kiran Shah",
      father: "Ramesh Shah",
      mother: "Sunita Shah",
      dob: "1990-01-01",
      gender: "Male",
      caste: "General",
      category: "General",
      religion: "Hindu",
      nationality: "Indian",
      maritalStatus: "Single",
      mobile: "9876543210",
      emergencyContact: "9876500000",
      email: "kiran.shah@example.com",
      aadhaar: "111122223333",
      pan: "ABCDE1234F",
      currentAddress: "123 Main St",
      permanentAddress: "123 Main St",
      subject: "Mathematics",
      classGrade: "9",
      experience: "3-5 years",
      monthlySalary: 30000,
      joiningDate: "2026-06-01",
      certifications: "B.Ed",
      computerSkill: "Intermediate",
    },
    updatePayload: { monthlySalary: 32000 },
    updatedField: "monthlySalary",
  });
});
