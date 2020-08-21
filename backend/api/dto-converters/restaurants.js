const { assignByProps } = require("../utils/data");
const _ = require("lodash");

/**
 * toDTO
 *
 * Takes the data from the model as an argument and converts it into data transfer object
 * It helps to provide the restaurants data in the same format and with
 * the same properties and avoid providing kind of secret data and so on
 *
 * */

function toDTO(model) {
  const record = _.has(model, "record") ? model.record : model;
  return {
    id: record.id,
    user_id: record.user_id,
    email: record.email,
    name: record.name,
    description: record.description,
    created_at: record.created_at,
    updated_at: record.updated_at,
    blocked: record.blocked
  };
}

/**
 * fromDTO
 *
 * Takes the data transfer object as an argument and clears all unnecessary properties from that
 *
 * @param dto
 * @returns {*}
 */

function fromDTO(dto) {
  const props = ["user_id", "description", "name", "id"];

  return assignByProps(dto, props);
}

module.exports = {
  fromDTO,
  toDTO
};
