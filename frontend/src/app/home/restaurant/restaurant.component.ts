import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MealService } from '@app/services/dataservices/meal.service';
import { RestaurantService } from '@app/services/dataservices/restaurant.service';
import { combineLatest } from 'rxjs';
import { OrderService } from '@app/services/dataservices/order.service';
import { catchError, finalize, map } from 'rxjs/internal/operators';
import { Meal, Restaurant } from '@app/models';
import { NotifyService } from '@app/services/notify.service';
import { LoaderService } from '@app/services/loader.service';

@Component({
  templateUrl: 'restaurant.component.html',
  styleUrls: ['restaurant.less']
})
export class RestaurantComponent implements OnInit {
  restaurant_id: number = null;
  restaurant: any = {};
  meals: any = [];
  order_meals_raw = [];
  order_meals = [];
  price = 0;


  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private mealService: MealService,
              private restaurantService: RestaurantService,
              private orderService: OrderService,
              private notifyService: NotifyService,
              private loaderService: LoaderService, ) {
  }

  // convenience getter for easy access to form fields

  ngOnInit() {
    this.loaderService.triggerLoading.emit(true);
    this.restaurant_id = 1;
    const mealsObservable = this.mealService.getRestaurantMeals(this.restaurant_id).pipe(map((res: any) => {
        return res.data.rows as Meal[];
      }),
      catchError((err) => {
        const message = err.message ? err.message : 'Can\'t load meals from the selected restaurant';
        throw {error: true, message};
      })
    );
    const restObservable = this.restaurantService.getRestaurant(this.restaurant_id).pipe(map((res: any) => {
        return res as Restaurant;
      }),
      catchError((err) => {
        const message = err.message ? err.message : 'Can\'t get meals from the selected restaurant';
        throw {error: true, message};
      })
    );
    combineLatest(mealsObservable, restObservable).pipe(
      finalize(() => this.loaderService.triggerLoading.emit(false))
    ).subscribe(
      ([meals, restaurant]) => {
        this.meals = meals;
        this.restaurant = restaurant;
      }, (errors) => {
        this.notifyService.notify('error', errors.message);
        this.navigateHome();
      });
  }

  addToCart(meal) {
    this.order_meals_raw.push(meal);
    this.updateList();

    this.updatePrice();
  }

  removeFromCart(meal) {
    this.order_meals_raw = this.order_meals_raw.filter(mealRaw => mealRaw !== meal);
    this.updateList();
    this.updatePrice();
  }

  updatePrice() {
    this.price = this.order_meals_raw.map((meal) => meal.price).reduce((next, prev) => next + prev, 0);
  }

  createOrder() {

    const order_data = {
      restaurant_id: this.restaurant_id,
      order_meals: this.order_meals_raw.map((meal) => meal.id)
    };

    this.loaderService.triggerLoading.emit(true);
    this.orderService.create(order_data).pipe(
      finalize(() => this.loaderService.triggerLoading.emit(false)))
      .subscribe(() => {
          this.order_meals = [];
          this.router.navigate(['/home/orders']);
        },
        (err) => {
          this.notifyService.notify('error', err);
        });
  }

  navigateHome() {
    this.router.navigate(['/home']);
  }

  canDeactivate() {
    if (this.order_meals.length > 0) {
      return window.confirm('You have unfinished order, if you redirect  you will lose some data. Do you want to leave the page?');
    } else {
      return true;
    }
  }

  updateList() {

    const uniqueMeals = (value, index, self) => {
      return self.indexOf(value) === index;
    };

    const uniqueMealsArr = this.order_meals_raw.filter(uniqueMeals);

    this.order_meals = uniqueMealsArr.map((meal) => {
      return {
        meal,
        count: this.order_meals_raw.filter((mealRaw) => {
          return mealRaw === meal;
        }).length
      };
    });
  }

  changeCount(meal) {
    const currentCount = this.order_meals_raw.filter((mealRaw) => {
      return mealRaw === meal.meal;
    }).length;
    if (meal.count > currentCount) {
      const diff = meal.count - currentCount;
      const meals = Array(diff).fill(meal.meal);
      this.order_meals_raw.push(...meals);
    } else {
      let diff = currentCount - meal.count;
      while (diff) {
        const index = this.order_meals_raw.lastIndexOf(meal.meal);
        this.order_meals_raw.splice(index, 1);
        diff--;
      }
    }
    this.updateList();
    this.updatePrice();

  }
}
