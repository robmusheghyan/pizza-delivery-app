module.exports.all = [
  "placed",
  "canceled",
  "processed",
  "in_route",
  "delivered",
  "confirmed"
];

module.exports.userAllowed = {
  placed: "canceled",
  delivered: "confirmed"
};

module.exports.ownerAllowed = {
  placed: "processed",
  processed: "in_route",
  in_route: "delivered"
};
