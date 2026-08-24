# Amit School Backend

Production-oriented REST API for the merged Amit School React/Vite frontend.

## Stack
Node.js, Express 5, MongoDB, Mongoose, server-side sessions with `express-session` + `connect-mongo`, bcryptjs, Helmet, CORS, rate limiting, Zod.

## Setup
1. Install Node.js 20+ and MongoDB.
2. Copy `.env.example` to `.env`.
3. Set `MONGODB_URI`, `SESSION_SECRET` (32+ random characters) and `CLIENT_URL`.
4. `npm install`
5. `npm run seed` (development only)
6. `npm run dev`

API base: `http://localhost:5000/api`

## Auth endpoints
- POST/GET/POST `/api/auth/admin/login|session|logout`
- POST/GET/POST `/api/auth/student/login|session|logout`
- POST/GET/POST `/api/auth/accountant-student/login|session|logout`
- POST/GET/POST `/api/auth/library/login|session|logout`
- POST/GET/POST `/api/auth/accountant-main/login|session|logout`
- POST/GET/POST `/api/auth/accountant-non-teaching/login|session|logout`
- POST/GET/POST `/api/auth/accountant-teaching/login|session|logout`

Login body: `{ "email": "...", "password": "..." }`. Sessions are HTTP-only cookies.

## CRUD resources
`students`, `staff`, `attendance`, `fees`, `salary`, `expenses`, `notices`, `events`, `leave-applications`, `books`, `library-members`, `book-issues`, `book-returns`, `fines`, `library-clearance`, `admissions`, `exams`, `results`, `certificates`, `parent-info`, `calendar-events`, `transactions`, `settings`.

Each resource supports GET list, GET by id, POST, PUT, PATCH and DELETE, with bounded pagination and search/filter query parameters where applicable.

Special library operations:
- POST `/api/library/issue`
- POST `/api/library/return/:id`

Dashboard:
- GET `/api/dashboard/summary`

## Development seed accounts
The seed script prints the credentials it creates. These are development-only credentials and must not be used in production.

## Frontend integration
Set the frontend's `VITE_*_AUTH_*_URL` variables to the matching API URLs and keep `credentials: "include"` on authenticated requests. For example, admin login is `http://localhost:5000/api/auth/admin/login` and admin session is `http://localhost:5000/api/auth/admin/session`.

Never put `MONGODB_URI`, `SESSION_SECRET` or other backend secrets in `VITE_*` variables.
