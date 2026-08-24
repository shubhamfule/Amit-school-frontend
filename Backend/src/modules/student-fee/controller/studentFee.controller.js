const { crudController } = require("../../../utils/crudFactory");
const StudentFee = require("../model/StudentFee");

module.exports = crudController(StudentFee, {
  populate: "studentId",
  filterableFields: ["studentId", "academicYear"],
});
