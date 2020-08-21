const Sequelize = require("sequelize");
const bcryptHelper = require("../utils/bcrypt");
const bcrypt = require("bcrypt");

const sequelize = require("../../config/database");

const hooks = {
  beforeCreate(user) {
    user.password = bcryptHelper().password(user); // eslint-disable-line no-param-reassign
  }
};

const tableName = "users";

class User extends Sequelize.Model {}

User.init(
  {
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    first_name: {
      type: Sequelize.TEXT
    },
    last_name: {
      type: Sequelize.TEXT
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    role: {
      type: Sequelize.ENUM,
      values: ["owner", "regular"],
      defaultValue: "regular"
    }
  },
  { sequelize, modelName: tableName, hooks }
);

User.associate = function(models) {
  User.hasMany(models.Restaurant, { constraints: false });
  User.hasMany(models.Order, { constraints: false });
  User.belongsToMany(models.User, {
    constraints: false,
    through: "blocked_users",
    as: "owner_blocked_users",
    foreignKey: "userId"
  });
  User.belongsToMany(models.User, {
    constraints: false,
    through: "blocked_users",
    as: "user_blocked_by",
    foreignKey: "ownerBlockedUserId"
  });
};

User.prototype.comparePassword = async function(passwordAttempt) {
  const isMatch = await bcrypt.compare(passwordAttempt, this.password);
  return isMatch;
};

module.exports = User;
