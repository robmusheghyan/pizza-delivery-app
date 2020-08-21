const { writeStatus } = require("../utils/server");
const UsersUtils = require("../utils/usersUtils");
const config = require("../../config");
const UsersService = require("../services/UsersService");
const serviceDecorator = require("../dto-converters/service-decorators");
const converter = require("../dto-converters/user");

const service = new UsersService();

/*
 * Get the current user data
 */

exports.getCurrentUser = async function(req, res) {
  const id = req.user.id;

  if (!id) {
    return writeStatus(res, true, {
      status: config.BadRequestError,
      message: "Bad Request. User is not logined"
    });
  }
  try {
    const result = await serviceDecorator.getById(service, converter, id);
    if (!result) {
      writeStatus(res, true, {
        status: config.BadRequestError,
        message: "Error with getting data, please recheck your permissions."
      });
      return;
    }
    writeStatus(res, false, {
      token: UsersUtils.generateToken(result),
      user: result
    });
  } catch (err) {
    writeStatus(res, true, {
      status: config.ServerError,
      message: "Error with getting data."
    });
  }
};

/*
 * Update the user
 */
exports.updateUser = async function(req, res) {
  const id = req.params.id;

  if (!id) {
    return writeStatus(res, true, {
      status: config.BadRequestError,
      message: "Bad Request. User is not logined."
    });
  }

  try {
    const result = await serviceDecorator.update(
      service,
      converter,
      id,
      req.body
    );
    writeStatus(res, false, { data: result });
  } catch (err) {
    writeStatus(res, true, {
      status: config.ServerError,
      message: "Error with server."
    });
  }
};

/*
 * Change user password
 */
exports.changeUserPassword = async function(req, res) {
  const id = req.params.id;
  const { currentPassword, newPassword } = req.body;

  if (!id) {
    return writeStatus(res, true, {
      status: config.BadRequestError,
      message: "Bad Request. User is not selected."
    });
  }

  if (!currentPassword || !newPassword) {
    return writeStatus(res, true, {
      status: config.BadRequestError,
      message: "Bad Request. Current and New Passwords is required."
    });
  }

  try {
    const user = await service.getById(id);
    if (!user) {
      return writeStatus(res, true, {
        status: config.NotFoundStatus,
        message: ""
      });
    }
    const passwordIsMatch = await user.comparePassword(currentPassword);
    if (!passwordIsMatch) {
      return writeStatus(res, true, {
        status: config.ForbiddenError,
        message: "Error with getting data, please recheck your permissions."
      });
    }
    const result = user.update({ password: newPassword });
    writeStatus(res, false, { data: result });
  } catch (err) {
    writeStatus(res, true, {
      status: config.ServerError,
      message: "Error with server."
    });
  }
};

// also does unblock
exports.blockUser = async function(req, res) {
  const id = +req.params.id;
  const { block } = req.body;

  if (!id) {
    return writeStatus(res, true, {
      status: config.BadRequestError,
      message: "Bad Request. User is not selected for blocking"
    });
  }

  const data = { owner_id: req.user.id, user_id: id };
  try {
    const result = await service.blockUser(data, block);
    if (!result) {
      writeStatus(res, true, {
        status: config.BadRequestError,
        message: "Error with getting data, please recheck your permissions."
      });
      return;
    }
    writeStatus(res, false, { data: result });
  } catch (err) {
    writeStatus(res, true, {
      status: config.ServerError,
      message: "Error with getting data."
    });
  }
};
