// Routes for every model teacher.js owns, plus the two real bulk endpoints
// the teacher portal's frontend actually calls: POST /attendance/bulk
// (Attendance.jsx) and POST /schedule/bulk (Schedule.jsx's CSV importer).
// Everything else uses the generic crudRouter.

const { Router } = require("express");
const crudRouter = require("../utils/crudRouter");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const { StudentAttendance, Mark, ScheduleEntry, Assignment } = require("../module/Teacher");

const router = Router();

function dayRange(dateStr) {
  const from = new Date(`${dateStr}T00:00:00.000Z`);
  const to = new Date(`${dateStr}T23:59:59.999Z`);
  return { from, to };
}

// GET /attendance?date=YYYY-MM-DD — matches Attendance.jsx's real read call exactly.
const attendanceRouter = Router();
attendanceRouter.get(
  "/",
  catchAsync(async (req, res) => {
    const filter = {};
    if (req.query.date) {
      const { from, to } = dayRange(req.query.date);
      filter.date = { $gte: from, $lte: to };
    }
    const docs = await StudentAttendance.find(filter);
    res.json({ success: true, data: docs });
  })
);
attendanceRouter.post(
  "/bulk",
  catchAsync(async (req, res) => {
    const { date, records } = req.body;
    if (!date || !Array.isArray(records)) throw new ApiError(400, "date and records[] are required");

    const day = new Date(`${date}T00:00:00.000Z`);
    const ops = records.map((r) => ({
      updateOne: {
        filter: { studentId: r.studentId, date: day },
        update: { $set: { studentName: r.studentName, class: r.class, status: r.status, date: day } },
        upsert: true,
      },
    }));
    if (ops.length) await StudentAttendance.bulkWrite(ops);

    const saved = await StudentAttendance.find({
      date: day,
      studentId: { $in: records.map((r) => r.studentId) },
    });
    res.status(201).json({ success: true, data: saved });
  })
);
router.use("/attendance", attendanceRouter);

router.use("/marks", crudRouter(Mark));

// /schedule + POST /schedule/bulk — matches Schedule.jsx's CSV-import call.
const scheduleRouter = crudRouter(ScheduleEntry);
scheduleRouter.post(
  "/bulk",
  catchAsync(async (req, res) => {
    const { entries } = req.body;
    if (!Array.isArray(entries) || entries.length === 0) throw new ApiError(400, "entries[] is required");
    const created = await ScheduleEntry.insertMany(entries);
    res.status(201).json({ success: true, data: created });
  })
);
router.use("/schedule", scheduleRouter);

router.use("/assignments", crudRouter(Assignment));

module.exports = router;
