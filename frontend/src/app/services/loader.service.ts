import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  triggerLoading: EventEmitter<boolean> = new EventEmitter();
}
