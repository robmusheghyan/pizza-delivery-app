const { writeStatus } = require("../utils/server");
const usersUtils = require("../utils/usersUtils");
const serviceDecorators = require("../dto-converters/service-decorators.js");
const UsersService = require("../services/UsersService");
const converter = require("../dto-converters/user");
const config = require("../../config");

const service = new UsersService();

exports.register = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return writeStatus(res, true, {
      status: config.BadRequestError,
      message: "Bad Request. Email and password are required."
    });
  }
  if (password.length < 5) {
    return writeStatus(res, true, {
      status: config.BadRequestError,
      message: "Bad Request. Password should be not less then 5 characters."
    });
  }

  try {
    const userData = {
      ...req.body
    };

    const validationError = await service.isInvalidEmail(email);
    if (validationError) {
      writeStatus(res, true, {
        status: 400,
        success: true,
        message: validationError.message
      });
      return;
    }

    await serviceDecorators.create(service, converter, userData);
    writeStatus(res, false, {
      success: true,
      message: "Your account created, Please login"
    });
  } catch (err) {
    writeStatus(res, true, {
      status: config.ServerError,
      message: "Server error"
    });
  }
};

exports.login = async (req, res) => {
  const userInfo = converter.toDTO(req.user);
  res.json({
    token: usersUtils.generateToken(userInfo),
    user: userInfo
  });
};
