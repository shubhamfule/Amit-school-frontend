const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const { clientOrigin, nodeEnv } = require("./config/env");
const { notFound, errorHandler } = require("./middleware/error");

const authRoutes = require("./modules/auth/routes/auth.routes");
const studentRoutes = require("./modules/student/routes/student.routes");
const staffRoutes = require("./modules/staff/routes/staff.routes");
const attendanceRoutes = require("./modules/attendance/routes/attendance.routes");
const classRoutes = require("./modules/class/routes/class.routes");
const examRoutes = require("./modules/exam/routes/exam.routes");
const markRoutes = require("./modules/mark/routes/mark.routes");
const assignmentRoutes = require("./modules/assignment/routes/assignment.routes");
const scheduleRoutes = require("./modules/schedule/routes/schedule.routes");
const noticeRoutes = require("./modules/notice/routes/notice.routes");
const eventRoutes = require("./modules/event/routes/event.routes");
const certificateRoutes = require("./modules/certificate/routes/certificate.routes");
const bookRoutes = require("./modules/book/routes/book.routes");
const bookIssueRoutes = require("./modules/book-issue/routes/bookIssue.routes");
const libraryMemberRoutes = require("./modules/library-member/routes/libraryMember.routes");
const libraryFineRoutes = require("./modules/library-fine/routes/libraryFine.routes");
const studentFeeRoutes = require("./modules/student-fee/routes/studentFee.routes");
const feePaymentRoutes = require("./modules/fee-payment/routes/feePayment.routes");
const salaryRoutes = require("./modules/salary/routes/salary.routes");
const expenseRoutes = require("./modules/expense/routes/expense.routes");
const transactionRoutes = require("./modules/transaction/routes/transaction.routes");
const settingsRoutes = require("./modules/settings/routes/settings.routes");
const leaveRoutes = require("./modules/leave/routes/leave.routes");

const app = express();

app.use(cors({ origin: clientOrigin, credentials: true }));
app.use(express.json());
app.use(cookieParser());
if (nodeEnv !== "test") app.use(morgan("dev"));

app.get("/health", (req, res) => res.json({ success: true, data: { status: "ok" } }));

// Mount paths match what the frontend's api.js actually calls
// (e.g. /students, /schedule, /library, /assignments, /leave, /marks).
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/marks", markRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/library", bookRoutes);
app.use("/api/book-issues", bookIssueRoutes);
app.use("/api/library-members", libraryMemberRoutes);
app.use("/api/library-fines", libraryFineRoutes);
app.use("/api/student-fees", studentFeeRoutes);
app.use("/api/fee-payments", feePaymentRoutes);
app.use("/api/salary", salaryRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/leave", leaveRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
