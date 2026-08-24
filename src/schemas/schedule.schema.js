// Mirrors Backend/src/modules/schedule/model/ScheduleEntry.js

export const ScheduleEntrySchema = {
  modelName: 'ScheduleEntry',
  apiPath: '/api/schedule', // + POST /api/schedule/bulk
  fields: {
    dayOfWeek: { type: 'string', required: true, enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] },
    startTime: { type: 'string', required: true }, // "HH:mm"
    endTime: { type: 'string', required: true }, // "HH:mm"
    subject: { type: 'string', required: true },
    class: { type: 'string', required: true },
    room: { type: 'string' },
    teacherId: { type: 'ObjectId', required: true, ref: 'Staff' },
    status: { type: 'string', enum: ['Upcoming', 'Ongoing', 'Completed'], default: 'Upcoming' },
  },
};

export default ScheduleEntrySchema;
