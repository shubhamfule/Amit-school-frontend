const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    notifications: { type: mongoose.Schema.Types.Mixed, default: {} },
    rules: { type: mongoose.Schema.Types.Mixed, default: {} },
    theme: { type: String, enum: ["light", "dark", "system"], default: "system" },
    twoFactorEnabled: { type: Boolean, default: false },
    autoBackup: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);
