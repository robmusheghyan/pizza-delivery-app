import { Injectable } from '@angular/core';
import { BaseService } from '@app/services/dataservices/base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable({providedIn: 'root'})
export class MealService extends BaseService {

  constructor(http: HttpClient) {
    super(http, 'meals');
  }

  getRestaurantMeals(id: number, params?: HttpParams) {
    return this.http.get(`${environment.apiUrl}${this.url}/restaurant/${id}`, {params});
  }

  createUpdateMeal(data) {
    if (data.id) {
      return this.update(data.id, data);
    } else {
      return this.create(data);
    }
  }
}

