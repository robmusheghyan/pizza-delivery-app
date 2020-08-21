const { assignByProps } = require("../utils/data");
const _ = require("lodash");

/**
 * toDTO
 *
 * Takes the data from the model as an argument and converts it into data transfer object
 * It helps to provide the restaurants data in the same format and
 * with the same properties and avoid providing kind of secret data and so on
 *
 */

function toDTO(model) {
  const record = _.has(model, "record") ? model.record : model;
  return {
    id: record.id,
    restaurant_id: record.restaurantId,
    user_id: record.userId,
    created_at: record.createdAt,
    updated_at: record.updatedAt,
    status_histories: record.status_histories,
    status: record.status,
    blocked: record.blocked,
    meals: record.meals
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

function fromDTO(dto, type) {
  const props = ["user_id", "restaurant_id", "order_meals", "status"];

  return assignByProps(dto, props);
}

module.exports = {
  fromDTO,
  toDTO
};
