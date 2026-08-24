# API Endpoint List

All endpoints are prefixed with `/api`.

## Auth
- POST/GET/POST `/auth/admin/login|session|logout`
- POST/GET/POST `/auth/student/login|session|logout`
- POST/GET/POST `/auth/accountant-student/login|session|logout`
- POST/GET/POST `/auth/library/login|session|logout`
- POST/GET/POST `/auth/accountant-main/login|session|logout`
- POST/GET/POST `/auth/accountant-non-teaching/login|session|logout`
- POST/GET/POST `/auth/accountant-teaching/login|session|logout`

## CRUD resources
For each resource below: `GET /resource`, `GET /resource/:id`, `POST /resource`, `PUT /resource/:id`, `PATCH /resource/:id`, `DELETE /resource/:id`.

- students
- staff
- attendance
- fees
- salary
- expenses
- notices
- events
- leave-applications
- books
- library-members
- book-issues
- book-returns
- fines
- library-clearance
- admissions
- exams
- results
- certificates
- parent-info
- calendar-events
- transactions
- settings

## Special endpoints
- GET `/health`
- GET `/dashboard/summary`
- POST `/library/issue`
- POST `/library/return/:id`

## Query parameters
List endpoints support bounded `page`, `limit`, `search`, `sort`, and date range parameters where relevant. `limit` is capped at 100.
