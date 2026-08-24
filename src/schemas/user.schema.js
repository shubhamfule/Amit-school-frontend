// Mirrors Backend/src/modules/auth/model/User.js + validation/auth.validation.js
//
// KNOWN GAP: every real login form in the frontend collects `email` + `password`.
// The backend's POST /api/auth/login expects `identifier` (username OR email) +
// `password`, not `email`. Rename the field before wiring login up for real.

export const ROLES = [
  'admin', 'library', 'main-accountant', 'non-teaching-accountant',
  'student-accountant', 'teaching-accountant', 'student', 'teacher',
];

export const UserSchema = {
  modelName: 'User',
  apiPath: '/api/auth', // /register, /login, /logout, /me
  fields: {
    username: { type: 'string', required: true, unique: true },
    email: { type: 'string', required: true, unique: true },
    passwordHash: { type: 'string', required: true, hidden: true }, // never sent to/from the client
    role: { type: 'string', required: true, enum: ROLES },
    refId: { type: 'ObjectId', ref: 'Student | Staff' },
    refModel: { type: 'string', enum: ['Student', 'Staff'] },
    label: { type: 'string' },
    isActive: { type: 'boolean', default: true },
    lastLoginAt: { type: 'date', computed: true },
  },
  loginPayload: {
    identifier: { type: 'string', required: true }, // username or email — NOT `email`
    password: { type: 'string', required: true },
  },
  registerPayload: {
    username: { type: 'string', required: true, min: 3, max: 40 },
    email: { type: 'string', required: true },
    password: { type: 'string', required: true, min: 6, max: 72 },
    role: { type: 'string', required: true, enum: ROLES },
    label: { type: 'string', max: 80 },
    refId: { type: 'ObjectId' },
  },
};

export default UserSchema;
