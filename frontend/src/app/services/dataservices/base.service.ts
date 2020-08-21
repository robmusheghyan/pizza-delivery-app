import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';

export class BaseService {

  constructor(public http: HttpClient, public url: string) {

  }

  create(body) {
    return this.http.post(`${environment.apiUrl}${this.url}`, body);
  }

  update(id, body, ) {
    return this.http.put<any>(`${environment.apiUrl}${this.url}/${id}`, body);
  }

  get(id) {
    return this.http.get<any>(`${environment.apiUrl}${this.url}/${id}`);
  }

  getAll(params?) {
    return this.http.get<any>(`${environment.apiUrl}${this.url}`, {params});
  }

  delete(id) {
    return this.http.delete(`${environment.apiUrl}${this.url}/${id}`);
  }

}
