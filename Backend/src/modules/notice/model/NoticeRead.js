const mongoose = require("mongoose");

// Per-user read-state join, so Notice itself stays a shared document
// (Phase 1 mapping: Notice.unread is computed per-viewer, not a field on Notice).
const noticeReadSchema = new mongoose.Schema(
  {
    noticeId: { type: mongoose.Schema.Types.ObjectId, ref: "Notice", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    readAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

noticeReadSchema.index({ noticeId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("NoticeRead", noticeReadSchema);
