import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from './services';
import { User } from './models';
import {first} from "rxjs/operators";

@Component({selector: 'app', templateUrl: 'app.component.html'})
export class AppComponent {
  currentUser: User;
  isGuest: boolean;

  constructor(private router: Router,
              private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe((user: any) => {
      this.currentUser = user;
      this.isGuest = !user || user.id === 1;
    });
    this.authenticationService.login({email: 'test@test.com', password: 'testpsw'})
      .pipe(first())
      .subscribe(
        data => {
          const url = '/home/restaurants';
          this.router.navigate([url]);
        },
        error => {
          console.log('err');
        });
  }

  logout() {
    this.authenticationService.logout();
  }
}
