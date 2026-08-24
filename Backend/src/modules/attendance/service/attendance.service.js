const Attendance = require("../model/Attendance");

function toDayStart(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

async function bulkMark({ date, records }, markedBy) {
  const day = toDayStart(date);

  const ops = records.map((r) => ({
    updateOne: {
      filter: { personId: r.personId, date: day },
      update: {
        $set: {
          personType: r.personType,
          class: r.class,
          status: r.status,
          remarks: r.remarks,
          markedBy,
        },
      },
      upsert: true,
    },
  }));

  await Attendance.bulkWrite(ops);
  return Attendance.find({ date: day, personId: { $in: records.map((r) => r.personId) } });
}

async function listByDate(query) {
  const filter = {};
  if (query.date) filter.date = toDayStart(query.date);
  if (query.from || query.to) {
    filter.date = {};
    if (query.from) filter.date.$gte = toDayStart(query.from);
    if (query.to) filter.date.$lte = toDayStart(query.to);
  }
  if (query.personId) filter.personId = query.personId;
  if (query.personType) filter.personType = query.personType;
  if (query.class) filter.class = query.class;

  return Attendance.find(filter).sort({ date: 1 });
}

// Computed attendance % over a range — replaces every hardcoded "92%" in the frontend mocks.
async function statsForPerson(personId, { from, to } = {}) {
  const match = { personId: new (require("mongoose").Types.ObjectId)(personId) };
  if (from || to) {
    match.date = {};
    if (from) match.date.$gte = toDayStart(from);
    if (to) match.date.$lte = toDayStart(to);
  }

  const rows = await Attendance.aggregate([
    { $match: match },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const byStatus = Object.fromEntries(rows.map((r) => [r._id, r.count]));
  const marked = (byStatus.present || 0) + (byStatus.absent || 0);
  const percentage = marked > 0 ? Math.round(((byStatus.present || 0) / marked) * 100) : 0;

  return {
    present: byStatus.present || 0,
    absent: byStatus.absent || 0,
    leave: byStatus.leave || 0,
    holiday: byStatus.holiday || 0,
    percentage,
  };
}

module.exports = { bulkMark, listByDate, statsForPerson, toDayStart };
