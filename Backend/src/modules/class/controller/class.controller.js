const { crudController } = require("../../../utils/crudFactory");
const catchAsync = require("../../../utils/catchAsync");
const Class = require("../model/Class");
const Student = require("../../student/model/Student");

const base = crudController(Class, { populate: "classTeacherId" });

// Overrides list to include a live student headcount instead of a stored,
// driftable number (see Phase 1 mapping: computed studentCount).
const listWithCounts = catchAsync(async (req, res) => {
  const classes = await Class.find().populate("classTeacherId").lean();
  const counts = await Student.aggregate([{ $group: { _id: "$class", count: { $sum: 1 } } }]);
  const countByKey = Object.fromEntries(counts.map((c) => [c._id, c.count]));
  const data = classes.map((c) => ({ ...c, studentCount: countByKey[c.key] || 0 }));
  res.json({ success: true, data });
});

module.exports = { ...base, list: listWithCounts };
