// Reference/documentation schemas mirroring every Backend/src/modules/*/model
// as committed at 67d6460. Not runtime validators — the source of truth is
// always the backend Mongoose model + Joi validation; update these by hand
// whenever those change.

export { StudentSchema } from './student.schema';
export { StaffSchema } from './staff.schema';
export { AttendanceSchema } from './attendance.schema';
export { ClassSchema } from './class.schema';
export { ExamSchema } from './exam.schema';
export { MarkSchema } from './mark.schema';
export { AssignmentSchema } from './assignment.schema';
export { ScheduleEntrySchema } from './schedule.schema';
export { NoticeSchema } from './notice.schema';
export { EventSchema } from './event.schema';
export { CertificateSchema } from './certificate.schema';
export { BookSchema } from './book.schema';
export { BookIssueSchema } from './bookIssue.schema';
export { LibraryMemberSchema } from './libraryMember.schema';
export { LibraryFineSchema } from './libraryFine.schema';
export { StudentFeeSchema } from './studentFee.schema';
export { FeePaymentSchema } from './feePayment.schema';
export { SalaryPaymentSchema } from './salaryPayment.schema';
export { ExpenseSchema } from './expense.schema';
export { TransactionSchema } from './transaction.schema';
export { SettingsSchema } from './settings.schema';
export { LeaveApplicationSchema } from './leaveApplication.schema';
export { UserSchema, ROLES } from './user.schema';
