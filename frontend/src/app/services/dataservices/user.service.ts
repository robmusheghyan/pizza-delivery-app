import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '@app/services/dataservices/base.service';
import { environment } from '@environments/environment';

@Injectable({providedIn: 'root'})
export class UserService extends BaseService {

  constructor(http: HttpClient) {
    super(http, 'users');
  }

  blockUser(id: number, block) {
    const data: any = {};
    data.block = block;
    return this.http.post(`${environment.apiUrl}${this.url}/block/${id}`, data);
  }
}
