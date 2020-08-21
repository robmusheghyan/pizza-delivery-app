const { writeStatus } = require("../utils/server");
const config = require("../../config");
const MealsService = require("../services/MealsService");
const serviceDecorator = require("../dto-converters/service-decorators");
const converter = require("../dto-converters/Meals");
const RestaurantService = require("../services/RestaurantsService");
const paginationConverter = require("../dto-converters/pagination");

const service = new MealsService();
const restaurantService = new RestaurantService();

/*
 * Get list of Meals
 */
exports.getMeals = async function(req, res) {
  const restaurant_id = req.params.restaurant_id;

  const reqParams = req.params;
  const paginationParams = paginationConverter.fromDTO(reqParams);
  if (!restaurant_id) {
    return writeStatus(res, true, {
      status: config.NotFoundStatus,
      message: "Restaurant not found"
    });
  }

  const restaurant = await restaurantService.getById(restaurant_id);

  if (!restaurant) {
    return writeStatus(res, true, {
      status: config.BadRequestError,
      message: "Bad Request. Please select valid restaurant"
    });
  }

  let filters = { restaurant_id };
  try {
    const result = await serviceDecorator.getList(service, converter, {
      filters: filters,
      ...paginationParams
    });
    writeStatus(res, false, { data: result });
  } catch (err) {
    writeStatus(res, true, {
      status: config.ServerError,
      message: "Error with server."
    });
  }
};

/*
 * Create a Meal
 */
exports.createMeal = async function(req, res) {
  const { name, price, description } = req.body;

  if (!name) {
    return writeStatus(res, true, {
      status: config.BadRequestError,
      message: "Bad Request. Name is required."
    });
  }
  if (!description) {
    return writeStatus(res, true, {
      status: config.BadRequestError,
      message: "Bad Request. Description is required."
    });
  }
  if (!price) {
    return writeStatus(res, true, {
      status: config.BadRequestError,
      message: "Bad Request. Price is required."
    });
  }

  try {
    const createdMeal = await serviceDecorator.create(
      service,
      converter,
      req.body
    );
    writeStatus(res, false, { data: createdMeal });
  } catch (err) {
    writeStatus(res, true, {
      status: config.ServerError,
      message: "Error with server."
    });
  }
};

/*
 * Get specific Meal by id
 */

exports.getMeal = async function(req, res) {
  const id = req.params.id;

  if (!id) {
    return writeStatus(res, true, {
      status: config.BadRequestError,
      message: "Bad Request. Meal is not selected"
    });
  }
  try {
    const result = await serviceDecorator.getById(service, converter, id);
    if (!result) {
      writeStatus(res, true, {
        status: config.NotFoundStatus,
        message: "Meal not found."
      });
      return;
    }
    writeStatus(res, false, { data: result });
  } catch (err) {
    writeStatus(res, true, {
      status: config.ServerError,
      message: "Server error."
    });
  }
};

/*
 * Update the Meal
 */
exports.updateMeal = async function(req, res) {
  const id = req.params.id;

  if (!id) {
    return writeStatus(res, true, {
      status: config.BadRequestError,
      message: "Bad Request. Meal is not selected."
    });
  }

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
      message: "Error with server."
    });
  }
};

/*
 * Delete Meal
 */
exports.deleteMeal = async function(req, res) {
  const id = req.params.id;

  if (!id) {
    return writeStatus(res, true, {
      status: config.BadRequestError,
      message: "Bad Request. Meal is not selected."
    });
  }
  try {
    const result = await service.delete(id);
    writeStatus(res, false, { data: result });
  } catch (err) {
    writeStatus(res, true, {
      status: config.ServerError,
      message: "Error with server."
    });
  }
};
