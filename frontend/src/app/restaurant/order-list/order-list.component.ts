import { Component, OnInit } from '@angular/core';
import { OrderService } from '@app/services/dataservices/order.service';
import { UserService } from '@app/services/dataservices/user.service';
import { Order, Status } from '@app/models';
import { finalize, map } from 'rxjs/internal/operators';
import { NotifyService } from '@app/services/notify.service';
import { LoaderService } from '@app/services/loader.service';
import { createRequestOptions } from '@app/utils/request-utils';

@Component({
  templateUrl: 'order-list.component.html',
  styleUrls: ['order-list.less']
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  userPriviligedStatuses = [0, 2, 3];
  statuses: string[] = Object.keys(Status);
  buttonDisplayValues = {
    processed: 'Process',
    in_route: 'Send',
    delivered: 'Deliver',
  };

  total = 0;
  offset = 0;
  limit = 20;

  constructor(private orderService: OrderService,
              private userService: UserService,
              private notifyService: NotifyService,
              private loaderService: LoaderService) {

  }

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    const data = {
      limit: this.limit,
      offset: this.offset
    };
    const params = createRequestOptions(data);
    this.loaderService.triggerLoading.emit(true);
    this.orderService.getOrders(params).pipe(
      map((res: any) => res.data),
      finalize(() => {
        this.loaderService.triggerLoading.emit(false);
      })
    ).subscribe((ordersData) => {
      this.orders = ordersData.rows;
      this.total = ordersData.count;
    });
  }

  statusChangeable(order) {
    const statusIndex = this.statuses.indexOf(order.status);
    return this.userPriviligedStatuses.indexOf(statusIndex) !== -1;
  }

  changeStatus(order) {
    const status = this.getNextStatus(order.status);
    const data = {status};

    this.loaderService.triggerLoading.emit(true);
    this.orderService.changeOrderStatus(order.id, data).pipe(
      map((res: any) => res.data),
      finalize(() => {
        this.loaderService.triggerLoading.emit(false);
      })
    ).subscribe((updatedOrder: Order) => {
      this.loadOrders();
    }, (err) => {
      this.notifyService.notify('error', err.code);
    });
  }

  getNextStatus(status) {
    let newStatusIndex = this.statuses.indexOf(status) + 1;
    if (newStatusIndex === 1) {
      newStatusIndex++;
    }
    return this.statuses[newStatusIndex];
  }

  getNewStatusDisplayValue(status) {
    const newStatus = this.getNextStatus(status);
    return this.buttonDisplayValues[newStatus];
  }

  blockUser(order) {
    this.loaderService.triggerLoading.emit(true);
    this.userService.blockUser(order.user_id, !order.blocked).pipe(
      finalize(() => {
        this.loaderService.triggerLoading.emit(false);
      })).subscribe((res: any) => {
        const msg = res.data === 1 ? 'unblocked' : 'blocked';
        this.loadOrders();
        this.notifyService.notify('info', 'User is ' + msg);
      },
      (error) => {
        this.notifyService.notify('error', error);
      }
    );
  }

  changePage($event) {
    this.offset = $event.pageIndex * this.limit;
    this.loadOrders();
  }

  getBlockButtonName(blocked) {
    return blocked ? 'Unblock' : 'Block';
  }
}
