import { Component, OnInit } from '@angular/core';
import { OrderService } from '@app/services/dataservices/order.service';
import {Order, Status, User} from '@app/models';
import { finalize, map } from 'rxjs/internal/operators';
import { NotifyService } from '@app/services/notify.service';
import { LoaderService } from '@app/services/loader.service';
import { createRequestOptions } from '@app/utils/request-utils';
import {AuthenticationService, UserService} from '@app/services';

@Component({
  templateUrl: 'order-list.component.html',
  styleUrls: ['order-list.less']
})
export class OrderListComponent implements OnInit {
  currentUser: User;
  showOrderHistory: boolean;
  orders: Order[] = [];
  userPriviligedStatuses = [0, 4];
  statuses: string[] = Object.keys(Status);

  buttonDisplayValues = {
    canceled: 'Cancel',
    confirmed: 'Confirm'
  };
  total = 0;
  offset = 0;
  limit = 20;

  constructor(private orderService: OrderService,
              private notifyService: NotifyService,
              private loaderService: LoaderService,
              private userService: UserService,
              private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe((user: any) => {
      this.currentUser = user;
      this.showOrderHistory = user && user.id !== 1;
    });
  }


  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    const data = {
      limit: this.currentUser && this.currentUser.id === 1 ? 1 : this.limit,
      offset: this.offset
    };
    const params = createRequestOptions(data);
    this.loaderService.triggerLoading.emit(true);
    this.orderService.getOrders(params).pipe(
      map((res: any) => res.data),
      finalize(() => {
        this.loaderService.triggerLoading.emit(false);
      })).subscribe((orders: any) => {
      this.orders = orders.rows;
      this.total = orders.count;
    });
  }

  statusChangeable(order) {
    const statusIndex = this.statuses.indexOf(order.status);
    return this.userPriviligedStatuses.indexOf(statusIndex) !== -1;
  }

  changeStatus(order) {
    const status = this.getNextStatus(order.status);
    const data = {status};
    this.orderService.changeOrderStatus(order.id, data).pipe(map((res: any) => res.data)).subscribe((updatedOrder: Order) => {
      this.loadOrders();
    });
  }

  getNextStatus(status) {
    const newStatusIndex = this.statuses.indexOf(status) + 1;
    return this.statuses[newStatusIndex];
  }

  getNewStatusDisplayValue(status) {
    const newStatus = this.getNextStatus(status);
    return this.buttonDisplayValues[newStatus];
  }

  changePage($event) {
    this.offset = $event.pageIndex * this.limit;
    this.loadOrders();
  }
}
