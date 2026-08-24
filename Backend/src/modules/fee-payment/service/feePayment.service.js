const mongoose = require("mongoose");
const crypto = require("crypto");
const ApiError = require("../../../utils/ApiError");
const FeePayment = require("../model/FeePayment");
const StudentFee = require("../../student-fee/model/StudentFee");
const Student = require("../../student/model/Student");
const Transaction = require("../../transaction/model/Transaction");

function generateReceiptNo() {
  return `RCPT-${Date.now()}-${crypto.randomInt(1000, 9999)}`;
}

async function pay({ studentFeeId, installmentId, amount, method, paidAt }, recordedBy) {
  const session = await mongoose.startSession();
  try {
    let payment;
    await session.withTransaction(async () => {
      const studentFee = await StudentFee.findById(studentFeeId).session(session);
      if (!studentFee) throw new ApiError(404, "Student fee record not found");

      const installment = studentFee.installments.id(installmentId);
      if (!installment) throw new ApiError(404, "Installment not found");
      if (installment.status === "Paid") throw new ApiError(409, "Installment is already fully paid");

      const remaining = installment.amount - installment.paidAmount;
      if (amount > remaining) {
        throw new ApiError(400, `Amount exceeds the remaining balance of ${remaining} for this installment`);
      }

      installment.paidAmount += amount;
      installment.paidDate = paidAt || new Date();
      installment.status = installment.paidAmount >= installment.amount ? "Paid" : "Pending";
      await studentFee.save({ session });

      const student = await Student.findById(studentFee.studentId).session(session);

      const createdPayment = await FeePayment.create(
        [
          {
            studentId: studentFee.studentId,
            studentFeeId: studentFee._id,
            installmentId: installment._id,
            installmentLabel: installment.label,
            amount,
            method,
            paidAt: paidAt || new Date(),
            receiptNo: generateReceiptNo(),
            recordedBy,
          },
        ],
        { session }
      );
      payment = createdPayment[0];

      await Transaction.create(
        [
          {
            type: "Fee Collection",
            refId: payment._id,
            refModel: "FeePayment",
            name: student?.name || "Unknown student",
            amount,
            method,
            status: "Completed",
            date: payment.paidAt,
            class: student?.class,
          },
        ],
        { session }
      );
    });
    return payment;
  } finally {
    session.endSession();
  }
}

module.exports = { pay };
