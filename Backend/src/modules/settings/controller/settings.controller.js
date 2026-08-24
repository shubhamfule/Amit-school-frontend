const catchAsync = require("../../../utils/catchAsync");
const Settings = require("../model/Settings");

const getMine = catchAsync(async (req, res) => {
  let settings = await Settings.findOne({ userId: req.user._id });
  if (!settings) settings = await Settings.create({ userId: req.user._id });
  res.json({ success: true, data: settings });
});

const updateMine = catchAsync(async (req, res) => {
  const settings = await Settings.findOneAndUpdate(
    { userId: req.user._id },
    { $set: req.body },
    { new: true, upsert: true, runValidators: true }
  );
  res.json({ success: true, data: settings });
});

module.exports = { getMine, updateMine };
