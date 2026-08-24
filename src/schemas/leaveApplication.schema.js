// Mirrors Backend/src/modules/leave/model/LeaveApplication.js + validation
//
// KNOWN GAP: the real teacher-portal form (POST /leave) sends
// { studentName, startDate, endDate, reason, status } — no applicantId (ObjectId),
// no applicantType, no leaveType, and uses startDate/endDate instead of
// fromDate/toDate. The backend currently requires applicantId + applicantType +
// leaveType + fromDate/toDate, so real submissions from that form will fail.

export const LeaveApplicationSchema = {
  modelName: 'LeaveApplication',
  apiPath: '/api/leave', // + PATCH /api/leave/:id/status
  fields: {
    applicantId: { type: 'ObjectId', required: true, ref: 'Student | Staff' },
    applicantType: { type: 'string', required: true, enum: ['Student', 'Staff'] },
    leaveType: {
      type: 'string',
      required: true,
      enum: [
        'Sick Leave', 'Casual Leave', 'Earned Leave', 'Maternity/Paternity Leave',
        'Unpaid Leave', 'Medical Leave', 'Personal Leave', 'Family Function',
        'Emergency', 'Other',
      ],
    },
    fromDate: { type: 'date', required: true },
    toDate: { type: 'date', required: true }, // must be >= fromDate
    reason: { type: 'string', required: true },
    status: { type: 'string', enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  },
};

export default LeaveApplicationSchema;
