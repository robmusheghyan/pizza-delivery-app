import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RestaurantListComponent } from '@app/home/restaurant-list/restaurant-list.component';
import { OrderListComponent } from '@app/home/order-list/order-list.component';
import { RestaurantComponent } from '@app/home/restaurant/restaurant.component';
import { HomeComponent } from '@app/home/home.component';
import { AuthGuard } from '@app/helpers';
import { Role } from '@app/models';
import { CanDeactivateGuard } from '@app/guards/can-deactivate.guard';

const routes: Routes = [
  {
    path: 'home', component: HomeComponent, data: {roles: [Role.Regular]},
    children: [
      {path: 'restaurants', component: RestaurantComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'orders', component: OrderListComponent},
      {path: 'restaurant/:id', component: RestaurantComponent, canDeactivate: [CanDeactivateGuard]},
      {path: '', redirectTo: 'restaurants', pathMatch: 'full'},
      {path: '**', redirectTo: 'restaurants'}
    ]
  },

];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {
}
