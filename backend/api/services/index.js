const UsersService = require("./UsersService");
const RestaurantsService = require("./RestaurantsService");
const MealsService = require("./MealsService");

module.exports = {
  usersService: new UsersService(),
  restaurantsService: new RestaurantsService(),
  mealService: new MealsService()
};
