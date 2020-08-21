const OrderService = require("../services/OrderService");
const { writeStatus } = require("../utils/server");
const config = require("../../config");

module.exports = async function(req, res, next) {
  const user = req.user;
  const orderId = req.params.id || req.body.order_id;

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
  if (isOwner) {
    next();
    return;
  }

  const restaurant = await item.getRestaurant();
  if (restaurant && restaurant.userId === user.id) {
    next();
    return;
  }
  writeStatus(res, true, {
    status: config.UnauthorizedError,
    message: "Error with requested actions, please recheck your permissions."
  });
};
