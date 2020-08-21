const guard = require("express-jwt-permissions")({
  requestProperty: "user",
  permissionsProperty: "role"
});
const express = require("express");

const restaurants = express.Router();
const restaurantsController = require("../controllers/restaurantController");
const passport = require("passport");

const requireAuth = passport.authenticate("jwt", { session: false });
const roles = require("../../config").auth.userRoles;
const guards = require("../guards");

restaurants.get("/", requireAuth, restaurantsController.getRestaurants); // GET RESTAURANTS

restaurants.get("/:id", requireAuth, restaurantsController.getRestaurant); // GET RESTAURANT

restaurants.post(
  "/",
  requireAuth,
  guard.check([[roles.OWNER]]),
  restaurantsController.createRestaurant
); // POST RESTAURANT

restaurants.put(
  "/:id",
  requireAuth,
  guard.check([[roles.OWNER]]),
  guards.checkRestaurantOwner,
  restaurantsController.updateRestaurant
); // PUT RESTAURANT

restaurants.delete(
  "/:id",
  requireAuth,
  guard.check([[roles.OWNER]]),
  guards.checkRestaurantOwner,
  restaurantsController.deleteRestaurant
); // DELETE RESTAURANT

module.exports = restaurants;
