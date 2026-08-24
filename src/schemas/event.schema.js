// Mirrors Backend/src/modules/event/model/Event.js

export const EventSchema = {
  modelName: 'Event',
  apiPath: '/api/events',
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    location: { type: 'string' }, // NOTE: admin's add-event form field is named `venue` — map venue -> location
    category: { type: 'string' },
    description: { type: 'string' },
    status: { type: 'string' },
    theme: { type: 'object' },
  },
};

export default EventSchema;
