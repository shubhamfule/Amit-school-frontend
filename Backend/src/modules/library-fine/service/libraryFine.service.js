const ApiError = require("../../../utils/ApiError");
const LibraryFine = require("../model/LibraryFine");

async function clear(id, { remarks }) {
  const fine = await LibraryFine.findById(id);
  if (!fine) throw new ApiError(404, "Fine record not found");
  if (fine.status === "Cleared") throw new ApiError(409, "Fine is already cleared");

  fine.status = "Cleared";
  fine.clearedAt = new Date();
  if (remarks) fine.remarks = remarks;
  await fine.save();
  return fine;
}

module.exports = { clear };
