const _ = require("lodash");

/**
 * This class some kind of implementation of adapter design pattern but instead
 * using inheritance it's is using composition to provide better flexibility. Main purpose
 * of this class to reduce redundant code in controllers related with dto to model and model to
 * dto conversation.
 */

module.exports.getById = async function(service, mapper, id) {
  const model = await service.getById(id);
  return model && mapper.toDTO(model);
};

module.exports.getBy = async function(service, mapper, ...args) {
  const model = await service.getBy(...args);
  return model && mapper.toDTO(model);
};

module.exports.getList = async function(service, mapper, ...args) {
  const data = await service.getList(...args);
  data.rows = _.map(data.rows, item => mapper.toDTO(item));
  return data;
};

module.exports.create = async function(service, mapper, ...args) {
  const dataFromDTO = mapper.fromDTO(...args, "create");
  const model = await service.create(dataFromDTO);
  return mapper.toDTO(model);
};

module.exports.update = async function(service, mapper, id, data) {
  const dataFromDTO = mapper.fromDTO(data);
  const model = await service.update(id, dataFromDTO, { new: true });
  return mapper.toDTO(model);
};

module.exports.delete = function(service, mapper, id) {
  return service.delete(id);
};
