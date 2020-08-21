import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MealCreateComponent } from '@app/restaurant/meal-create/meal-create.component';
import { RestaurantDashboardComponent } from '@app/restaurant/restaurant-dashboard.component';
import { OrderListComponent } from '@app/restaurant/order-list/order-list.component';
import { RestaurantComponent } from '@app/restaurant/restaurant/restaurant.component';
import { RestaurantCreateComponent } from '@app/restaurant/restaurant-create/restaurant-create.component';
import { RestaurantListComponent } from '@app/restaurant/restaurant-list/restaurant-list.component';
import { RestaurantRoutingModule } from '@app/restaurant/restaurant.routing';
import { SharedModule } from '@app/shared/shared.module';
import { MatIconModule } from '@angular/material';


@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    RestaurantRoutingModule,
    SharedModule,
    MatIconModule,
  ],
  declarations: [
    RestaurantDashboardComponent,
    MealCreateComponent,
    OrderListComponent,
    RestaurantComponent,
    RestaurantListComponent,
    RestaurantCreateComponent,
  ],
})

export class RestaurantModule {
}
