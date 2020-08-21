const authRoutes = require("./authRoutes");
const usersRoutes = require("./usersRoutes");
const restaurantsRoutes = require("./restaurantsRoutes");
const ordersRoutes = require("./orderRoutes");
const mealsRoutes = require("./mealRoutes");

module.exports = function(app) {
  app.use("/auth", authRoutes);
  app.use("/users", usersRoutes);
  app.use("/restaurants", restaurantsRoutes);
  app.use("/order", ordersRoutes);
  app.use("/meals", mealsRoutes);
};
