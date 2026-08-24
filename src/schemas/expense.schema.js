// Mirrors Backend/src/modules/expense/model/Expense.js
// Creating an Expense also writes a Transaction ledger entry server-side.

export const ExpenseSchema = {
  modelName: 'Expense',
  apiPath: '/api/expenses',
  fields: {
    date: { type: 'date', default: 'now' },
    expense: { type: 'string', required: true }, // description/name
    category: { type: 'string', enum: ['Utility', 'Office', 'Transport', 'Maintenance', 'Other'], default: 'Other' },
    amount: { type: 'number', required: true, min: 0.01 },
    mode: { type: 'string', required: true, enum: ['Cash', 'Bank', 'UPI'] },
    paymentProof: { type: 'string' }, // URL/reference, not a raw data: URI
    notes: { type: 'string' },
    recordedBy: { type: 'ObjectId', ref: 'User', computed: true },
  },
};

export default ExpenseSchema;
