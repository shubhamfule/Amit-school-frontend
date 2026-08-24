// Mirrors Backend/src/modules/book-issue/model/BookIssue.js
//
// KNOWN GAP: real library frontend forms only carry free-text bookId/bookName and
// a member id/name pair — no relational ObjectId linkage. Backend requires real
// Book/LibraryMember ObjectIds for bookId/memberId.

export const BookIssueSchema = {
  modelName: 'BookIssue',
  apiPath: '/api/book-issues', // + POST /api/book-issues/:id/return
  fields: {
    bookId: { type: 'ObjectId', required: true, ref: 'Book' },
    memberId: { type: 'ObjectId', required: true, ref: 'LibraryMember' },
    issueDate: { type: 'date', default: 'now' },
    dueDate: { type: 'date', required: true },
    returnDate: { type: 'date', default: null },
    returnCondition: { type: 'string', enum: ['Good', 'Damaged', 'Late'] },
    status: { type: 'string', enum: ['Issued', 'Returned', 'Overdue'], default: 'Issued' },
  },
};

export default BookIssueSchema;
