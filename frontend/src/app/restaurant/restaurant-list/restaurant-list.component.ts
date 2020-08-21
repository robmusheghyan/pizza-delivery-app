import { Component, OnInit } from '@angular/core';
import { RestaurantService } from '@app/services/dataservices/restaurant.service';
import { NotifyService } from '@app/services/notify.service';
import { AuthenticationService } from '@app/services';
import { createRequestOptions } from '@app/utils/request-utils';
import { Restaurant } from '@app/models';
import { LoaderService } from '@app/services/loader.service';
import { finalize } from 'rxjs/internal/operators';

@Component({
  templateUrl: 'restaurant-list.component.html',
  styleUrls: ['restaurant-list.less']
})
export class RestaurantListComponent implements OnInit {
  restaurants: Restaurant[] = [];
  total = 0;
  offset = 0;
  limit = 20;

  constructor(private restaurantService: RestaurantService,
              private notifyService: NotifyService,
              private  authenticationService: AuthenticationService,
              private loaderService: LoaderService) {
  }

  ngOnInit() {
    this.loadRestaurants();


  }

  loadRestaurants() {
    const data = {
      user_id: this.authenticationService.currentUserValue.id,
      limit: this.limit,
      offset: this.offset
    };

    const params = createRequestOptions(data);
    this.loaderService.triggerLoading.emit(true);
    this.restaurantService.getAll(params).pipe(finalize(() => {
      this.loaderService.triggerLoading.emit(false);
    })).subscribe((req: any) => {
        this.restaurants = req.data ? req.data.rows : [];
        this.total = req.data.count;
      },
      (error) => {
        this.notifyService.notify('error', error.message);
      });
  }

  changePage($event) {
    this.offset = $event.pageIndex * this.limit;
    this.loadRestaurants();
  }

  deleteRestaurant(id) {
    this.loaderService.triggerLoading.emit(true);
    this.restaurantService.delete(id).pipe(
      finalize(() => {
        this.loaderService.triggerLoading.emit(false);
      })).subscribe((data) => {
      this.loadRestaurants();
    }, (err) => {
      this.notifyService.notify('error', err.code);
    });
  }
}
