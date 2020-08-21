import { NgModule } from '@angular/core';
import { RestaurantListItemComponent } from '@app/shared/restaurant-list-item.component/restaurant-list-item.component';
import { MealListItemComponent } from '@app/shared/meal-list-item.component.ts/meal-list-item.component';
import { CommonModule } from '@angular/common';
import { OrderListItemComponent } from '@app/shared/order-list-item/order-list-item.component';
import { MatExpansionModule, MatIconModule, MatPaginatorModule, MatTooltipModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotifyComponent } from '@app/shared/notify/notify.component';
import { LoaderComponent } from '@app/shared/loader/loader.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';


@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    MatExpansionModule,
    BrowserAnimationsModule,
    MatIconModule,
    NgbModule
  ],
  declarations: [
    NotifyComponent,
    LoaderComponent,
    RestaurantListItemComponent,
    MealListItemComponent,
    OrderListItemComponent,
  ],
  exports: [
    BrowserAnimationsModule,
    RestaurantListItemComponent,
    MealListItemComponent,
    OrderListItemComponent,
    NotifyComponent,
    LoaderComponent,
    MatIconModule,
    MatPaginatorModule,
    MatTooltipModule,
    NgbModule,
    FormsModule
  ],
})

export class SharedModule {
}
