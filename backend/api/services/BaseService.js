const _ = require("lodash");

// const uid = require('uid');

class BaseService {
  constructor(Model) {
    this.Model = Model;
  }

  /**
   * getById
   *
   * The reason to have it because get method can be
   * overwritten by services like in RestaurantsService,
   * but getById should always get the id and return the model
   *
   * @param id
   * @returns {Promise<null|*>}
   */
  getById(id) {
    return this.Model.findByPk(id);
  }

  async getBy(params) {
    const model = await this.Model.findAll(params);
    if (!model || _.isEmpty(model[0])) {
      return null;
    }
    return model[0];
  }

  create(data) {
    return this.Model.create(data);
  }

  async update(id, data) {
    const model = await this.Model.findByPk(id);
    return model.update(data);
  }

  async delete(id) {
    const instance = await this.getById(id);
    if (!instance) {
      return false;
    }
    const result = await instance.destroy();
    return result;
  }

  async getList({ filters, sort, limit, offset, include }) {
    const params = {
      where: {
        ...filters
      },
      limit,
      offset,
      order: [...(sort || []), ["id", "DESC"]]
    };

    if (include) {
      params.include = [...include];
      params.distinct = true;
    }
    const list = await this.Model.findAndCountAll(params);
    if (!list) {
      return null;
    }
    return list;
  }
}

module.exports = BaseService;
