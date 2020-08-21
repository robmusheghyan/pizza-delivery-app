const BaseService = require("./BaseService");
const Meal = require("../models/Meal");

class MealsService extends BaseService {
  constructor() {
    super(Meal);
  }

  async create(data) {
    const meal = await super.create(data);
    if (data.restaurant_id) {
      await meal.setRestaurant(data.restaurant_id);
    }

    return meal;
  }
}

module.exports = MealsService;
