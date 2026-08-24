const { crudController } = require("../../../utils/crudFactory");
const Student = require("../model/Student");

module.exports = crudController(Student, { filterableFields: ["class", "section", "status"] });
