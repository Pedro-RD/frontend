import { Routes } from '@angular/router';
import {FormLoginComponent} from './pages/form-login/form-login.component';
import {UsersTableComponent} from './components/users-table/users-table.component';

export const routes: Routes = [
  {path:'', component: FormLoginComponent},
  {path: 'users', component:UsersTableComponent}
];
