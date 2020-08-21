const Sequelize = require("sequelize");

const sequelize = require("../../config/database");

const tableName = "restaurants";

class Restaurant extends Sequelize.Model {}

Restaurant.init(
  {
    name: Sequelize.TEXT,
    description: Sequelize.TEXT
  },
  { sequelize, modelName: tableName, underscored: true }
);

Restaurant.associate = function(models) {
  Restaurant.hasMany(models.Meal, { constraints: false });
  Restaurant.hasMany(models.Order, { constraints: false });
  Restaurant.belongsTo(models.User, { constraints: false });
};

Restaurant.prototype.getUserId = async function() {
  return this.owner_id;
};

module.exports = Restaurant;
