const jwt = require("jsonwebtoken");
const authConfig = require("../../config").auth;

class UsersUtils {
  /*
   * Generate JWT Token
   */
  generateToken(user) {
    return jwt.sign(user, authConfig.secret, {
      expiresIn: parseInt(authConfig.tokenExpiration, 10)
    });
  }
}

module.exports = new UsersUtils();
