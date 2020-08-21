const BaseService = require("./BaseService");
const Restaurants = require("../models/Restaurant");
const User = require("../models/User");

class RestaurantsService extends BaseService {
  constructor() {
    super(Restaurants);
  }

  async create(data) {
    const restaurantModel = await super.create(data);
    if (data.user_id) {
      await restaurantModel.setUser(data.user_id);
    }

    return restaurantModel;
  }

  async getList(params) {
    params = {
      ...params,
      filters: {
        ...params.where
      },
      include: [
        {
          model: User,
          include: [
            {
              model: User,
              as: "owner_blocked_users"
            }
          ]
        }
      ]
    };
    let data = await super.getList(params);

    let result = data.rows.map(restaurant => {
      const ownerBlockedUsers = restaurant.user.owner_blocked_users;
      const blocked = ownerBlockedUsers.filter(user => {
        return user.id === params.customer_id;
      });
      restaurant.blocked = !!blocked.length;
      return restaurant;
    });
    data.rows = result;
    return data;
  }
}

module.exports = RestaurantsService;
