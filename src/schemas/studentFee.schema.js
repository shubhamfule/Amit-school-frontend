// Mirrors Backend/src/modules/student-fee/model/StudentFee.js

export const InstallmentSchema = {
  label: { type: 'string', required: true },
  amount: { type: 'number', required: true, min: 0 },
  dueDate: { type: 'date', required: true },
  paidAmount: { type: 'number', default: 0, min: 0 },
  paidDate: { type: 'date' },
  status: { type: 'string', enum: ['Paid', 'Pending', 'Overdue'], default: 'Pending' },
};

export const StudentFeeSchema = {
  modelName: 'StudentFee',
  apiPath: '/api/student-fees',
  fields: {
    studentId: { type: 'ObjectId', required: true, ref: 'Student' },
    academicYear: { type: 'string', required: true },
    totalAmount: { type: 'number', required: true, min: 0 },
    installments: { type: 'array', items: InstallmentSchema, default: [] },
    // paid / due / status are virtuals computed from installments — never sent/stored directly
    paid: { type: 'number', computed: true },
    due: { type: 'number', computed: true },
    status: { type: 'string', computed: true, enum: ['Paid', 'Pending', 'Overdue'] },
  },
};

export default StudentFeeSchema;
