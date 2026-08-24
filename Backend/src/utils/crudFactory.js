// Generic CRUD service/controller pair for resources with no meaningful
// business logic beyond create/read/update/delete/list. Business-logic-heavy
// modules (attendance, library issue/return, fee payments, salary) do NOT use
// this — they get their own hand-written service/controller.
const catchAsync = require("./catchAsync");
const ApiError = require("./ApiError");

function crudService(Model) {
  return {
    create: (data) => Model.create(data),
    list: (filter = {}, options = {}) => {
      let query = Model.find(filter);
      if (options.populate) query = query.populate(options.populate);
      if (options.sort) query = query.sort(options.sort);
      return query;
    },
    getById: async (id, options = {}) => {
      let query = Model.findById(id);
      if (options.populate) query = query.populate(options.populate);
      const doc = await query;
      if (!doc) throw new ApiError(404, `${Model.modelName} not found`);
      return doc;
    },
    updateById: async (id, data) => {
      const doc = await Model.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });
      if (!doc) throw new ApiError(404, `${Model.modelName} not found`);
      return doc;
    },
    deleteById: async (id) => {
      const doc = await Model.findByIdAndDelete(id);
      if (!doc) throw new ApiError(404, `${Model.modelName} not found`);
      return doc;
    },
  };
}

function crudController(Model, { populate, filterableFields = [] } = {}) {
  const service = crudService(Model);

  const buildFilter = (query) => {
    const filter = {};
    for (const field of filterableFields) {
      if (query[field] !== undefined) filter[field] = query[field];
    }
    return filter;
  };

  return {
    create: catchAsync(async (req, res) => {
      const doc = await service.create(req.body);
      res.status(201).json({ success: true, data: doc });
    }),
    list: catchAsync(async (req, res) => {
      const docs = await service.list(buildFilter(req.query), { populate });
      res.json({ success: true, data: docs });
    }),
    getById: catchAsync(async (req, res) => {
      const doc = await service.getById(req.params.id, { populate });
      res.json({ success: true, data: doc });
    }),
    updateById: catchAsync(async (req, res) => {
      const doc = await service.updateById(req.params.id, req.body);
      res.json({ success: true, data: doc });
    }),
    deleteById: catchAsync(async (req, res) => {
      await service.deleteById(req.params.id);
      res.status(204).send();
    }),
  };
}

module.exports = { crudService, crudController };
