// Mirrors Backend/src/modules/fee-payment/model/FeePayment.js + validation
// A payment against one StudentFee installment; also writes a Transaction ledger entry.

export const FeePaymentSchema = {
  modelName: 'FeePayment',
  apiPath: '/api/fee-payments',
  fields: {
    studentId: { type: 'ObjectId', required: true, ref: 'Student', computed: true }, // resolved server-side from studentFeeId
    studentFeeId: { type: 'ObjectId', required: true, ref: 'StudentFee' },
    installmentId: { type: 'ObjectId', required: true },
    installmentLabel: { type: 'string', required: true, computed: true },
    amount: { type: 'number', required: true, min: 0.01 },
    method: { type: 'string', required: true, enum: ['Online', 'Bank Transfer', 'Cash', 'UPI'] },
    paidAt: { type: 'date', default: 'now' },
    receiptNo: { type: 'string', unique: true, computed: true },
    recordedBy: { type: 'ObjectId', ref: 'User', computed: true },
  },
  // Actual POST /api/fee-payments body
  createPayload: {
    studentFeeId: { type: 'ObjectId', required: true },
    installmentId: { type: 'ObjectId', required: true },
    amount: { type: 'number', required: true, min: 0.01 },
    method: { type: 'string', required: true, enum: ['Online', 'Bank Transfer', 'Cash', 'UPI'] },
    paidAt: { type: 'date' },
  },
};

export default FeePaymentSchema;
