const express = require("express");
const passport = require("passport");

const router = express.Router();
const authenticationController = require("../controllers/authenticationControler");
const passportService = require("../../config/passport");

const loginToPassport = passport.authenticate("local", { session: false });

router.post("/register", authenticationController.register);
router.post("/login", loginToPassport, authenticationController.login);

module.exports = router;
