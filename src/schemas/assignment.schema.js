// Mirrors Backend/src/modules/assignment/model/Assignment.js

export const AssignmentSchema = {
  modelName: 'Assignment',
  apiPath: '/api/assignments',
  fields: {
    title: { type: 'string', required: true },
    subject: { type: 'string', required: true },
    class: { type: 'string', required: true },
    dueDate: { type: 'date', required: true },
    description: { type: 'string' },
    status: { type: 'string', enum: ['Active', 'Completed', 'Archived'], default: 'Active' },
    teacherId: { type: 'ObjectId', required: true, ref: 'Staff' },
  },
};

export default AssignmentSchema;
