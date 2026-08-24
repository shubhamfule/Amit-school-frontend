// Mirrors Backend/src/modules/book/model/Book.js + validation/book.validation.js
// NOTE: this model is served at /api/library (matches the teacher portal's
// apiEndpoint="/library"), not /api/books.

export const BookSchema = {
  modelName: 'Book',
  apiPath: '/api/library',
  fields: {
    title: { type: 'string', required: true },
    author: { type: 'string', required: true },
    isbn: { type: 'string' },
    publisher: { type: 'string' },
    category: { type: 'string', required: true },
    totalCopies: { type: 'number', default: 1, min: 0 },
    availableCopies: { type: 'number', computed: true }, // derived from issues/returns
    status: { type: 'string' },
  },
};

export default BookSchema;
