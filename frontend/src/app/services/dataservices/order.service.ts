import { Injectable } from '@angular/core';
import { BaseService } from '@app/services/dataservices/base.service';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class OrderService extends BaseService {

  constructor(private httpClient: HttpClient) {
    super(httpClient, 'order');
  }

  getById(id: number) {
    return this.getById(id);
  }

  getOrders(params?) {
    return this.getAll(params);
  }

  changeOrderStatus(id, data) {
    return this.httpClient.put<any>(`${environment.apiUrl}${this.url}/changeStatus/${id}`, data);
  }
}
