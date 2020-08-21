import { Injectable } from '@angular/core';
import { BaseService } from '@app/services/dataservices/base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class RestaurantService extends BaseService {

  constructor(http: HttpClient) {
    super(http, 'restaurants');
  }

  getRestaurant(id: number) {
    return this.get(id);
  }

  createUpdateRestaurant(data) {
    if (data.id) {
      return this.update(data.id, data);
    } else {
      return this.create(data);
    }
  }

  getRestaurants(params?) {
    return this.getAll(params);
  }
}
