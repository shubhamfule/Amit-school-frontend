# Amit School Backend

Express + MongoDB/Mongoose API for the Amit School management system
(admin, library, main-accountant, non-teaching-accountant, student,
student-accountant, teacher, and teaching-accountant portals).

Built the same way as the reference "a-backend": plain Express routers,
Mongoose schemas with `enum`-validated fields, JSON in/out, no required
login on data routes. The one addition over a-backend is a shared
`crudRouter`/`crudFactory` pair so each resource is one line instead of a
repeated block of `find`/`create`/`update`/`delete` handlers — the routes
and response shapes it produces are the same.

## Setup

```bash
npm install
cp .env.example .env   # adjust MONGO_URI if your Mongo isn't on localhost:27017
npm run dev             # nodemon src/server.js, listens on :5000
```

Health check: `GET http://localhost:5000/health`

Every route is namespaced under `/api`, matching the frontend's
`VITE_API_URL` default of `http://localhost:5000/api`.

## What's actually wired to a real API today

Only the **teacher** portal (`src/modules/teacher`) calls a backend at all —
every other portal currently renders from local mock data
(`admin/data/*.js`, `*/Accountant/*Data.jsx`, etc.), with comments in the
source noting "swap for real API calls when wiring up a backend." So the
teacher endpoints are the ones you can smoke-test against the running
frontend immediately:

| Method | Path                | Notes |
|--------|---------------------|-------|
| GET/POST/DELETE | `/api/students` (+`/:id`) | roster |
| GET `?date=` / POST `/bulk` | `/api/attendance` | daily attendance, upserts per student |
| GET/POST/DELETE | `/api/marks` (+`/:id`) | test/exam marks |
| GET/POST/DELETE | `/api/leave` (+`/:id`) | leave applications |
| GET/POST/DELETE | `/api/library` (+`/:id`) | book catalog |
| GET/POST/DELETE | `/api/assignments` (+`/:id`) | assignments |
| POST `/bulk`, GET/POST/DELETE | `/api/schedule` (+`/:id`) | timetable, CSV bulk-import |

The remaining ~40 routes (`/staff`, `/notices`, `/events`, `/transactions`,
`/teacher-salary`, `/student-fees`, `/library-members`, `/certificates`,
`/exams`, `/results`, `/staff-onboarding`, ...) exist and work the same
way, ready for each portal to be pointed at them the same way the teacher
portal already is — see the per-model comments in `src/module/*.js` for
which frontend page/field each one maps to.

## Auth

`POST /api/auth/register`, `/login`, `/logout`, `GET /me` and a JWT
cookie/`Authorization: Bearer` middleware (`src/middleware/auth.js`) are in
place for when a real login flow replaces the frontend's current
`localStorage`-only demo login (`src/lib/auth.ts`). Data routes don't
require it today because the frontend never sends a token — the demo
accounts in `seed/seed.js` line up 1:1 with `DEMO_USERS` in `auth.ts` so
switching over later is just pointing the login form at `/api/auth/login`.

```bash
npm run seed   # creates the 8 demo accounts (admin/library/.../student)
```

## Fixes made to get this running

The project already existed (bundled inside the frontend zip's `Backend/`
folder) but failed to boot:

- `require("../module/student")`, `require("../module/teacher")`, and
  `require("../module/non-teaching")` pointed at lowercase filenames that
  don't exist (`Student.js`, `Teacher.js`, `Non-teaching.js` are
  capitalized) — worked on a case-insensitive filesystem (macOS/Windows),
  crashed immediately on Linux.
- Every CRUD route required a valid JWT session (`protect` middleware),
  but the frontend's real `fetch()` calls (`modules/teacher/utils/api.js`)
  never send a cookie or `Authorization` header, so every request from the
  running app would have 401'd. Removed the mandatory `protect`/`authorize`
  gate from `crudRouter` and the two hand-written routers in
  `teacher.routes.js`, matching a-backend's open-CRUD convention.

Verified: the app now boots cleanly (`node -e "require('./src/app.js')"`),
every route file loads without a missing-module error, and all 100+ routes
register with no path collisions across the 8 route files.
