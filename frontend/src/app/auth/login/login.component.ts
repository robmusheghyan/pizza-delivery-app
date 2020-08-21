import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '@app/services';

@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['login.less']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private authenticationService: AuthenticationService) {

  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  ngOnInit() {
    if (this.authenticationService.currentUserValue) {
      const url = '/home';
      this.router.navigate([url]);
    }

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    const loginData = this.loginForm.value;
    this.loading = true;

    this.authenticationService.login(loginData)
      .pipe(first())
      .subscribe(
        data => {
          const url = '/home';
          this.loading = false;
          this.router.navigate([url]);
        },
        error => {
          this.error = error;
          this.loading = false;
        });
  }
}
