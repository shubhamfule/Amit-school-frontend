// Mirrors Backend/src/modules/certificate/model/Certificate.js
//
// KNOWN GAP: the real upload form's imageFile/imagePreview never actually reaches
// a server — fileUrl here is a placeholder for a real upload pipeline.

export const CertificateSchema = {
  modelName: 'Certificate',
  apiPath: '/api/certificates',
  fields: {
    studentId: { type: 'ObjectId', required: true, ref: 'Student' },
    title: { type: 'string', required: true },
    category: { type: 'string', required: true, enum: ['excellence', 'academic', 'sports', 'participation'] },
    issuer: { type: 'string' },
    date: { type: 'date', required: true },
    fileUrl: { type: 'string' },
  },
};

export default CertificateSchema;
