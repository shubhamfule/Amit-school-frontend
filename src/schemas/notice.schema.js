// Mirrors Backend/src/modules/notice/model/Notice.js + NoticeRead.js
//
// KNOWN GAP: the real Notice add-form only sends { title, date, audience, priority,
// body }. Backend's `category` enum and `postedBy` are never set by any frontend form.

export const NoticeSchema = {
  modelName: 'Notice',
  apiPath: '/api/notices', // + POST /api/notices/:id/read
  fields: {
    title: { type: 'string', required: true },
    body: { type: 'string', required: true },
    date: { type: 'date', default: 'now' },
    priority: { type: 'string', enum: ['high', 'medium', 'low'], default: 'medium' },
    audience: { type: 'string[]', default: ['All'] },
    category: { type: 'string', enum: ['event', 'academic', 'holiday', 'urgent'] },
    postedBy: { type: 'ObjectId', ref: 'User' },
    unread: { type: 'boolean', computed: true }, // per-viewer, from NoticeRead join
  },
};

export default NoticeSchema;
