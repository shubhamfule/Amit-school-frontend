// Mirrors Backend/src/modules/library-member/model/LibraryMember.js

export const LibraryMemberSchema = {
  modelName: 'LibraryMember',
  apiPath: '/api/library-members',
  fields: {
    name: { type: 'string', required: true },
    role: { type: 'string', required: true, enum: ['Student', 'Teacher', 'Staff'] },
    subject: { type: 'string' },
    studentId: { type: 'ObjectId', ref: 'Student' },
    staffId: { type: 'ObjectId', ref: 'Staff' },
    email: { type: 'string' },
    membershipStatus: { type: 'string', enum: ['Active', 'Suspended'], default: 'Active' },
  },
};

export default LibraryMemberSchema;
