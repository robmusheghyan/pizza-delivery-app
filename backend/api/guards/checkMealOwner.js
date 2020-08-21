const services = require("../services");
const _ = require("lodash");
const { writeStatus } = require("../utils/server");
const config = require("../../config");

module.exports = async function(req, res, next) {
  const user = req.user;
  const id = req.params.id;
  const meal = await services.mealService.getById(id);
  if (meal) {
    const restaurant = await meal.getRestaurant();
    if (restaurant && restaurant.userId === user.id) {
      next();
      return;
    }
  }

  writeStatus(res, true, {
    status: config.UnauthorizedError,
    message: "Error with getting data, please recheck your permissions."
  });
};
