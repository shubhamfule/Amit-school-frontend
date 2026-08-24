// Mirrors Backend/src/modules/staff/model/Staff.js

export const StaffSchema = {
  modelName: 'Staff',
  apiPath: '/api/staff',
  fields: {
    employeeCode: { type: 'string', required: true, unique: true },
    name: { type: 'string', required: true },
    staffType: { type: 'string', required: true, enum: ['teaching', 'non-teaching'] },
    designation: { type: 'string', required: true },
    department: { type: 'string' },
    classesAssigned: { type: 'string[]', default: [] },
    mobile: { type: 'string' },
    email: { type: 'string' },
    joiningDate: { type: 'date', required: true },
    monthlySalary: { type: 'number', required: true, min: 0 },
    academicYear: { type: 'string', computed: true }, // derived from joiningDate, do not send
    status: { type: 'string', enum: ['Active', 'On Leave', 'Inactive'], default: 'Active' },
    // experience is a method (staff.experience()), not a stored/returned field
  },
};

export default StaffSchema;
