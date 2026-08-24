// Mirrors Backend/src/modules/attendance/model/Attendance.js + validation/attendance.validation.js
//
// KNOWN GAP: the real frontend bulk-save (teacher portal, POST /attendance/bulk)
// currently sends { studentId, studentName, class, status } — no personId/personType.
// The backend validation requires personId (a real Student/Staff ObjectId) and
// personType. Until the frontend is updated to resolve/send a real ObjectId, bulk
// attendance saves against this schema will fail Joi validation.

export const AttendanceSchema = {
  modelName: 'Attendance',
  apiPath: '/api/attendance', // + POST /api/attendance/bulk
  fields: {
    personId: { type: 'ObjectId', required: true, ref: 'Student | Staff' },
    personType: { type: 'string', required: true, enum: ['Student', 'Staff'] },
    class: { type: 'string' }, // only meaningful for Student attendance
    date: { type: 'date', required: true },
    status: { type: 'string', required: true, enum: ['present', 'absent', 'leave', 'holiday'] },
    markedBy: { type: 'ObjectId', ref: 'User' },
    remarks: { type: 'string' },
  },
  bulkMarkPayload: {
    date: { type: 'date', required: true },
    records: {
      type: 'array',
      items: {
        personId: { type: 'ObjectId', required: true },
        personType: { type: 'string', required: true, enum: ['Student', 'Staff'] },
        class: { type: 'string' },
        status: { type: 'string', required: true, enum: ['present', 'absent', 'leave', 'holiday'] },
        remarks: { type: 'string' },
      },
    },
  },
};

export default AttendanceSchema;
