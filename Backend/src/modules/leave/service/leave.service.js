const crypto = require("crypto");
const ApiError = require("../../../utils/ApiError");
const LeaveApplication = require("../model/LeaveApplication");

function generateCode() {
  const year = new Date().getFullYear();
  const random = crypto.randomInt(100000, 999999);
  return `SLAP-${year}-${random}`;
}

async function apply(data) {
  return LeaveApplication.create({ ...data, code: generateCode(), appliedOn: new Date() });
}

async function setStatus(id, status, reviewedBy) {
  const leave = await LeaveApplication.findByIdAndUpdate(
    id,
    { status, reviewedBy },
    { new: true, runValidators: true }
  );
  if (!leave) throw new ApiError(404, "Leave application not found");
  return leave;
}

module.exports = { apply, setStatus };
