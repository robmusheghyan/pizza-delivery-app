const RestaurantsService = require("../services/RestaurantsService");
const { writeStatus } = require("../utils/server");
const config = require("../../config");

module.exports = async function(req, res, next) {
  const user = req.user;
  const restaurantId = req.params.id || req.body.restaurant_id;

  const service = new RestaurantsService();
  const item = restaurantId && (await service.getById(restaurantId));

  if (!item) {
    writeStatus(res, true, {
      status: config.UnauthorizedError,
      message: "Error with requested actions, please recheck your permissions."
    });
    return;
  }

  const isOwner = item.userId === user.id;
  if (!isOwner) {
    writeStatus(res, true, {
      status: config.UnauthorizedError,
      message: "Error with requested actions, please recheck your permissions."
    });
    return;
  }

  next();
};
