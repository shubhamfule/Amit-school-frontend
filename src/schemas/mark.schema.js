// Mirrors Backend/src/modules/mark/model/Mark.js + validation/mark.validation.js
//
// KNOWN GAP: the real teacher entry form (POST /marks) sends { test, roll, subject,
// marks } — it never resolves/sends studentId (a real ObjectId). The backend
// requires studentId. This must be resolved (roll -> student lookup) before the
// real form's submissions will pass validation.

export const MarkSchema = {
  modelName: 'Mark',
  apiPath: '/api/marks',
  fields: {
    studentId: { type: 'ObjectId', required: true, ref: 'Student' },
    examId: { type: 'ObjectId', ref: 'Exam' },
    testName: { type: 'string' },
    subject: { type: 'string', required: true },
    term: { type: 'string', enum: ['unit1', 'unit2', 'term1', 'term2', 'final'] },
    marksObtained: { type: 'number', required: true, min: 0 },
    maxMarks: { type: 'number', default: 100, min: 1 },
    // percentage / grade / status are virtuals — always computed, never sent/stored
    percentage: { type: 'number', computed: true },
    grade: { type: 'string', computed: true, enum: ['A+', 'A', 'B', 'C', 'D'] },
    status: { type: 'string', computed: true, enum: ['pass', 'average', 'fail'] },
  },
};

export default MarkSchema;
