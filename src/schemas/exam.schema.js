// Mirrors Backend/src/modules/exam/model/Exam.js
//
// KNOWN GAP: no real frontend form currently targets this exact shape. The closest
// frontend UIs (student/Exam.jsx, teacher/Schedule.jsx) use different, hardcoded
// field sets and are not wired to /api/exams.

export const ExamSchema = {
  modelName: 'Exam',
  apiPath: '/api/exams',
  fields: {
    subject: { type: 'string', required: true },
    class: { type: 'string', required: true },
    date: { type: 'date', required: true },
    time: { type: 'string' },
    room: { type: 'string' },
    syllabus: { type: 'string' },
    status: { type: 'string', enum: ['upcoming', 'completed'], default: 'upcoming' },
  },
};

export default ExamSchema;
