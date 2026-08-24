// April(3)-March session, matching the frontend mock's getAcademicYear() convention.
function getAcademicYear(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = d.getMonth(); // 0-indexed, April = 3
  const startYear = month >= 3 ? year : year - 1;
  return `${startYear}-${String(startYear + 1).slice(2)}`;
}

module.exports = { getAcademicYear };
