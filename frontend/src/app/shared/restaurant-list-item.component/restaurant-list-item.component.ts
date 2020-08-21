import { Component, Input, OnInit } from '@angular/core';

@Component({
  templateUrl: 'restaurant-list-item.component.html',
  selector: 'restaurant-list-item',
  styleUrls: ['restaurant-list-item.less']
})
export class RestaurantListItemComponent implements OnInit {

  @Input() restaurant = null;

  ngOnInit() {

  }
}
