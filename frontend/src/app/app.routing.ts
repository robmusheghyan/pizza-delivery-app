import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './auth/login';
import {RegisterComponent} from '@app/auth/register';
import {HomeComponent} from '@app/home';
import {NgModule} from '@angular/core';

const routes: Routes = [
  {
    path: '',
    // component: HomeComponent,
    component: LoginComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
