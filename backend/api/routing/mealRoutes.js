const guard = require("express-jwt-permissions")({
  requestProperty: "user",
  permissionsProperty: "role"
});

const express = require("express");

const meals = express.Router();
const mealsController = require("../controllers/mealController");
const passport = require("passport");

const requireAuth = passport.authenticate("jwt", { session: false });
const roles = require("../../config").auth.userRoles;
const guards = require("../guards");

meals.get(
    "/restaurant/:restaurant_id",
    requireAuth,
    mealsController.getMeals
); // GET MEALS OF A RESTAURANT

meals.get(
  "/:id",
  requireAuth,
  guard.check([[roles.REGULAR], [roles.OWNER]]),
  mealsController.getMeal
); // GET RESTAURANT

meals.post(
  "/",
  requireAuth,
  guard.check([[roles.OWNER]]),
  guards.checkRestaurantOwner,
  mealsController.createMeal
); // POST RESTAURANT

meals.put(
  "/:id",
  requireAuth,
  guard.check([[roles.OWNER]]),
  guards.checkMealOwner,
  mealsController.updateMeal
); // PUT RESTAURANT

meals.delete(
  "/:id",
  requireAuth,
  guard.check([[roles.OWNER]]),
  guards.checkMealOwner,
  mealsController.deleteMeal
); // DELETE RESTAURANT

module.exports = meals;
