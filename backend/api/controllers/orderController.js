const { writeStatus } = require("../utils/server");
const _ = require("lodash");
const config = require("../../config");
const userRoles = require("../../config").auth.userRoles;
const OrderService = require("../services/OrderService");
const RestaurantService = require("../services/RestaurantsService");
const UserService = require("../services/UsersService");
const serviceDecorator = require("../dto-converters/service-decorators");
const converter = require("../dto-converters/order");
const paginationConverter = require("../dto-converters/pagination");

const service = new OrderService();
const restaurantService = new RestaurantService();
const userService = new UserService();

exports.createOrder = async (req, res) => {
  const { restaurant_id, order_meals } = req.body;

  if (!restaurant_id) {
    return writeStatus(res, true, {
      status: config.BadRequestError,
      message: "Bad Request. Please select the restaurant."
    });
  }

  const restaurant = await restaurantService.getById(restaurant_id);
  if (!restaurant) {
    return writeStatus(res, true, {
      status: config.BadRequestError,
      message: "Bad Request. Please select the Meals."
    });
  }
  const owner = await restaurant.getUser();
  const blockedUsers = await owner.getOwner_blocked_users();
  const userBlocked =
    blockedUsers.filter(user => user.id === req.user.id).length > 0;
  if (userBlocked) {
    return writeStatus(res, true, {
      status: config.BadRequestError,
      message: "Bad Request. User is blocked by restaurant owner."
    });
  }

  if (!order_meals || !_.isArray(order_meals) || _.isEmpty(order_meals)) {
    return writeStatus(res, true, {
      status: config.BadRequestError,
      message: "Bad Request. Please select the Meals."
    });
  }
  const orderData = { ...req.body, user_id: req.user.id };
  try {
    const createdOrder = await serviceDecorator.create(
      service,
      converter,
      orderData
    );
    writeStatus(res, false, { data: createdOrder });
  } catch (err) {
    writeStatus(res, true, {
      status: config.ServerError,
      message: "Server Error, please try later"
    });
  }
};
exports.changeStatus = async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return writeStatus(res, true, {
      status: config.BadRequestError,
      message: "Bad Request.Please select the order."
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
    console.log(err);
    writeStatus(res, true, {
      status: config.ServerError,
      message: "Error with getting data, please contact to administrator."
    });
  }
};

exports.getOrders = async (req, res) => {
  const reqParams = req.query;
  const paginationParams = paginationConverter.fromDTO(reqParams);
  const isOwner = req.user.role === userRoles.OWNER;
  let filter;
  if (isOwner) {
    const restaurants = await restaurantService.getList({
      where: {
        user_id: req.user.id
      }
    });
    const restaurantIds = restaurants.rows.map(restaurant => restaurant.id);
    filter = {
      where: {
        restaurant_id: [...restaurantIds]
      }
    };
  } else {
    filter = {
      where: {
        user_id: req.user.id
      }
    };
  }
  try {
    const result = await serviceDecorator.getList(service, converter, {
      ...filter,
      ...paginationParams
    });
    writeStatus(res, false, { data: result });
  } catch (err) {
    console.log(err);
    writeStatus(res, true, {
      status: config.ServerError,
      message: "Error with getting data, please try later."
    });
  }
};

exports.getOrder = async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return writeStatus(res, true, {
      status: config.BadRequestError,
      message: "Bad Request. Please select the order"
    });
  }
  try {
    const result = await serviceDecorator.get(service, converter, id);
    if (!result) {
      writeStatus(res, true, {
        status: config.BadRequestError,
        message: "Error with getting data, please recheck your permissions."
      });
      return;
    }
    writeStatus(res, false, { data: result });
  } catch (err) {
    console.log(err);
    writeStatus(res, true, {
      status: config.ServerError,
      message: "Error with getting data, please recheck your permissions."
    });
  }
};
