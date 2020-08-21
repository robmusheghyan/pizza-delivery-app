import { Component, Input, OnInit } from '@angular/core';

@Component({
  templateUrl: 'meal-list-item.component.html',
  selector: 'meal-list-item',
  styleUrls: ['meal-list-item.less']
})
export class MealListItemComponent implements OnInit {

  @Input() meal = null;

  ngOnInit() {

  }

}
