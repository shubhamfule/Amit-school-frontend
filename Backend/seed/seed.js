const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const User = require("../src/modules/auth/model/User");

const ACCOUNTS = [
  { username: "admin", email: "admin@amitschool.edu", password: "Admin@123", role: "admin", label: "Admin" },
  { username: "library", email: "library@amitschool.edu", password: "Library@123", role: "library", label: "Library" },
  { username: "main-accountant", email: "mainaccountant@amitschool.edu", password: "Accountant@123", role: "main-accountant", label: "Main Accountant" },
  { username: "non-teaching-accountant", email: "nonteachingaccountant@amitschool.edu", password: "Accountant@123", role: "non-teaching-accountant", label: "Non Teaching Accountant" },
  { username: "student-accountant", email: "studentaccountant@amitschool.edu", password: "Accountant@123", role: "student-accountant", label: "Student Accountant" },
  { username: "teaching-accountant", email: "teachingaccountant@amitschool.edu", password: "Accountant@123", role: "teaching-accountant", label: "Teaching Accountant" },
  { username: "teacher", email: "teacher@amitschool.edu", password: "Teacher@123", role: "teacher", label: "Teacher" },
  { username: "student", email: "student@amitschool.edu", password: "Student@123", role: "student", label: "Student" },
];

async function run() {
  await connectDB();

  for (const acc of ACCOUNTS) {
    const passwordHash = await User.hashPassword(acc.password);
    await User.updateOne(
      { email: acc.email },
      {
        $set: {
          username: acc.username,
          email: acc.email,
          role: acc.role,
          label: acc.label,
          passwordHash,
          isActive: true,
        },
      },
      { upsert: true }
    );
  }

  console.log("Seed complete. Development accounts:"); // eslint-disable-line no-console
  for (const acc of ACCOUNTS) {
    console.log(`${acc.role}: ${acc.email} / ${acc.password}`); // eslint-disable-line no-console
  }

  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error(err); // eslint-disable-line no-console
  await mongoose.disconnect();
  process.exit(1);
});
