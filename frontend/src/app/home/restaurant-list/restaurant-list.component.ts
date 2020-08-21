import { Component, OnInit } from '@angular/core';
import { RestaurantService } from '@app/services/dataservices/restaurant.service';
import { NotifyService } from '@app/services/notify.service';

@Component({
  templateUrl: 'restaurant-list.component.html',
  styleUrls: ['restaurant-list.less']
})
export class RestaurantListComponent implements OnInit {
  restaurants = [];

  constructor(private restaurantService: RestaurantService,
              private notifyService: NotifyService) {

  }

  ngOnInit() {
    this.restaurantService.getRestaurants().subscribe((data) => {
      this.restaurants = data.data.rows;
    }, (err) => {
      this.notifyService.notify('error', err);
    });
  }
}
