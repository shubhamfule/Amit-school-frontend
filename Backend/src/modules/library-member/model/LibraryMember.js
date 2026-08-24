const mongoose = require("mongoose");

const libraryMemberSchema = new mongoose.Schema(
  {
    personId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "memberType" },
    memberType: { type: String, enum: ["Student", "Staff"], required: true },
    membershipStatus: { type: String, enum: ["Active", "Suspended"], default: "Active" },
  },
  { timestamps: true }
);

libraryMemberSchema.index({ personId: 1, memberType: 1 }, { unique: true });

module.exports = mongoose.model("LibraryMember", libraryMemberSchema);
