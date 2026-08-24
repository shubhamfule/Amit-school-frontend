// Mirrors Backend/src/modules/transaction/model/Transaction.js
// Write-only audit ledger, populated by FeePayment/SalaryPayment/Expense services
// at creation time. Read-only from the frontend — GET /api/transactions only.

export const TransactionSchema = {
  modelName: 'Transaction',
  apiPath: '/api/transactions',
  readOnly: true,
  fields: {
    type: { type: 'string', required: true, enum: ['Fee Collection', 'Salary Payment', 'Expense'] },
    refId: { type: 'ObjectId', required: true, ref: 'FeePayment | SalaryPayment | Expense' },
    refModel: { type: 'string', required: true, enum: ['FeePayment', 'SalaryPayment', 'Expense'] },
    name: { type: 'string', required: true },
    amount: { type: 'number', required: true },
    method: { type: 'string' },
    status: { type: 'string', enum: ['Completed', 'Pending'], default: 'Completed' },
    date: { type: 'date', default: 'now' },
    class: { type: 'string' },
  },
};

export default TransactionSchema;
