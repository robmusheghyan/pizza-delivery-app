const BaseService = require("./BaseService");
const User = require("../models/User");
const { isValidEmail } = require("../utils/validation");

// const uid = require('uid');

class UsersService extends BaseService {
  constructor() {
    super(User);
  }

  async create(data) {
    const email = data.email.toLowerCase();
    const user = await this.getBy({ where: { email } }, false);
    if (user) {
      throw new Error("User with such mail exist.");
    }
    return super.create(data);
  }

  async isInvalidEmail(email) {
    if (!isValidEmail(email)) {
      return { message: "Invalid email", error: true };
    }
    const user = await this.getBy({ where: { email } }, false);
    if (user) {
      return { message: "Email already taken", error: true };
    }

    return false;
  }

  async blockUser(data, block) {
    const { user_id, owner_id } = data;
    let model = {};
    const owner = await this.getById(owner_id);
    if (owner) {
      if (block) {
        model = await owner.addOwner_blocked_user(user_id);
      } else {
        model = owner.removeOwner_blocked_user(user_id);
      }
    }
    return model;
  }
}

module.exports = UsersService;
