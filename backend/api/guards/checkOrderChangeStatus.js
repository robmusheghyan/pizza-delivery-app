const OrderService = require("../services/OrderService");
const { writeStatus } = require("../utils/server");
const config = require("../../config");
const status = require("../data/status");

module.exports = async function(req, res, next) {
  const user = req.user;
  const orderId = req.params.id || req.body.order_id;
  const newStatus = req.body.status;

  const service = new OrderService();
  const item = orderId && (await service.getById(orderId));

  if (!item) {
    writeStatus(res, true, {
      status: config.UnauthorizedError,
      message: "Error with requested actions, please recheck your permissions."
    });
    return;
  }

  const isOwner = item.userId === user.id;
  if (isOwner && status.userAllowed[item.status] === newStatus) {
    next();
    return;
  }

  const restaurant = await item.getRestaurant();
  if (
    restaurant &&
    restaurant.userId === user.id &&
    status.ownerAllowed[item.status] === newStatus
  ) {
    next();
    return;
  }

  writeStatus(res, true, {
    status: config.UnauthorizedError,
    message: "Error with requested actions, please recheck your permissions."
  });
};
