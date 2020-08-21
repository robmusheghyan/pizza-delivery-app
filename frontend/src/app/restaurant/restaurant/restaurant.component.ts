import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MealService } from '@app/services/dataservices/meal.service';
import { finalize, map } from 'rxjs/internal/operators';
import { Meal } from '@app/models';
import { LoaderService } from '@app/services/loader.service';
import { NotifyService } from '@app/services/notify.service';
import { createRequestOptions } from '@app/utils/request-utils';

@Component({
  templateUrl: 'restaurant.component.html',
  styleUrls: ['restaurant.less']
})
export class RestaurantComponent implements OnInit {
  meals: Meal[] = [];
  total = 0;
  offset = 0;
  limit = 20;

  restaurant_id: number;

  constructor(private mealService: MealService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private loaderService: LoaderService,
              private notifyService: NotifyService) {

  }

  ngOnInit() {
    this.restaurant_id = +this.activatedRoute.snapshot.paramMap.get('id');
    this.loadMeals();
  }

  loadMeals() {
    const data = {
      limit: this.limit,
      offset: this.offset
    };
    const params = createRequestOptions(data);
    if (this.restaurant_id) {
      this.loaderService.triggerLoading.emit(true);
      this.mealService.getRestaurantMeals(this.restaurant_id, params).pipe(
        map((res: any) => {
          return res.data ? res.data : [];
        }),
        finalize(() => {
          this.loaderService.triggerLoading.emit(false);
        })).subscribe((mealsData) => {
        this.meals = mealsData.rows;
        this.total = mealsData.count;
      }, (error) => {
        this.notifyService.notify('error', error);
        this.router.navigate(['/restaurant']);
      });
    } else {
      this.router.navigate(['/restaurant']);
    }
  }

  deleteMeal(id) {
    this.loaderService.triggerLoading.emit(true);
    this.mealService.delete(id).pipe(
      finalize(() => {
        this.loaderService.triggerLoading.emit(false);
      })).subscribe((data) => {
      this.loadMeals();
    }, (err) => {
      this.notifyService.notify('error', err.code);
    });
  }

  changePage($event) {
    this.offset = $event.pageIndex * this.limit;
    this.loadMeals();
  }
}
