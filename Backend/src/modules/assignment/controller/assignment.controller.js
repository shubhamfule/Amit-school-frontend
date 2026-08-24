const { crudController } = require("../../../utils/crudFactory");
const Assignment = require("../model/Assignment");

module.exports = crudController(Assignment, { filterableFields: ["class", "subject", "status", "teacherId"] });
