import { Component, Input, OnInit } from '@angular/core';
import { Meal, Status } from '@app/models';

@Component({
  templateUrl: 'order-list-item.component.html',
  selector: 'order-list-item',
  styleUrls: ['order-list-item.less']
})
export class OrderListItemComponent implements OnInit {

  @Input() order: any = {};
  status_histories = [];
  meals: Meal[] = [];
  price: number;

  ngOnInit() {
    this.status_histories = this.order.status_histories || [];
    this.meals = this.order.meals || [];
    this.updatePrice();
  }

  getLabel(status_history) {
    return Status[status_history.status];
  }

  updatePrice() {
    const meals = this.meals.map((meal) => {
      return meal.price * meal.order_meals.count;
    });
    this.price = meals.reduce((price1, price2) => price1 + price2, 0);
  }
}
