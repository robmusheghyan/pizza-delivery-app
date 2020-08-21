import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RestaurantDashboardComponent } from '@app/restaurant/restaurant-dashboard.component';
import { RestaurantListComponent } from '@app/restaurant/restaurant-list/restaurant-list.component';
import { OrderListComponent } from '@app/restaurant/order-list/order-list.component';
import { AuthGuard } from '@app/helpers';
import { Role } from '@app/models';
import { RestaurantCreateComponent } from '@app/restaurant/restaurant-create/restaurant-create.component';
import { MealCreateComponent } from '@app/restaurant/meal-create/meal-create.component';
import { RestaurantComponent } from '@app/restaurant/restaurant/restaurant.component';

const routes: Routes = [
  {
    path: 'restaurant', component: RestaurantDashboardComponent, canActivate: [AuthGuard], data: {roles: [Role.Owner]},
    children: [
      {path: '', component: RestaurantListComponent},
      {path: 'create-restaurant', component: RestaurantCreateComponent},
      {path: 'create-meal', component: MealCreateComponent},
      {path: 'orders', component: OrderListComponent},
      {path: 'view/:id', component: RestaurantComponent},
    ]
  },
  {path: '**', redirectTo: ' '}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RestaurantRoutingModule {
}
