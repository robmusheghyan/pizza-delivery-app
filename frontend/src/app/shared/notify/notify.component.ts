import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NotifyService } from '@app/services/notify.service';


@Component({
  selector: 'notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.less'],
  animations: [
    trigger('enterAnimation', [
      transition('void => *', [
        style({opacity: 0}),
        animate('300ms', style({opacity: 1})),
      ]),
      transition('* => void', [
        style({opacity: 1}),
        animate('300ms', style({opacity: 0})),
      ]),
    ]),
  ],
})
export class NotifyComponent implements OnInit, OnDestroy {
  @Input() message = 'Something when wring';
  @Input() type = 'info'; // Infor, Warning, Error
  @Input() visible: boolean;
  @Input() duration = 5;
  @Output() visibleChange = new EventEmitter();

  source = null;
  destroy$ = new Subject();

  constructor(private notifyService: NotifyService) {
    // Notify Service Change configuration
    this.notifyService.visibleChange.subscribe(() => {
      this.visible = true;
      const interval$ = interval(1000);
      interval$.pipe(takeUntil(this.destroy$)).subscribe(r => {
        if (r > this.duration) {
          this.visible = false;
          this.destroy$.next(true);
        }
      });
    });

    this.notifyService.durationChange.subscribe(duration => {
      this.duration = duration;
    });

    this.notifyService.msgChange.subscribe(msg => {
      this.message = msg;
    });

    this.notifyService.typeChange.subscribe(type => {
      this.type = type;
    });
  }

  ngOnInit() {
  }

  onClickClose() {
    this.visible = false;
    this.destroy$.next(true);
  }

  ngOnDestroy() {
    // Stope timer when component destoryed
    this.destroy$.next(true);
  }
}
