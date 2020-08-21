const _ = require("lodash");

const assignByProps = (obj, keys) => _.pick(obj, keys);

module.exports = {
  assignByProps
};
