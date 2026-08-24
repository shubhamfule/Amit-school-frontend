// Mirrors Backend/src/modules/class/model/Class.js

export const ClassSchema = {
  modelName: 'Class',
  apiPath: '/api/classes',
  fields: {
    key: { type: 'string', required: true, unique: true }, // N, LKG, UKG, 1..10
    label: { type: 'string', required: true },
    sections: { type: 'string[]', default: [] },
    classTeacherId: { type: 'ObjectId', ref: 'Staff' },
    studentCount: { type: 'number', computed: true }, // live aggregate, not stored
  },
};

export default ClassSchema;
