const { assignByProps } = require("../utils/data");

/**
 * toDTO
 *
 * Takes the data from the model as an argument and converts it into data transfer object
 * It helps to provide the users data in the same format and with the
 * same properties and avoid providing kind of secret data and so on
 *
 */

function toDTO(model) {
  return {
    _id: model._id,
    id: model.id,
    email: model.email.toLowerCase(),
    created_at: model.created_at,
    updated_at: model.updated_at,
    role: model.role,
    first_name: model.first_name,
    last_name: model.last_name
  };
}

/**
 * fromDTO
 *
 * Takes the data transfer object as an argument and clears all unnecessary properties from that
 *
 * @param dto
 * @param type
 * @returns {*}
 */

function fromDTO(dto, type) {
  const props = ["email", "role", "id", "first_name", "last_name"];

  if (type === "create") {
    props.push("password");
  }

  return assignByProps(dto, props);
}

module.exports = {
  fromDTO,
  toDTO
};
