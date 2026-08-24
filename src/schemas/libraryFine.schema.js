// Mirrors Backend/src/modules/library-fine/model/LibraryFine.js
// Created automatically by the backend's returnBook service (issue/return flow),
// not directly by a frontend "create fine" form.

export const LibraryFineSchema = {
  modelName: 'LibraryFine',
  apiPath: '/api/library-fines', // + POST /api/library-fines/:id/clear
  fields: {
    issueId: { type: 'ObjectId', required: true, ref: 'BookIssue' },
    overdueDays: { type: 'number', default: 0, min: 0 },
    overdueFineAmount: { type: 'number', default: 0, min: 0 },
    damageType: {
      type: 'string',
      enum: ['No Damage', 'Torn Pages', 'Missing Pages', 'Water Damage', 'Lost Book'],
      default: 'No Damage',
    },
    damageFineAmount: { type: 'number', default: 0, min: 0 },
    remarks: { type: 'string' },
    status: { type: 'string', enum: ['Pending', 'Cleared'], default: 'Pending' },
    clearedAt: { type: 'date' },
    totalFine: { type: 'number', computed: true }, // overdueFineAmount + damageFineAmount, virtual only
  },
};

export default LibraryFineSchema;
