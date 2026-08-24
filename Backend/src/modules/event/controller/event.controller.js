const { crudController } = require("../../../utils/crudFactory");
const Event = require("../model/Event");

module.exports = crudController(Event, { filterableFields: ["type", "status"] });
