// Mirrors Backend/src/modules/student/model/Student.js — keep in sync by hand.
// This is a reference/documentation object, not a runtime validator.

export const GuardianSchema = {
  name: { type: 'string' },
  occupation: { type: 'string' },
  qualification: { type: 'string' },
  phone: { type: 'string' },
  email: { type: 'string' },
};

export const StudentSchema = {
  modelName: 'Student',
  apiPath: '/api/students',
  fields: {
    admissionNo: { type: 'string', required: true, unique: true },
    rollNo: { type: 'string', required: true },
    name: { type: 'string', required: true },
    class: { type: 'string', required: true },
    section: { type: 'string' },
    gender: { type: 'string', required: true, enum: ['Male', 'Female', 'Other'] },
    dob: { type: 'date' },
    father: { type: 'object', shape: GuardianSchema },
    mother: { type: 'object', shape: GuardianSchema },
    contact: { type: 'string' },
    address: { type: 'string' },
    admissionDate: { type: 'date', required: true },
    academicYear: { type: 'string', computed: true }, // derived from admissionDate, do not send
    guardianVerification: {
      type: 'object',
      shape: {
        documentsVerified: { type: 'boolean', default: false },
        kycComplete: { type: 'boolean', default: false },
        lastUpdatedAt: { type: 'date' },
      },
    },
    status: { type: 'string', enum: ['Active', 'Inactive', 'Pending'], default: 'Active' },
  },
};

export default StudentSchema;
