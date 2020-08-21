const Sequelize = require("sequelize");
const sequelize = require("../../config/database");
const statuses = require("../data/status").all;

const tableName = "status_history";

class StatusHistory extends Sequelize.Model {}

StatusHistory.init(
  {
    status: {
      type: Sequelize.ENUM,
      values: Object.values(statuses)
    }
  },
  { sequelize, modelName: tableName, underscored: true }
);

StatusHistory.associate = function(models) {
  StatusHistory.belongsTo(models.Order, { constraints: false });
};

module.exports = StatusHistory;
