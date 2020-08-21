const Sequelize = require("sequelize");
const sequelize = require("../../config/database");
const OrderMeals = require("./OrderMeals");

const tableName = "meals";

class Meal extends Sequelize.Model {}

Meal.init(
  {
    name: Sequelize.TEXT,
    description: Sequelize.TEXT,
    price: {
      type: Sequelize.DOUBLE,
      allowNull: false
    }
  },
  { sequelize, modelName: tableName, underscored: true }
);

Meal.associate = function(models) {
  Meal.belongsToMany(
    models.Order,
    {
      through: OrderMeals
    },
    { constraints: false }
  );
  Meal.belongsTo(models.Restaurant, { constraints: false });
};

Meal.prototype.getOwnerId = async function() {
  return this.restaurant_id;
};
module.exports = Meal;
