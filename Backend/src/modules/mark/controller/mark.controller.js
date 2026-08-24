const { crudController } = require("../../../utils/crudFactory");
const Mark = require("../model/Mark");

module.exports = crudController(Mark, { filterableFields: ["studentId", "subject", "examId"] });
