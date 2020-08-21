const Sequelize = require("sequelize");
const sequelize = require("../../config/database");
const statuses = require("../data/status").all;
const StatusHistory = require("./StatusHistory");
const OrderMeals = require("./OrderMeals");

const tableName = "orders";

class Order extends Sequelize.Model {}

Order.init(
  {
    status: {
      type: Sequelize.ENUM,
      values: statuses,
      defaultValue: statuses[0]
    }
  },
  {
    sequelize,
    modelName: tableName,
    underscored: true,
    defaultScope: {
      include: [
        {
          model: StatusHistory
        }
      ]
    }
  }
);

Order.associate = function(models) {
  Order.belongsToMany(
    models.Meal,
    {
      through: OrderMeals
    },
    { constraints: false }
  );
  Order.hasMany(models.StatusHistory, { constraints: false });
  Order.belongsTo(models.User, { constraints: false });
  Order.belongsTo(models.Restaurant, { constraints: false });
};

module.exports = Order;
