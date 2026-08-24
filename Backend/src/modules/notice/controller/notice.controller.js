const { crudController } = require("../../../utils/crudFactory");
const catchAsync = require("../../../utils/catchAsync");
const Notice = require("../model/Notice");
const NoticeRead = require("../model/NoticeRead");

const base = crudController(Notice, { filterableFields: ["category", "priority"] });

const markRead = catchAsync(async (req, res) => {
  await NoticeRead.updateOne(
    { noticeId: req.params.id, userId: req.user._id },
    { $set: { readAt: new Date() } },
    { upsert: true }
  );
  res.json({ success: true, data: null });
});

// Adds a computed `unread` flag for the requesting user instead of storing it on Notice.
const listForUser = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.priority) filter.priority = req.query.priority;

  const notices = await Notice.find(filter).sort({ date: -1 }).lean();
  const reads = await NoticeRead.find({ userId: req.user._id }).lean();
  const readIds = new Set(reads.map((r) => r.noticeId.toString()));

  const data = notices.map((n) => ({ ...n, unread: !readIds.has(n._id.toString()) }));
  res.json({ success: true, data });
});

module.exports = { ...base, list: listForUser, markRead };
