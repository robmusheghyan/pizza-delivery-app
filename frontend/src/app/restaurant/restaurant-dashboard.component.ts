import { Component, OnInit } from '@angular/core';

import { User } from '@app/models';
import { AuthenticationService } from '@app/services';

@Component({
  templateUrl: 'restaurant-dashboard.component.html',
})
export class RestaurantDashboardComponent implements OnInit {
  loading = false;
  currentUser: User;

  constructor(private authService: AuthenticationService) {
  }

  ngOnInit() {
    this.loading = true;
    this.authService.currentUser.subscribe((userData: any) => this.currentUser = userData);
  }
}
