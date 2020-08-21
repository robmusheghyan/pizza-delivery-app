import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/models';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class AuthenticationService {
  public currentUser: Observable<User>;
  public currentUserData: Observable<User>;
  private currentUserSubject: BehaviorSubject<User>;
  private currentUserDataSubject: BehaviorSubject<User>;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUserData')));
    this.currentUser = this.currentUserSubject.asObservable();
    this.currentUserDataSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUserData = this.currentUserDataSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public get getCurrentUserDataValue(): any {
    return this.currentUserDataSubject.value;
  }

  login(data: any) {
    return this.http.post<any>(`${environment.apiUrl}auth/login/`, data)
      .pipe(map(user => {
        // login successful if there's a jwt token in the response
        if (user && user.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('currentUserData', JSON.stringify(user.user));
          this.currentUserSubject.next(user.user);
          this.currentUserDataSubject.next(user);
        }
        return user;
      }));
  }

  register(data: any) {
    return this.http.post<any>(`${environment.apiUrl}auth/register/`, data)
      .pipe(map(user => {
        // login successful if there's a jwt token in the response
        if (user && user.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('currentUserData', JSON.stringify(user.user));
          this.currentUserSubject.next(user.user);
        }

        return user;
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentUserData');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}
