const Sequelize = require("sequelize");
const sequelize = require("../../config/database");
const tableName = "order_meals";

class OrderMeals extends Sequelize.Model {}

OrderMeals.init(
  {
    count: {
      type: Sequelize.INTEGER
    }
  },
  {
    sequelize,
    modelName: tableName,
    underscored: true
  }
);

module.exports = OrderMeals;
