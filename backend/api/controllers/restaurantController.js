const { writeStatus } = require("../utils/server");
const config = require("../../config");
const userRoles = require("../../config").auth.userRoles;
const RestaurantsService = require("../services/RestaurantsService");
const serviceDecorator = require("../dto-converters/service-decorators");
const converter = require("../dto-converters/restaurants");
const paginationConverter = require("../dto-converters/pagination");

const service = new RestaurantsService();

/*
 * Get list of restaurants
 */
exports.getRestaurants = async function(req, res) {
  const reqParams = req.query;
  let filters = {
    where: {}
  };
  let additionalData = {};
  if (req.user.role === userRoles.OWNER) {
    filters.where.user_id = req.user.id;
  } else {
    additionalData.customer_id = req.user.id;
  }
  const paginationParams = paginationConverter.fromDTO(reqParams);

  try {
    const result = await serviceDecorator.getList(service, converter, {
      ...filters,
      ...paginationParams,
      ...additionalData
    });
    writeStatus(res, false, { data: result });
  } catch (err) {
    console.log(err);
    writeStatus(res, true, {
      status: config.ServerError,
      message: "Server Error please try later."
    });
  }
};

/*
 * Create a restaurant
 */
exports.createRestaurant = async function(req, res) {
  const { name } = req.body;

  if (!name) {
    return writeStatus(res, true, {
      status: config.BadRequestError,
      message: "Bad Request. Name is required."
    });
  }
  const data = {
    ...req.body,
    user_id: req.user.id
  };
  try {
    const createdRestaurant = await serviceDecorator.create(
      service,
      converter,
      data
    );
    writeStatus(res, false, { data: createdRestaurant });
  } catch (err) {
    writeStatus(res, true, {
      status: config.ServerError,
      message: "Server Error, please try later"
    });
  }
};

/*
 * Get specific restaurant by id
 */

exports.getRestaurant = async function(req, res) {
  const id = req.params.id;

  if (!id) {
    return writeStatus(res, true, {
      status: config.BadRequestError,
      message: "Bad Request. Restaurant is not selected"
    });
  }
  try {
    const result = await serviceDecorator.getById(service, converter, id);
    if (!result) {
      writeStatus(res, true, {
        status: config.NotFoundStatus,
        message: "Restaurant not found."
      });
      return;
    }
    writeStatus(res, false, { data: result });
  } catch (err) {
    console.log(err);
    writeStatus(res, true, {
      status: config.ServerError,
      message: "Server error."
    });
  }
};

/*
 * Update the restaurant
 */
exports.updateRestaurant = async function(req, res) {
  const id = req.params.id;
  const rowData = { ...req.body };

  try {
    const result = await serviceDecorator.update(
      service,
      converter,
      id,
      rowData
    );
    writeStatus(res, false, { data: result });
  } catch (err) {
    writeStatus(res, true, {
      status: config.ServerError,
      message: "Server error, please try later."
    });
  }
};

/*
 * Delete restaurant
 */
exports.deleteRestaurant = async function(req, res) {
  const id = req.params.id;
  try {
    const result = await service.delete(id);
    writeStatus(res, false, { data: result });
  } catch (err) {
    console.log(err);
    writeStatus(res, true, {
      status: config.ServerError,
      message: "Server error, please try later."
    });
  }
};

exports.blockUser = async function(req, res) {};
