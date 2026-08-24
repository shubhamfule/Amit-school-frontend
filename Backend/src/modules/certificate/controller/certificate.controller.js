const { crudController } = require("../../../utils/crudFactory");
const Certificate = require("../model/Certificate");

module.exports = crudController(Certificate, { filterableFields: ["studentId", "category"] });
