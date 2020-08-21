import { Component, OnInit } from '@angular/core';
import { LoaderService } from '@app/services/loader.service';

@Component({
  selector: 'loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.less']
})
export class LoaderComponent implements OnInit {

  loading = false;

  constructor(private loaderService: LoaderService) {
    this.loaderService.triggerLoading.subscribe(loading => {
      this.loading = loading;
    });
  }

  ngOnInit() {
  }

}
