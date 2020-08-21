const guard = require("express-jwt-permissions")({
  requestProperty: "user",
  permissionsProperty: "role"
});
const express = require("express");

const users = express.Router();
const usersController = require("../controllers/userController");
const passport = require("passport");

const requireAuth = passport.authenticate("jwt", { session: false });
const roles = require("../../config").auth.userRoles;
const guards = require("../guards");

users.post(
  "/block/:id",
  requireAuth,
  guard.check([[roles.OWNER]]),
  usersController.blockUser
); // block

module.exports = users;
