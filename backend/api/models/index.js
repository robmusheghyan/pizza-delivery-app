const Meal = require("./Meal");
const Order = require("./Order");
const Restaurant = require("./Restaurant");
const StatusHistory = require("./StatusHistory");
const User = require("./User");
const OrderMeals = require("./OrderMeals");

const models = {
  Meal,
  Order,
  Restaurant,
  StatusHistory,
  User,
  OrderMeals
};

Object.values(models).forEach(
  Model => Model.associate && Model.associate(models)
);

module.exports = models;
