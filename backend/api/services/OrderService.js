const _ = require("lodash");
const BaseService = require("./BaseService");
const Order = require("../models/Order");
const StatusHistory = require("../models/StatusHistory");
const Meal = require("../models/Meal");
const User = require("../models/User");
const Restaurant = require("../models/User");

class OrderService extends BaseService {
  constructor() {
    super(Order);
  }

  async getList(params) {
    params = {
      ...params,
      filters: {
        ...params.where
      },
      include: [
        {
          model: StatusHistory
        },
        {
          model: User,
          include: [
            {
              model: User,
              as: "user_blocked_by"
            },
            {
              model: User,
              as: "owner_blocked_users"
            }
          ]
        },
        {
          model: Restaurant
        },
        {
          model: Meal
        }
      ]
    };
    let data = await super.getList(params);

    let promises = data.rows.map(order => {
      return order.getRestaurant();
    });
    let restaurants = await Promise.all(promises);
    let result = data.rows.map((order, index) => {
      const restaurant = restaurants[index];
      const orderUserBlockedBy = order.user.user_blocked_by;
      console.log(orderUserBlockedBy);
      const blocked = orderUserBlockedBy.filter(user => {
        console.log(restaurant.userId);
        return user.id === restaurant.userId;
      });
      order.blocked = !!blocked.length;
      return order;
    });

    data.rows = result;
    return data;
  }

  async create(orderData) {
    const model = await this.Model.create(orderData);
    const mealsData = orderData.order_meals;
    const uniqueMeals = mealsData.filter((meal, index, self) => {
      return self.indexOf(meal) === index;
    });

    const uniqueMealsCounted = uniqueMeals.map(meal => {
      return {
        id: meal,
        count: mealsData.filter(rawMeal => rawMeal === meal).length
      };
    });
    let promises = [];
    for (let i = 0; i < uniqueMealsCounted.length; i++) {
      promises.push(
        model.addMeal(uniqueMealsCounted[i].id, {
          through: {
            count: uniqueMealsCounted[i].count
          }
        })
      );
    }

    await Promise.all([
      ...promises,
      model.setRestaurant(orderData.restaurant_id),
      model.setUser(orderData.user_id)
    ]);
    const status = await StatusHistory.create({
      status: model.status
    });

    await model.addStatus_history(status);
    return model;
  }

  async update(id, orderData) {
    const oldModel = await this.getById(id);
    const model = await super.update(id, orderData);

    if (oldModel.status !== orderData.status) {
      const status = await StatusHistory.create({
        status: orderData.status
      });
      await model.addStatus_history(status);
    }

    return model;
  }
}

module.exports = OrderService;
