import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Role } from '@app/models';
import { AuthenticationService } from '@app/services';

@Component({
  templateUrl: 'register.component.html',
  styleUrls: ['register.less']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  roles = Object.keys(Role);

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private authenticationService: AuthenticationService) {
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  ngOnInit() {
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/home']);
    }
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      role: [Role.Regular, Validators.required]
    });

  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    const userData = this.registerForm.value;

    this.loading = true;
    this.authenticationService.register(userData)
      .pipe(first())
      .subscribe(
        data => {
          this.authenticationService.login(userData)
            .pipe(first())
            .subscribe(
              loginData => {
                const url = '/home/restaurants';
                this.router.navigate([url]);
              },
              error => {
                console.log('err');
              });
        },
        error => {
          this.error = error;
          this.loading = false;
        });
  }
}
