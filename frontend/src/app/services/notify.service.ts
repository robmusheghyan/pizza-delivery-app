import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {
  visibleChange: EventEmitter<boolean> = new EventEmitter();
  msgChange: EventEmitter<string> = new EventEmitter();
  durationChange: EventEmitter<number> = new EventEmitter();
  typeChange: EventEmitter<string> = new EventEmitter();

  constructor() {
  }

  notify(type: string, msg: string, duration: number = 3) {
    this.visibleChange.emit(true);
    this.typeChange.emit(type);
    this.durationChange.emit(duration);
    this.msgChange.emit(msg);
  }
}
