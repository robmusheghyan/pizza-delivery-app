import { Component, OnInit } from '@angular/core';

import { User } from '@app/models';
import { AuthenticationService } from '@app/services';

@Component({
  templateUrl: 'home.component.html',
  styleUrls: ['home.less']
})
export class HomeComponent implements OnInit {
  loading = false;
  currentUser: User;

  constructor(private authService: AuthenticationService) {

  }

  ngOnInit() {
    this.loading = true;
    this.authService.currentUser.subscribe((user: User) => this.currentUser = user);
  }
}
