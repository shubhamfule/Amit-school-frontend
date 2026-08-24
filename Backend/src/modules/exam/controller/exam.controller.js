const { crudController } = require("../../../utils/crudFactory");
const Exam = require("../model/Exam");

module.exports = crudController(Exam, { filterableFields: ["class", "subject", "status"] });
