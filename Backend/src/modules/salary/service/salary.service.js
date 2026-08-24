const mongoose = require("mongoose");
const ApiError = require("../../../utils/ApiError");
const SalaryPayment = require("../model/SalaryPayment");
const Staff = require("../../staff/model/Staff");
const Attendance = require("../../attendance/model/Attendance");
const Transaction = require("../../transaction/model/Transaction");

function monthRange(month) {
  const [y, m] = month.split("-").map(Number);
  const from = new Date(y, m - 1, 1);
  const to = new Date(y, m, 0, 23, 59, 59, 999);
  return { from, to, workingDays: to.getDate() };
}

async function generate({ staffId, month }) {
  const staff = await Staff.findById(staffId);
  if (!staff) throw new ApiError(404, "Staff not found");

  const { from, to, workingDays } = monthRange(month);
  const presentDays = await Attendance.countDocuments({
    personId: staffId,
    personType: "Staff",
    date: { $gte: from, $lte: to },
    status: "present",
  });

  const grossAmount = staff.monthlySalary;
  const netAmount =
    workingDays > 0 ? Math.round((grossAmount * presentDays) / workingDays) : grossAmount;

  return SalaryPayment.findOneAndUpdate(
    { staffId, month },
    { staffId, month, grossAmount, workingDays, presentDays, netAmount },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

async function pay(salaryPaymentId, { amount, method }, recordedBy) {
  const session = await mongoose.startSession();
  try {
    let payment;
    await session.withTransaction(async () => {
      const doc = await SalaryPayment.findById(salaryPaymentId).session(session);
      if (!doc) throw new ApiError(404, "Salary payment record not found");
      if (doc.status === "Paid") throw new ApiError(409, "This salary has already been fully paid");

      const remaining = doc.netAmount - doc.paidAmount;
      if (amount > remaining) {
        throw new ApiError(400, `Amount exceeds the remaining balance of ${remaining}`);
      }

      doc.paidAmount += amount;
      doc.paidAt = new Date();
      doc.status = doc.paidAmount >= doc.netAmount ? "Paid" : "Partial";
      doc.recordedBy = recordedBy;
      await doc.save({ session });

      const staff = await Staff.findById(doc.staffId).session(session);

      await Transaction.create(
        [
          {
            type: "Salary Payment",
            refId: doc._id,
            refModel: "SalaryPayment",
            name: staff?.name || "Unknown staff",
            amount,
            method,
            status: "Completed",
            date: doc.paidAt,
          },
        ],
        { session }
      );

      payment = doc;
    });
    return payment;
  } finally {
    session.endSession();
  }
}

module.exports = { generate, pay };
