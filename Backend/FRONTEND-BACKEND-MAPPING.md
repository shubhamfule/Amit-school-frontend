# Frontend → Backend Mapping

The uploaded frontend contains 7 merged modules: Admin, Library, Main Accountant, Non-Teaching Accountant, Student Accountant, Teaching Accountant and Student. The audit found 267 source files and existing backend-session authentication hooks in `src/auth/authClient.js` and `src/auth/AuthGate.jsx`.

## Authentication
| Frontend role | Login | Session | Logout |
|---|---|---|---|
| admin | `/api/auth/admin/login` | `/api/auth/admin/session` | `/api/auth/admin/logout` |
| student | `/api/auth/student/login` | `/api/auth/student/session` | `/api/auth/student/logout` |
| accountant-student | `/api/auth/accountant-student/login` | `/api/auth/accountant-student/session` | `/api/auth/accountant-student/logout` |
| library | `/api/auth/library/login` | `/api/auth/library/session` | `/api/auth/library/logout` |
| accountant-main | `/api/auth/accountant-main/login` | `/api/auth/accountant-main/session` | `/api/auth/accountant-main/logout` |
| accountant-non-teaching | `/api/auth/accountant-non-teaching/login` | `/api/auth/accountant-non-teaching/session` | `/api/auth/accountant-non-teaching/logout` |
| accountant-teaching | `/api/auth/accountant-teaching/login` | `/api/auth/accountant-teaching/session` | `/api/auth/accountant-teaching/logout` |

## Persistent domains found in the frontend
- Students and admissions
- Teaching and non-teaching staff
- Attendance
- Student fees and receipts
- Staff salary/payroll
- Expenses and transactions
- Notices
- Events/calendar
- Leave applications
- Books, members, issue/return, fines and clearance
- Exams/results/certificates
- Parent information
- Settings

## Existing client-side persistence audited
- Admin remembered email: localStorage
- Student remembered email: localStorage
- Student leave application code: localStorage
- Main accountant attendance calendar: localStorage
- Non-teaching attendance store: localStorage
- Teaching attendance store: localStorage

Remembered-email values are non-sensitive UI convenience state. Attendance is business data and has a MongoDB model/API in the new backend; the remaining UI modules should be migrated screen-by-screen to the API rather than treating browser storage as the source of truth.

## Frontend changes made
- Added `src/auth/apiClient.js` with a reusable credentialed API client.
- Updated authentication client to default to `VITE_API_BASE_URL` and the real Express auth routes when individual auth URLs are omitted.
- Updated `AuthGate` to resolve the correct backend session endpoint from the module role/path.
- Added explicit roles to Admin, Student and Student Accountant login calls and all protected module gates.
- Added `VITE_API_BASE_URL` to `.env.example`.

The UI structure, routes and styling were not redesigned.
