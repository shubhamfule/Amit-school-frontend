const mongoose = require("mongoose");
const Expense = require("../model/Expense");
const Transaction = require("../../transaction/model/Transaction");

async function create(data, recordedBy) {
  const session = await mongoose.startSession();
  try {
    let expense;
    await session.withTransaction(async () => {
      const created = await Expense.create([{ ...data, recordedBy }], { session });
      expense = created[0];

      await Transaction.create(
        [
          {
            type: "Expense",
            refId: expense._id,
            refModel: "Expense",
            name: expense.expense,
            amount: expense.amount,
            method: expense.mode,
            status: "Completed",
            date: expense.date,
          },
        ],
        { session }
      );
    });
    return expense;
  } finally {
    session.endSession();
  }
}

module.exports = { create };
