const guard = require("express-jwt-permissions")({
  requestProperty: "user",
  permissionsProperty: "role"
});
const guards = require("../guards");
const express = require("express");
const passport = require("passport");

const orders = express.Router();
const orderController = require("../controllers/orderController");
const roles = require("../../config").auth.userRoles;

const requireAuth = passport.authenticate("jwt", { session: false });

orders.post(
  "/",
  requireAuth,
  guard.check([[roles.REGULAR]]),
  orderController.createOrder
);

orders.get(
  "/:id",
  requireAuth,
  guard.check([[roles.REGULAR], [roles.OWNER]]),
  guards.checkOrderOwner,
  orderController.getOrder
); // GET ORDER

orders.get(
  "/",
  requireAuth,
  guard.check([[roles.REGULAR], [roles.OWNER]]),
  orderController.getOrders
); // GET ORDERS

orders.put(
  "/changeStatus/:id",
  requireAuth,
  guards.checkOrderChangeStatus,
  orderController.changeStatus
);

module.exports = orders;
