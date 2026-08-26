# Backend/Frontend Audit

Scope: every file in `Backend/src/module/*.js` and `Backend/src/routes/*.js`, every file in
`src/schemas/*.js`, and every file under `src/modules/**` matching `apiPost`, `apiPut`,
`apiPatch`, `fetch(`, or `axios`. No code was changed to produce this report.

All routes are mounted under `/api` (`Backend/src/app.js:19` — `app.use("/api", routes)`), and
`Backend/src/routes/index.js` mounts every sub-router at `"/"` (no extra prefix) except
`auth.routes.js` at `/auth`. So "route path" below = `/api` + the sub-router's own path.

Every model below not explicitly noted otherwise is exposed through the shared
`crudRouter(Model, { writeRoles })` factory (`Backend/src/utils/crudRouter.js`), which always
provides `GET /`, `GET /:id`, `POST /`, `PATCH /:id`, `DELETE /:id` — all requiring a session
(`protect`), writes additionally gated by `writeRoles` when given (omitted = any authenticated
role may write).

---

## 1. Mongoose models, fields, and routes

### Owned by `module/Admin.js`

| Model | Required fields | Other fields (type / enum) | Route path |
|---|---|---|---|
| **User** | `username` (unique), `email` (unique), `passwordHash` (select:false), `role` (enum: admin, library, main-accountant, non-teaching-accountant, student-accountant, teaching-accountant, teacher, student) | `label`, `refId` (ObjectId), `isActive` (Boolean, default true), `lastLoginAt` (Date) | Not CRUD-mounted. Only `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me` (`auth.routes.js`) |
| **Student** | `name`, `class` | `rollNumber` (unique, sparse), `roll`, `admissionNo`, `section`, `dob` (Date), `gender` (enum: Male/Female/Other), `parentName`, `father`, `mother`, `phone`, `contact`, `mobile`, `address`, `admissionDate` (Date), `academicYear`, `bloodGroup`, `classTeacherName`, `classTeacherContact`, `subjects` (String[]), `feeTotal` (Number, default 0), `feePaid` (Number, default 0), `feeStatus` (enum: Paid/Due), `status` (enum: Active/Inactive/Pending/Paid, default Active), `folder` (photo/birthCert/tc/marksheet/addressProof/signature/aadhaarDoc/casteDoc/domicileDoc — all String), virtual `feePending` | `POST /api/students` (writeRoles: admin, teacher, main-accountant, student-accountant) |
| **Staff** | `staffId` (unique), `name`, `type` (enum: teaching/other), `mobile` (regex `^[6-9]\d{9}$`), `role`, `joiningDate` (Date), `monthlySalary` (min 1) | `classes` (default "—"), `academicYear` (auto-derived from joiningDate via pre-save hook), `attendance` (Mixed, default {}) | `/api/staff` (writeRoles: admin) |
| **LeaveApplication** | `reason` | `staffId`, `staffName`, `employeeId`, `employeeName`, `studentName`, `staffType` (enum: teaching/other), `role`, `leaveType` (enum: Sick/Casual/Earned/Maternity-Paternity/Unpaid/Medical/Personal/Family Function/Emergency/Other Leave), `fromDate`/`toDate`/`from`/`to`/`startDate`/`endDate` (Date, 3 naming variants), `status` (enum: Pending/Approved/Rejected, default Pending), `appliedOn` (Date, default now) | `/api/leave` (no writeRoles — any authenticated role) |
| **Notice** | `title`, `date` (default now) | `priority` (enum: high/medium/low, default medium), `audience` (enum: All Students/Parents/Staff/All Classes/Teaching Staff/Non-Teaching Staff, default "All Students"), `body`, `category` (enum: academic/event/holiday/urgent), `by` | `/api/notices` (writeRoles: admin, library, main-accountant) |
| **Event** | `title`, `date` | `venue`, `icon` (default "🎓"), `status` (enum: upcoming/scheduled/planning/Scheduled/Upcoming/Completed/Cancelled/Planning, default upcoming), `description`, `desc` | `/api/events` (writeRoles: admin, library, main-accountant) |
| **CalendarEvent** | `title`, `date` | `time` (String "HH:mm"), `color` (default "var(--blue)"), `type` (enum: due/holiday/meeting/bookfair/workshop) | `/api/calendar-events` (writeRoles: admin, library) |
| **Settings** | `userId` (ObjectId ref User, unique) | `profile` {name, designation, email, phone, department (enum: Administration/Academics/Finance), employeeId}, `notifPrefs` {admissions, feeReminders, calendarEvents, staffAlerts, email, sms, push — all Boolean}, `toggles` {autoSuspend, allowHold, twoFa, autoBackup — all Boolean}, `themeChoice` (enum: light/dark/system, default light) | `/api/settings` (writeRoles: admin) |

### Owned by `module/Main-accountant.js`

| Model | Required fields | Other fields (type / enum) | Route path |
|---|---|---|---|
| **Transaction** | `date`, `amount` (min 0) | `name`, `desc`, `type` (enum: Fee Collection/Salary Payment/Expense), `method` (enum: Online/Bank Transfer/Cash/UPI), `status` (enum: Completed/Pending/paid/pending/overdue, default Pending) | `/api/transactions` (writeRoles: admin, main-accountant, non-teaching-accountant, student-accountant, teaching-accountant) |
| **TeacherSalaryPayment** | `staffId` (ref Staff), `name`, `designation`, `salary` (min 0) | `meta`, `paid` (default 0) | `/api/teacher-salary` (same ACCOUNTANT_ROLES as above) |
| **NonTeachingSalaryPayment** | `roleKey` (enum: cleaner/clerk/driver/peon/security/librarian), `staffId`, `name`, `designation`, `salary` (min 0) | `meta`, `paid` (default 0); compound unique index `{roleKey, staffId}` | `/api/non-teaching-salary` (same ACCOUNTANT_ROLES) |
| **StudentFeeRecord** | `roll` (unique), `name`, `class`, `total` (min 0) | `paid` (default 0), `installments[]` {name (req), date (req, String display), amount (req, min 0)} | `/api/student-fees` (same ACCOUNTANT_ROLES) |
| **Expense** | `date`, `expense`, `category` (enum: Office/Transport/Utility/Maintenance), `amount` (min 0), `mode` (enum: Cash/Bank/UPI) | `paymentProof` (default null) | `/api/expenses` (same ACCOUNTANT_ROLES) |
| **StaffAttendanceMark** | `staffType` (enum: teaching/nonTeaching), `personKey`, `date` | `status` (enum: Present/Absent/Leave, default Present); compound unique index `{staffType, personKey, date}` | `/api/staff-attendance` + `POST /api/staff-attendance/bulk` (same ACCOUNTANT_ROLES) |
| **Book** | `title` | `bookId` (unique, sparse), `author`, `isbn`, `publisher`, `category`, `quantity` (min 0), `description`, `status` (enum: Available/Issued/Overdue, default Available) | `/api/library` (writeRoles: admin, library, teacher) |
| **BookIssue** | `name`, `userType` (enum: Student/Teacher), `bookName`, `issueDate`, `dueDate` | `issueId` (unique, sparse), `memberId`, `bookId` (ref Book), `author`, `status` (enum: Issued/Returned/Overdue/issued/returned/overdue, default Issued) | `/api/book-issues` (writeRoles: admin, library) |
| **BookReturn** | `name`, `userType` (enum: Student/Teacher), `bookId`, `returnDate` | `returnId` (unique, sparse), `memberId`, `bookName`, `issueDate`, `condition` (enum: Good/Damaged/Late), `damageType` (enum: No Damage/Torn Pages/Missing Pages/Water Damage/Lost Book), `clearanceAmount` (min 0), `payment` (enum: Paid/Unpaid), `fine` (default 0) | `/api/book-returns` (writeRoles: admin, library) |
| **LibraryFine** | `fineId` (unique), `name`, `userType` (enum: Student/Teacher), `bookId` | `type` (enum: Overdue/Damage), `amount` (min 0), `fineAmount` (min 0), `status` (enum: Paid/Unpaid, default Unpaid) | `/api/library-fines` (writeRoles: admin, library) |
| **LibraryClearance** | `clearanceId` (unique), `name`, `userType` (enum: Student/Teacher) | `bookId`, `bookName`, `overdueFine` (default 0), `damageFine` (default 0), `booksIssued` (default 0), `pendingFine` (default 0), `status` (enum: Cleared/Pending, default Pending) | `/api/library-clearances` (writeRoles: admin, library) |

### Owned by `module/Library.js`

| Model | Required fields | Other fields (type / enum) | Route path |
|---|---|---|---|
| **LibraryMember** | `memberId` (unique), `name`, `role` (enum: Student/Teacher) | `subject`, `issued` (default 0), `returned` (default 0), `record` (enum: Active/Clear/Overdue, default Clear) | `/api/library-members` (writeRoles: admin, library) |

### Owned by `module/Non-teaching.js`

| Model | Required fields | Other fields (type / enum) | Route path |
|---|---|---|---|
| **NonTeachingOnboarding** | `staffId` (unique), `fullName`, `father`, `mother`, `dob`, `gender` (enum: Male/Female/Other), `caste`, `category` (enum: General/OBC/SC/ST/EWS), `maritalStatus` (enum: Single/Married), `mobile`, `emergencyContact`, `aadhaar`, `pan`, `currentAddress`, `permanentAddress`, `department` (enum: Administration/Accounts/Office/Transport/Library/Security), `workExp`, `shift` (enum: Morning Shift/Afternoon Shift/Day Shift/Night Shift/Rotational), `qualification` (enum: Below 10th/10th Pass/12th Pass/Graduate/Post Graduate), `skills` | `religion`, `nationality`, `email`, `empType` (default "Non-Teaching"), `prevOrg`, `monthlySalary` (min 0), `joiningDate`, `salaryExpect`, `availableToJoin`, `profile`, `documents` {photo, signature, aadhaarDoc, eduDoc, license, expCert, casteDoc, domicileDoc — all String} | `/api/non-teaching-onboarding` (writeRoles: admin, non-teaching-accountant, main-accountant) |

### Owned by `module/Student.js`

| Model | Required fields | Other fields (type / enum) | Route path |
|---|---|---|---|
| **Certificate** | `title`, `category` (enum: academic/sports/participation/excellence), `issuer`, `date` | `studentId` (ref Student), `imageUrl`, `imageExt` | `/api/certificates` (writeRoles: admin, student) |
| **ParentInfo** | `studentId` (ref Student, unique), `father` (guardianDetail, req), `mother` (guardianDetail, req) — guardianDetail: `name` req, `occupation`, `qualification`, `phone`, `email` | `verification` {documentsVerified (default false), kycComplete (default false), lastUpdatedAt} | `/api/parent-info` (writeRoles: admin, student) |
| **Exam** | `subject`, `date`, `time`, `room` | `class`, `syllabus`, `status` (enum: upcoming/completed, default upcoming) | `/api/exams` (writeRoles: admin) |
| **Result** | `subject`, `term` (enum: unit1/unit2/term1/term2/final), `marks` (min 0), `max` (min 1), `status` (enum: pass/average/fail) | `studentId` (ref Student), `grade` | `/api/results` (writeRoles: admin, teacher) |

### Owned by `module/Teacher-accountant.js`

| Model | Required fields | Other fields (type / enum) | Route path |
|---|---|---|---|
| **StaffOnboarding** | `staffId` (unique, ref Staff), `fullName`, `father`, `mother`, `dob`, `gender` (enum: Male/Female/Other), `caste`, `category` (enum: General/OBC/SC/ST/EWS), `mobile`, `email`, `aadhaar`, `pan`, `currentAddress`, `permanentAddress`, `subject`, `classGrade`, `experience`, `certifications`, `computerSkill` (enum: Basic/Intermediate/Advanced) | `religion`, `nationality`, `maritalStatus` (enum: Single/Married), `emergencyContact`, `prevSchool`, `designation`, `duration`, `monthlySalary` (min 0), `joiningDate`, `salaryExpect`, `availableToJoin`, `profile`, `qualifications` {ssc/hsc/grad/pg/bed, each {board, year, pct, division}}, `software`, `ctet`/`tet` (enum: Qualified/Not Qualified/Not Applicable), `documents` (14 String fields) | `/api/staff-onboarding` (writeRoles: admin, teaching-accountant, main-accountant) |

### Owned by `module/Teacher.js`

| Model | Required fields | Other fields (type / enum) | Route path |
|---|---|---|---|
| **StudentAttendance** | `studentId` (ref Student), `studentName`, `date`, `status` (enum: present/absent) | `class`; compound unique index `{studentId, date}` | `GET/POST /api/attendance` + `POST /api/attendance/bulk` — custom handlers, `protect` only, **no `authorize()` role check** (any authenticated role can write) |
| **Mark** | `test`, `roll`, `name`, `subject`, `marks` (min 0, max 100) | — | `/api/marks` (crudRouter, no writeRoles — any authenticated role) |
| **ScheduleEntry** | `time`, `subject`, `class`, `room` | `status` (enum: Upcoming/Ongoing/Completed, default Upcoming) | `/api/schedule` + `POST /api/schedule/bulk` (crudRouter, no writeRoles) |
| **Assignment** | `title`, `subject`, `class`, `dueDate` | `description`, `status` (enum: Active/Completed/Archived, default Active) | `/api/assignments` (crudRouter, no writeRoles) |

### `module/Student-account.js` (student-accountant portal)

Owns **no model of its own** — it re-exports `Student`/`Notice`/`Event` from `Admin.js` and
`Transaction`/`StudentFeeRecord`/`Book`/`BookIssue`/`BookReturn`/`LibraryFine`/`LibraryClearance`
from `Main-accountant.js`. Its route file, `routes/student-accountant.js`, mounts an **empty
router** — it was missing from the repo entirely until this session (see prior turn); nothing new
is added at any path. All access to those reused models goes through the canonical routes listed
above, gated by the `student-accountant` role already present in their `writeRoles`.

**No file defines a `Class`/classroom model** — `src/schemas/class.schema.js` documents an
`/api/classes` endpoint that does not exist anywhere in the backend (see §2).

---

## 2. Frontend schema (`src/schemas/*.js`) sync audit

Every file in `src/schemas/` opens with a comment like *"Mirrors
`Backend/src/modules/<domain>/model/<Model>.js`"* — a **per-domain, Joi-validated backend layout
that no longer exists in this repo** (`Backend/src/modules/` doesn't exist; `find` confirms only
`Backend/src/module/` — singular, per-portal). This whole schema directory documents a prior
backend architecture that was replaced by the current consolidated `module/*.js` + role-based
`crudRouter` design (see commit `af99b8e "Simplify Backend modules, drop split library-shared
file and test suite"`). **Every one of the 23 files below is stale to some degree; several
document endpoints/models that no longer exist at all.**

| Schema file | Sync status | Key drift from the actual backend model |
|---|---|---|
| `student.schema.js` | **Out of sync** | `admissionNo`/`rollNo`/`gender`/`admissionDate` marked required (none are in `Student`); `father`/`mother` are nested `GuardianSchema` objects (backend: flat strings); has `guardianVerification` (that's actually `ParentInfo.verification`, a separate model); missing `folder`, `rollNumber`, `bloodGroup`, `classTeacherName/Contact`, `subjects`, `feeTotal/feePaid/feeStatus`, `admissionNo` (not unique in backend) |
| `staff.schema.js` | **Out of sync** | `employeeCode` (backend: `staffId`), `staffType` enum `['teaching','non-teaching']` (backend: `type` enum `['teaching','other']`), `designation` required (backend has no `designation` field — it's `role`), `department`/`status` don't exist on `Staff` at all |
| `leaveApplication.schema.js` | **Out of sync** (own "KNOWN GAP" comment is now itself stale) | Requires `applicantId` (ObjectId) + `applicantType` + `leaveType` + `fromDate`/`toDate` — backend only requires `reason` and accepts three different naming variants (`staffId`/`employeeId`, `from`/`fromDate`/`startDate`, etc.), none of them ObjectId refs. Documents `PATCH /api/leave/:id/status`, which doesn't exist (generic `PATCH /:id` only) |
| `notice.schema.js` | **Out of sync** | `audience` typed as `string[]` (backend: single string enum); `postedBy` (ObjectId ref User) doesn't exist (backend has free-text `by`); documents `POST /api/notices/:id/read` and an `unread`-via-`NoticeRead`-join, but no `NoticeRead` model exists anywhere in the backend |
| `event.schema.js` | **Out of sync** | `location`/`category`/`theme` don't exist on `Event` (backend has `venue`, `desc`, `icon`); comment claims "map venue -> location" but backend stores `venue` directly, unmapped |
| `settings.schema.js` | **Out of sync** | Entirely different shape: flat `notifications`/`rules`/`theme`/`twoFactorEnabled`/`autoBackup` vs. backend's nested `profile`/`notifPrefs`/`toggles`/`themeChoice` |
| `transaction.schema.js` | **Out of sync** | `refId`/`refModel` (enum `FeePayment`/`SalaryPayment`/`Expense`) required — backend `Transaction` has no `refId`/`refModel` at all, and neither `FeePayment` nor `SalaryPayment` exist as models |
| `salaryPayment.schema.js` | **Orphaned — model/endpoint don't exist** | Documents `/api/salary` with `/generate` and `/:id/pay` sub-routes and a `SalaryPayment` model with `month`/`workingDays`/`presentDays`/`netAmount` virtuals. The backend has no unified `SalaryPayment` model at all — only `TeacherSalaryPayment` (`/teacher-salary`) and `NonTeachingSalaryPayment` (`/non-teaching-salary`), neither with a `/generate` or `/pay` sub-route, both with a completely different flat shape |
| `studentFee.schema.js` | **Out of sync** | `studentId` (ObjectId ref) — backend keys by `roll` (String), no `studentId` field; `academicYear` required (doesn't exist on backend model); `totalAmount` (backend: `total`); installment shape entirely different (schema: label/amount/dueDate/paidAmount/paidDate/status vs. backend: name/date-string/amount only); `paid`/`due`/`status` documented as computed virtuals — backend's `paid` is a real stored field, and there is no `due`/`status` virtual at all |
| `expense.schema.js` | **Out of sync** | `category` enum includes `'Other'` and excludes nothing the backend has, but ordering/set differs (backend has no `'Other'`, and `category` is required in backend, optional-with-default here); `notes`/`recordedBy` don't exist on the backend model |
| `attendance.schema.js` | **Out of sync** | Documents one unified `Attendance` model keyed by `personId`/`personType` (Student\|Staff) — the backend instead has two entirely separate models: `StudentAttendance` (teacher portal, `/attendance`) and `StaffAttendanceMark` (accountant portals, `/staff-attendance`), neither of which has `personId`/`personType` |
| `book.schema.js` | **Out of sync** | `author`/`category` marked required (both optional in backend); `totalCopies` (backend: `quantity`); `availableCopies` documented as computed (doesn't exist on backend model); `bookId` not documented at all |
| `bookIssue.schema.js` | **Out of sync** | `bookId`/`memberId` documented as required ObjectId refs — backend's are optional Strings; `returnDate`/`returnCondition` documented as fields *on* `BookIssue` — backend keeps returns as a **separate `BookReturn` model** entirely; documents `POST /api/book-issues/:id/return`, which doesn't exist |
| `libraryFine.schema.js` | **Out of sync** | Entirely different shape — schema: `issueId` (ObjectId ref, required), `overdueDays`/`overdueFineAmount`/`damageFineAmount`/`remarks`/`clearedAt`/`totalFine`; backend: `fineId`/`name`/`userType`/`bookId`/`type`/`amount`/`fineAmount`/`status`, no `issueId` at all. Documents `POST /api/library-fines/:id/clear`, which doesn't exist |
| `libraryMember.schema.js` | **Out of sync** | `role` enum includes `'Staff'` (backend: only Student/Teacher); `studentId`/`staffId` ObjectId refs don't exist on backend model; `membershipStatus` enum `['Active','Suspended']` — backend's equivalent field is `record`, enum `['Active','Clear','Overdue']`, a different name and meaning; `issued`/`returned` counters undocumented |
| `certificate.schema.js` | **Minor drift** | `issuer` optional here, required in backend; `fileUrl` (backend splits into `imageUrl` + `imageExt`) |
| `exam.schema.js` | **Minor drift** | `class` required here, optional ("implicit") in backend — otherwise closely matches |
| `mark.schema.js` | **Out of sync** | Schema: `studentId`+`examId` (ObjectId refs), `term`, `marksObtained`/`maxMarks`, computed `percentage`/`grade`/`status`. Backend `Mark`: flat `test`/`roll`/`name`/`subject`/`marks` — no ObjectId refs, no `examId`, no `term`, no computed virtuals |
| `schedule.schema.js` | **Out of sync** | Schema: `dayOfWeek`+`startTime`+`endTime`+`teacherId` (ObjectId, required). Backend `ScheduleEntry`: single free-text `time` range, no `dayOfWeek`, no `teacherId` field at all |
| `assignment.schema.js` | **Minor drift** | `teacherId` (ObjectId, required) doesn't exist on backend `Assignment` — otherwise matches |
| `class.schema.js` | **Orphaned — model/endpoint don't exist** | No `Class` model and no `/classes` route exist anywhere in the current backend |
| `user.schema.js` | **Partially stale** | `refModel` field documented but doesn't exist on backend `User`; the file's own "KNOWN GAP" header (claiming login needs `email` not `identifier`) is now **wrong** — `auth.routes.js` already accepts `identifier` |
| `feePayment.schema.js` | **Orphaned — model/endpoint don't exist** | No `FeePayment` model and no `/api/fee-payments` route exist anywhere in the current backend |
| `index.js` | **Consistent with its own siblings** | Just re-exports the 21 files above (plus `class.schema.js`, not exported) — inherits every issue listed |

**Net finding: `src/schemas/` is not usable as backend documentation in its current state.** It
describes a prior Joi/per-domain backend that predates the current `module/*.js` design; roughly
20 of 23 files have materially wrong required-field lists, field names, or route paths, and three
(`salaryPayment`, `class`, `feePayment`) document models/endpoints with no backend counterpart at
all.

---

## 3. Frontend → backend write calls (`grep -r "apiPost\|apiPut\|apiPatch\|fetch(\|axios" src/modules`)

No `axios` usage anywhere in `src/modules`. Two files define the `fetch(`-based API clients that
every write below goes through — not pages themselves:
`src/modules/teacher/utils/api.js` (used by teacher, main-accountant, teaching-accountant,
student-accountant portals) and `src/modules/library/library/utils/api.js` (used by the library
portal). Both wrap `fetch` with `credentials: "include"` and expose `apiGet`/`apiPost`/`apiPut`/
`apiPatch`/`apiDelete`; `apiPut` is defined in `teacher/utils/api.js` but never actually called
anywhere in the tree.

### (a) Files that send data to the backend

| File | Endpoint(s) called | Payload shape |
|---|---|---|
| `teacher/components/teacher-portal/RecordManager.jsx:90` | `POST {apiEndpoint}` — generic, driven by the `apiEndpoint` prop; also `DELETE {apiEndpoint}/:id` (no PATCH/edit — records are add/delete only) | Whatever `formFields` the calling page configures, sent as `form` (flat key/value object) |
| ↳ used by `teacher/pages/teacher-portal/StudentPortal.jsx` | `apiEndpoint="/students"` | form fields per that page's `formFields` config |
| ↳ used by `teacher/pages/teacher-portal/LeaveApplications.jsx` | `apiEndpoint="/leave"` | " |
| ↳ used by `teacher/pages/teacher-portal/Marks.jsx` | `apiEndpoint="/marks"` | " |
| ↳ used by `teacher/pages/teacher-portal/Schedule.jsx` | `apiEndpoint="/schedule"` | " |
| ↳ used by `teacher/pages/teacher-portal/Library.jsx` | `apiEndpoint="/library"` | " |
| ↳ used by `teacher/pages/teacher-portal/Assignments.jsx` | `apiEndpoint="/assignments"` | " |
| `teacher/pages/teacher-portal/Schedule.jsx:100` | `POST /schedule/bulk` | `{ entries: [...] }` — CSV-parsed timetable rows |
| `teacher/pages/teacher-portal/Attendance.jsx:107` | `POST /attendance/bulk` | `{ date, records: [{ studentId, studentName, class, status }] }` |
| `main-accountant/Accountant/StudentAdmission.jsx:56` | `POST /students` | `{ name, class, dob, gender, father, mother, contact, address, academicYear, folder: {photo, birthCert, tc, marksheet, addressProof, signature, aadhaarDoc, casteDoc, domicileDoc} }` |
| `main-accountant/Accountant/TeacherRegistration.jsx:28` | `POST /staff-onboarding` | full applicant profile incl. `qualifications` and `documents` sub-objects (see backend `StaffOnboarding` shape above) |
| `main-accountant/Accountant/NonTeachingRegistration.jsx:24` | `POST /non-teaching-onboarding` | full applicant profile incl. `documents` sub-object |
| `main-accountant/Accountant/SchoolExpenses.jsx:96,125,137` | `POST /expenses`, `PATCH /expenses/:id` (×2) | POST: `{ ...form, amount: Number(form.amount) }`; PATCH: `{ paymentProof: <dataURL or null> }` |
| `main-accountant/Accountant/AttendanceManagement.jsx:120` | `POST /staff-attendance/bulk` | `{ staffType, date, records: [{ personKey, status }] }` |
| `main-accountant/Accountant/Notices.jsx:38` | `POST /notices` | `{ title, audience }` |
| `main-accountant/Accountant/Events.jsx:71` | `POST /events` | `{ title, date, venue, status, icon }` |
| `library/library/pages/FinesFees.jsx:64` | `POST /library-clearances` | `{ clearanceId, name, userType, bookId, bookName, overdueFine, damageFine, status }` |
| `library/library/pages/CalendarPage.jsx:103` | `POST /calendar-events` | `{ title, date, time, type }` |
| `library/library/pages/LeaveApplications.jsx:78,82` | `PATCH /leave/:id` (edit), `POST /leave` (create) | raw `form` object: `{ studentName, startDate, endDate, reason, status }` |
| `library/library/pages/IssueReturn.jsx:77` | `POST /book-issues` | `{ memberId, name, userType, bookId, bookName, issueDate, dueDate }` |
| `library/library/pages/BookCatalog.jsx:55` | `POST /library` | `{ bookId, title, isbn, author, publisher, category, quantity, status: 'Available' }` |
| `library/library/pages/Events.jsx:63` | `POST /events` | raw `form` object |
| `library/library/pages/Members.jsx:61` | `POST /library-members` | `{ memberId, name, subject, role, issued: 0, returned: 0, record: 'Clear' }` |
| `library/library/pages/Notices.jsx:42` | `POST /notices` | `{ ...form, body: form.body || 'Details to be announced.' }` |
| `teaching-accountant/Accountant/TeacherRegistration.jsx:93` | `POST /staff-onboarding` | full applicant profile (same shape as main-accountant's version) |
| `student-accountant/Accountant/StudentAdmission.jsx:44` | `POST /students` | `{ name, class, dob, gender, father, mother, contact, address, academicYear }` — **note: unlike main-accountant's identical-purpose form, this one does not send `folder` (documents), even though the backend `Student.folder` field exists and this portal's wizard also collects document uploads** |

### (b) Pages with a form/save action that do NOT call the API (local state only)

Confirmed by an empty grep result for all five patterns across the whole directory:

- **`src/modules/admin/`** — the entire portal, zero API calls anywhere, despite every model it
  manages (`Student`, `Staff`, `LeaveApplication`, `Notice`, `Event`, `CalendarEvent`,
  `Settings`) having full backend routes with `admin` in `writeRoles`. Confirmed forms/local
  state: `pages/Students.jsx`, `pages/Notices.jsx`, `pages/Events.jsx`, `pages/CalendarPage.jsx`,
  `pages/Settings.jsx`, `pages/teachers/LeaveApplications.jsx`,
  `pages/finance/StudentFees.jsx`, plus `pages/Teachers.jsx`, `pages/Library.jsx`,
  `pages/finance/Expenses.jsx`, `pages/finance/TeacherSalary.jsx`,
  `pages/finance/NonTeachingSalary.jsx`, `pages/teachers/TeachingStaff.jsx`,
  `pages/teachers/NonTeachingStaff.jsx`.
- **`src/modules/non-teaching-accountant/`** — the entire portal, zero API calls anywhere,
  including its own `NonTeachingRegistration.jsx` (unlike main-accountant's and
  teaching-accountant's registration forms, this one never calls `apiPost`).
- **`src/modules/student/`** — the entire portal (confirmed by the module's own header comment
  in `Backend/src/module/Student.js`: *"EVERY page here is 100% local component state"*):
  `Attendance.jsx`, `Certificate.jsx`, `Exam.jsx`, `Fees.jsx`, `Leave.jsx`, `Library.jsx`,
  `Notice.jsx`, `ParentInfo.jsx`, `ProfileInfo.jsx`, `Result.jsx`, `Event.jsx`.
- **`src/modules/teaching-accountant/`** — every page except `TeacherRegistration.jsx` (listed
  in (a)): `LeaveApplications.jsx`, `Library.jsx`, `Notices.jsx`, `Events.jsx`,
  `SchoolExpenses.jsx`, `StaffDirectory.jsx`, `MarkAttendance.jsx`, `StaffSalaryPage.jsx`,
  `PayrollDashboard.jsx`, `Reports.jsx`, `AccountantSettings.jsx`.
- **`src/modules/student-accountant/`** — every page except `StudentAdmission.jsx` (listed in
  (a)): `StudentManagement.jsx`, `StudentFeeCollection.jsx`, `BookIssue.jsx`, `BookReturn.jsx`,
  `FineCollection.jsx`, `LibraryClearance.jsx`, `Notices.jsx`, `Events.jsx`, `FeeReceipt.jsx`,
  `Reports.jsx`, `AccountantSettings.jsx` — matches the header comment already in
  `tests/student-accountant.routes.test.js`.
- **`src/modules/main-accountant/`** — pages beyond the ones in (a) that still only use local
  seed data: `AttendanceCalendar.jsx`, `BookIssue.jsx`, `BookReturn.jsx`, `FineCollection.jsx`,
  `LeaveApplications.jsx`, `LibraryClearance.jsx`, `StaffSalaryPage.jsx`,
  `StudentFeeCollection.jsx`, `TeacherSalary.jsx`, `FeeReceipt.jsx`, `PayrollDashboard.jsx`,
  `Reports.jsx`, `AccountantSettings.jsx`.
- **`src/modules/library/library/pages/`** — `Dashboard.jsx` and `Settings.jsx` have no write
  action (dashboard is read-only aggregation; Settings is local-only), unlike every other page
  in that folder which is listed in (a).

Data/config files (`*Data.jsx`, `navConfig.jsx`) and pure layout/shared components (`Sidebar`,
`Topbar`, `PageHeader`, `Field`, `WizardShell`, `KpiCard`, `StatCard`, `ChartCard`, `LiveClock`,
`MiniCalendar`, `Widget`, `SimplePagination`, `ExportButtons`) are excluded above — they hold no
form/save action of their own.
