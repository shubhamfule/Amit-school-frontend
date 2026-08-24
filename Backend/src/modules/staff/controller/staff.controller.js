const { crudController } = require("../../../utils/crudFactory");
const Staff = require("../model/Staff");

module.exports = crudController(Staff, { filterableFields: ["staffType", "status", "department"] });
