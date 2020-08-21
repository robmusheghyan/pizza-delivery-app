import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { MealService } from '@app/services/dataservices/meal.service';
import { Meal } from '@app/models';
import { map } from 'rxjs/internal/operators';

@Component({templateUrl: 'meal-create.component.html'})
export class MealCreateComponent implements OnInit {

  mealForm: FormGroup;
  meal_id: number = null;

  submitted = false;
  error = '';
  meal: Meal;
  restaurant_id: number;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private mealService: MealService) {
  }

  get f() {
    return this.mealForm.controls;
  }

  ngOnInit() {
    this.meal_id = +this.route.snapshot.queryParamMap.get('id');
    this.restaurant_id = +this.route.snapshot.queryParamMap.get('restaurant_id');
    if (this.meal_id) {
      this.mealService.get(this.meal_id).pipe(map((mealData: any) => {
        return mealData.data;
      })).subscribe((meal: Meal) => {
        this.meal = meal;
        this.buildForm();
      }, () => {
        this.router.navigate(['/']);
      });
    } else {
      this.meal = new Meal();
      this.buildForm();

    }
  }

  buildForm() {
    this.mealForm = this.formBuilder.group({
      name: [this.meal.name, Validators.required],
      description: [this.meal.description, Validators.required],
      price: [this.meal.price, [Validators.required]],
    });
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.mealForm.invalid) {
      return;
    }

    const mealData = {
      id: this.meal_id ? this.meal_id : 0,
      restaurant_id: this.restaurant_id,
      ...this.mealForm.value

    };

    this.mealService.createUpdateMeal(mealData)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate(['/restaurant/view', this.restaurant_id]);
        },
        error => {
          this.error = error;

        });
  }

  getButtonName() {
    return this.meal.id ? 'Update' : 'Create';
  }
}
