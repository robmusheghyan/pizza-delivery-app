import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { RestaurantService } from '@app/services/dataservices/restaurant.service';
import { Restaurant } from '@app/models';

@Component({templateUrl: 'restaurant-create.component.html'})
export class RestaurantCreateComponent implements OnInit {

  restaurantForm: FormGroup;
  restaurant_id: number = null;
  submitted = false;
  error = '';
  restaurant: Restaurant;


  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private restaurantService: RestaurantService) {

  }

  get f() {
    return this.restaurantForm.controls;
  }

  ngOnInit() {

    this.restaurant_id = +this.route.snapshot.queryParamMap.get('id');
    if (this.restaurant_id) {

      this.restaurantService.get(this.restaurant_id).subscribe((restaurant: any) => {
        this.restaurant = restaurant.data;
        this.buildForm();

      }, () => {
        this.router.navigate(['/']);
      });
    } else {
      this.restaurant = new Restaurant();
      this.buildForm();
    }
  }

  buildForm() {
    this.restaurantForm = this.formBuilder.group({
      name: [this.restaurant.name, Validators.required],
      description: [this.restaurant.description, Validators.required],
    });
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.restaurantForm.invalid) {
      return;
    }

    const restData = {
      id: this.restaurant_id,
      ...this.restaurantForm.value
    };

    this.restaurantService.createUpdateRestaurant(restData)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate(['/restaurant']);
        },
        error => {
          this.error = error;

        });
  }

  getButtonName() {
    return this.restaurant.id ? 'Update' : 'Create';
  }
}
