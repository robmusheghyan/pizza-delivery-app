import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { HomeRoutingModule } from '@app/home/home.routing';
import { OrderListComponent } from '@app/home/order-list/order-list.component';
import { RestaurantComponent } from '@app/home/restaurant/restaurant.component';
import { RestaurantListComponent } from '@app/home/restaurant-list/restaurant-list.component';
import { HomeComponent } from '@app/home/home.component';
import { SharedModule } from '@app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    HomeRoutingModule,
    MatIconModule,
    SharedModule
  ],
  declarations: [
    HomeComponent,
    OrderListComponent,
    RestaurantComponent,
    RestaurantListComponent,
  ],
})

export class HomeModule {
}
