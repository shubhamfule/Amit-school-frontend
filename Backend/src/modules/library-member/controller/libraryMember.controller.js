const { crudController } = require("../../../utils/crudFactory");
const catchAsync = require("../../../utils/catchAsync");
const LibraryMember = require("../model/LibraryMember");
const BookIssue = require("../../book-issue/model/BookIssue");
const LibraryFine = require("../../library-fine/model/LibraryFine");

const base = crudController(LibraryMember);

// issued/returned/record status are all computed live — never stored on the member
// (Phase 1 mapping flagged the mock's static counters as disconnected from real issue data).
const listWithStats = catchAsync(async (req, res) => {
  const members = await LibraryMember.find().lean();
  const memberIds = members.map((m) => m._id);

  const [issuedCounts, returnedCounts, overdueCounts, pendingFines] = await Promise.all([
    BookIssue.aggregate([
      { $match: { memberId: { $in: memberIds }, returnDate: null } },
      { $group: { _id: "$memberId", count: { $sum: 1 } } },
    ]),
    BookIssue.aggregate([
      { $match: { memberId: { $in: memberIds }, returnDate: { $ne: null } } },
      { $group: { _id: "$memberId", count: { $sum: 1 } } },
    ]),
    BookIssue.aggregate([
      { $match: { memberId: { $in: memberIds }, returnDate: null, dueDate: { $lt: new Date() } } },
      { $group: { _id: "$memberId", count: { $sum: 1 } } },
    ]),
    LibraryFine.aggregate([
      { $match: { status: "Pending" } },
      {
        $lookup: {
          from: "bookissues",
          localField: "issueId",
          foreignField: "_id",
          as: "issue",
        },
      },
      { $unwind: "$issue" },
      { $match: { "issue.memberId": { $in: memberIds } } },
      { $group: { _id: "$issue.memberId", count: { $sum: 1 } } },
    ]),
  ]);

  const toMap = (rows) => Object.fromEntries(rows.map((r) => [r._id.toString(), r.count]));
  const issuedMap = toMap(issuedCounts);
  const returnedMap = toMap(returnedCounts);
  const overdueMap = toMap(overdueCounts);
  const fineMap = toMap(pendingFines);

  const data = members.map((m) => {
    const id = m._id.toString();
    const hasOverdue = (overdueMap[id] || 0) > 0;
    const hasFine = (fineMap[id] || 0) > 0;
    return {
      ...m,
      issued: issuedMap[id] || 0,
      returned: returnedMap[id] || 0,
      record: hasOverdue || hasFine ? "Overdue" : (issuedMap[id] || 0) > 0 ? "Active" : "Clear",
    };
  });

  res.json({ success: true, data });
});

module.exports = { ...base, list: listWithStats };
