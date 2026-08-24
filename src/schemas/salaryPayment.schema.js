// Mirrors Backend/src/modules/salary/model/SalaryPayment.js
// One record per staff member per month, generated from attendance then paid.

export const SalaryPaymentSchema = {
  modelName: 'SalaryPayment',
  apiPath: '/api/salary', // POST /api/salary/generate, POST /api/salary/:id/pay
  fields: {
    staffId: { type: 'ObjectId', required: true, ref: 'Staff' },
    month: { type: 'string', required: true }, // "YYYY-MM"
    grossAmount: { type: 'number', required: true, min: 0, computed: true }, // = Staff.monthlySalary
    workingDays: { type: 'number', required: true, min: 0, computed: true },
    presentDays: { type: 'number', required: true, min: 0, computed: true },
    netAmount: { type: 'number', required: true, min: 0, computed: true }, // gross * presentDays/workingDays
    paidAmount: { type: 'number', default: 0, min: 0 },
    status: { type: 'string', enum: ['Paid', 'Partial', 'Pending'], default: 'Pending' },
    paidAt: { type: 'date' },
    recordedBy: { type: 'ObjectId', ref: 'User' },
    pending: { type: 'number', computed: true }, // virtual: netAmount - paidAmount
  },
  generatePayload: {
    staffId: { type: 'ObjectId', required: true },
    month: { type: 'string', required: true, pattern: 'YYYY-MM' },
  },
  payPayload: {
    amount: { type: 'number', required: true, min: 0.01 },
    method: { type: 'string', required: true, enum: ['Online', 'Bank Transfer', 'Cash', 'UPI'] },
  },
};

export default SalaryPaymentSchema;
